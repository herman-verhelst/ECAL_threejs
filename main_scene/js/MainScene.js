import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import GuiControls from "./UI_tools/GuiControls.js";
import Lights from "./Lights.js";
import Interaction from "./Interaction.js";
import {RoundedBoxGeometry} from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import FirebaseConfig from "./FirebaseConfig.js";
import FirebaseListener from "./FirebaseListener.js";
import {loadModels} from "./loader.js";
import {modelDescriptors} from "./modelDescriptors.js";
import {FruitController} from "./fruits/FruitController.js";
import {setLocation} from "./utils/LocationUtil.js";
import {setEmissiveMaterial, setMaterial, setMaterialOnLoadedModels} from "./utils/MaterialUtil.js";
import Floor from "./Floor.js";
import {materials} from "./materials/Materials.js";
import Button from "./Button.js";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import {SphereGeometry} from "three";


/**
 * Classe principale qui gère la scène 3D
 * Cette classe coordonne tous les éléments : cubes, lumières, animations, etc.
 */
export default class MainScene {
    /**
     * Initialise la scène avec les paramètres par défaut
     */
    constructor() {
        // Le constructeur ne peut pas être async, on délègue l'init

        this.models = [];
        this.fruitControllers = [];

        this.meshes = [];
        this.mixers = [];

        this.clock = new THREE.Clock();
        this.arrayModels = modelDescriptors;

        this.buttons = [];
        this.init();


    }

    async init() {
        await this.loadConfig();
        this.preload()
            .then(() => {
                this.initializeBasicSettings();
                this.setupRenderer();
                this.setupCamera();
                //this.setupControls();
                this.setupLights();
                this.setupBloom();
                this.setupFloor();
                this.createModels();
                this.setupEventListeners();
                this.setupGUI();
                this.setupInteraction();
                this.FirebaseListener = new FirebaseListener(this.fruitControllers);
                this.render();
            });
    }

    preload() {
        return loadModels(this.arrayModels)
            .then((models) => {
                this.models = models;
            });
    }

    /**
     * Initialise les paramètres de base de la scène
     */
    initializeBasicSettings() {
        this.scene = new THREE.Scene();

        this.params = {
            spotLightX: 30,
            spotLightY: 12,
            spotLightZ: 10,
            spotLightIntensity: 2000,
            dirLightX: -8,
            dirLightY: 50,
            dirLightZ: 33,
            dirLightIntensity: 5,
            ambientLightIntensity: .5,
        };
    }

    createButtons(cubePositions, group, otherUids) {

        for (let i = 0; i < cubePositions.length; i++) {
            const position = cubePositions[i];

            let cube = new THREE.Mesh();
            cube.geometry = new RoundedBoxGeometry(1, 1, 1, 3, .05);
            cube.scale.set(1.5, 1, 1.5);
            cube.rotation.set(0, 0, 0);
            cube.position.set(position.x, position.y, position.z);
            setMaterial(cube, materials.button);

            let accent = new THREE.Mesh();
            accent.geometry = new SphereGeometry(.2, 32, 16);
            accent.scale.set(1, 1, 1);
            accent.rotation.set(0, 0, 0);
            accent.position.set(position.x, position.y + .5, position.z);
            setEmissiveMaterial(accent, otherUids[i].color, otherUids[i].emissiveIntensity);

            group.add(cube, accent);
            this.buttons.push(new Button({
                target: otherUids[i].uid,
                mesh: cube,
                accent: accent,
                id: 'haha'
            }));
        }
    }

    createModels() {
        //this.createButtons();

        this.models.forEach((model) => {
            if (model.type === 'fruit') {
                let fruitController = new FruitController(this.scene, model)
                this.fruitControllers.push(fruitController);
            }
            else if (model.isButton) {
                let object = model.object;

                const cubePositions = [
                    {x: 0, y: .3, z: 0},
                    {x: 2, y: .3, z: 0},
                    {x: 0, y: .3, z: -2},
                ]

                let buttonGroup = new THREE.Group();
                buttonGroup.add(object);
                this.createButtons(cubePositions, buttonGroup, this.otherUIDs.slice(0,3))

                setLocation(model.props, buttonGroup);
                setMaterialOnLoadedModels(model);

                this.scene.add(buttonGroup);

                if (model.mirrored) {
                    let mirroredObject = model.object.clone();

                    let buttonGroup = new THREE.Group();
                    buttonGroup.add(mirroredObject);

                    this.createButtons(cubePositions, buttonGroup, this.otherUIDs.slice(3,6))

                    setLocation(model.props, buttonGroup, true);
                    setMaterialOnLoadedModels(model);
                    this.scene.add(buttonGroup);
                }
            }
            else {
                let object = model.object;
                setLocation(model.props, object);
                setMaterialOnLoadedModels(model);
                this.scene.add(object);
            }
        });
    }

    /**
     * Configure le rendu WebGL
     */
    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.VSMShadowMap;
        this.renderer.setClearColor("#f0e6e6");
        document.body.appendChild(this.renderer.domElement);
    }

    /**
     * Configure la caméra orthographique
     */
    setupCamera() {
        const aspect = window.innerWidth / window.innerHeight;
        const viewSize = 8;
        this.camera = new THREE.OrthographicCamera(
            -viewSize * aspect,
            viewSize * aspect,
            viewSize,
            -viewSize,
            -50,
            100
        );
        this.camera.position.set(10, 13, 10);
        this.camera.lookAt(0, 3, 0)

    }

    /**
     * Configure les contrôles de la caméra
     */
    setupControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.screenSpacePanning = true;
        this.controls.minDistance = 10;
        this.controls.maxDistance = 50;
    }

    /**
     * Configure l'éclairage de la scène
     */
    setupLights() {
        this.lights = new Lights(this.scene);
    }

    setupBloom() {
        // EffectComposer for post-processing
        this.composer = new EffectComposer(this.renderer);

// RenderPass: renders the scene as the first step
        const renderPass = new RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);

// UnrealBloomPass: adds the bloom effect
        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight), // resolution
                .5, // strength
            0.4, // radius
            0.85 // threshold
        );
        this.composer.addPass(bloomPass);

    }

    setupFloor() {
        this.floor = new Floor(this.scene);
    }

    /**
     * Configure les écouteurs d'événements
     */
    setupEventListeners() {
        this.onResize = this.onResize.bind(this);
        this.render = this.render.bind(this);
        window.addEventListener("resize", this.onResize);

        window.addEventListener('keydown', (e) => {
            this.fruitControllers.forEach((fruitController) => {
                //if (!fruitController.isAnimating) fruitController.startAnimation();
                if (e.key === 'Enter') fruitController.checkAnimation();
            })
        })

        for (let i = 0; i < this.fruitControllers.length; i++) {
            window.addEventListener('keydown', (e) => {
                if (e.key == i + 1) this.fruitControllers[i].checkAnimation();
            })
        }
    }

    /**
     * Configure les contrôles GUI
     */
    setupGUI() {
        this.guiControls = new GuiControls(this.params, () => {
                this.lights.update(this.params);
            }
        );
    }

    /**
     * Configure l'interaction avec les cubes
     */
    setupInteraction() {
        this.interaction = new Interaction(this.camera, this.scene, this.buttons);
    }

    /**
     * Boucle de mise à jour pour l'animation
     */
    update() {
        const delta = this.clock.getDelta();

        if (this.controls) {
            this.controls.update();
        }

        this.mixers.forEach((mixer) => {
            mixer.update(delta);
        });

        this.fruitControllers.forEach((fruitController) => {
            fruitController.tick();
        })
    }

    /**
     * Boucle de rendu
     */
    render() {
        requestAnimationFrame(this.render);
        this.update();
        this.composer.render();
    }

    /**
     * Gère le redimensionnement de la fenêtre
     */
    onResize() {
        const aspect = window.innerWidth / window.innerHeight;
        const viewSize = 10;

        this.camera.left = -viewSize * aspect;
        this.camera.right = viewSize * aspect;
        this.camera.top = viewSize;
        this.camera.bottom = -viewSize;
        //this.camera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    /**
     * Nettoie les ressources
     */
    cleanup() {
        if (this.guiControls) this.guiControls.destroy();
        if (this.lights) this.lights.dispose();
        if (this.interaction) this.interaction.dispose();
        window.removeEventListener("resize", this.onResize);
    }

    /**
     * Charge la configuration depuis le fichier JSON
     */
    loadConfig() {
        return new Promise(async (resolve) => {
            try {
                const response = await fetch("json/Config.json");
                const config = await response.json();

                const urlParams = new URLSearchParams(window.location.search);
                const uid = urlParams.get("uid");

                FirebaseConfig.UID = uid || config.UID;
                FirebaseConfig.NAME = config.NAME;
                FirebaseConfig.reset();

                this.otherUIDs = config.OTHERS.map((other) => ({
                    name: other.name,
                    uid: other.uid,
                    title: other.title,
                    color: other.color,
                    emissiveIntensity: other.emissiveIntensity,
                }));
            } catch (error) {
                console.error("Erreur lors du chargement de la configuration:", error);
            }
            resolve();
        });
    }
}
