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
import {setMaterial, setMaterialOnLoadedModels} from "./utils/MaterialUtil.js";
import Floor from "./Floor.js";
import {materials} from "./materials/Materials.js";
import Button from "./Button.js";

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

        window.addEventListener('keydown', (e) => {
            this.fruitControllers.forEach((fruitController) => {
                //if (!fruitController.isAnimating) fruitController.startAnimation();
                if (e.key === 'Enter') fruitController.animate();
            })
        })
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

    createButtons() {
        let cubePositions = [
            {x: -5, y: 1.1, z: 12},
            {x: -5, y: 1.1, z: 10},
            {x: -3, y: 1.1, z: 10},
            {x: 12, y: 1.1, z: -5},
            {x: 10, y: 1.1, z: -5},
            {x: 10, y: 1.1, z: -3},
        ]

        for (let i = 0; i < cubePositions.length; i++) {
            const position = cubePositions[i];

            let cube = new THREE.Mesh();
            cube.geometry = new RoundedBoxGeometry(1, 1, 1, 3, .05);
            cube.scale.set(1.5, 1, 1.5);
            cube.rotation.set(0, 0, 0);
            cube.position.set(position.x, position.y, position.z);
            setMaterial(cube, materials.button);

            this.scene.add(cube);
            this.buttons.push(new Button({
                target: this.otherUIDs[i].uid,
                mesh: cube,
                id: 'haha'
            }));
        }
    }

    createModels() {
        this.createButtons();

        this.models.forEach((model) => {
            if (model.type === 'fruit') {
                let fruitController = new FruitController(this.scene, model)
                this.fruitControllers.push(fruitController);
            } else {
                let object = model.object;

                setLocation(model.props, object);
                setMaterialOnLoadedModels(model);
                this.scene.add(object);

                if (model.mirrored) {
                    let mirroredObject = model.object.clone();
                    setLocation(model.props, mirroredObject, true);
                    setMaterialOnLoadedModels(model);
                    this.scene.add(mirroredObject);
                }
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
        this.renderer.render(this.scene, this.camera);
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
     * Met à jour les matériaux pour tous les cubes
     */
    updateMaterials() {

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
                }));
            } catch (error) {
                console.error("Erreur lors du chargement de la configuration:", error);
            }
            resolve();
        });
    }
}
