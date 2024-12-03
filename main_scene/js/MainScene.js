import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import ButtonCube from "./shapes/ButtonCube.js";
import RemoteCube from "./shapes/RemoteCube.js";
import GuiControls from "./UI_tools/GuiControls.js";
import Lights from "./Lights.js";
import Floor from "./Floor.js";
import Interaction from "./Interaction.js";
import {RoundedBoxGeometry} from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import FirebaseConfig from "./FirebaseConfig.js";
import FirebaseListener from "./FirebaseListener.js";
import {loadModels} from "./loader.js";
import {modelDescriptors} from "./modelDescriptors.js";

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
        this.meshes = [];
        this.mixers = [];
        this.clock = new THREE.Clock();
        this.arrayModels = modelDescriptors;

        this.preload();
        this.init();
    }

    async init() {
        await this.loadConfig();

        this.initializeBasicSettings();
        this.setupRenderer();
        this.setupCamera();
        this.setupControls();
        this.setupLights();
        this.createModels();
        this.setupEventListeners();
        this.setupGUI();

        //this.setupInteraction();
        this.render();

        // this.firebaseListener = new FirebaseListener(this.cubes);
    }

    preload() {
        loadModels(this.arrayModels)
            .then((models) => {
                this.models = models;
            });
    }

    /**
     * Initialise les paramètres de base de la scène
     */
    initializeBasicSettings() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color("#f69f46");

        this.params = {
            color: 0xffffff,
            transmission: 1,
            opacity: 1,
            metalness: 0,
            roughness: 0,
            ior: 1.5,
            thickness: 0.01,
            specularIntensity: 1,
            specularColor: 0xffffff,
            envMapIntensity: 1,
            transparentMaterial: false,
            isAnimating: false,
            animationSpeed: 0.005,
            amplitude: 1.5,
            phaseOffset: 20,
            downwardOffset: 1.5,
        };
    }

    createModels() {

        this.models.forEach((model) => {
            let obj = model.object;
            const pos = model.props.position;
            const scale = model.props.scale;
            const rot = model.props.rotation;
            obj.position.set(pos.x, pos.y, pos.z);
            obj.scale.set(scale.x, scale.y, scale.z);
            obj.rotation.set(rot.x, rot.y, rot.z);

            let material = new THREE.MeshStandardMaterial({
                color: 0xffffff,
            })

            obj.traverse((child) => {
                if (child.isMesh) {
                    child.material = material;
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            })

            this.scene.add(obj);
            this.meshes.push(obj);

            if (model.animated) {
                const mixer = new THREE.AnimationMixer(obj);
                let action = mixer.clipAction(obj.animations[0]).play();
                action.play();
                this.mixers.push(mixer);
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
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setClearColor("#f0e6e6");
        document.body.appendChild(this.renderer.domElement);
    }

    /**
     * Configure la caméra orthographique
     */
    setupCamera() {
        const aspect = window.innerWidth / window.innerHeight;
        const viewSize = 10;
        this.camera = new THREE.OrthographicCamera(
            -viewSize * aspect,
            viewSize * aspect,
            viewSize,
            -viewSize,
            -50,
            100
        );
/*
        this.camera = new THREE.PerspectiveCamera(
            45,
            aspect,
            1,
            1000
        );*/
        this.camera.position.set(14, 15, 15);
        this.camera.lookAt(0, 0, 0);
    }

    /**
     * Configure les contrôles de la caméra
     */
    setupControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        /*this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.screenSpacePanning = true;
        this.controls.minDistance = 10;
        this.controls.maxDistance = 50;*/
    }

    /**
     * Configure l'éclairage de la scène
     */
    setupLights() {
        this.lights = new Lights(this.scene);
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
        this.guiControls = new GuiControls(this.params, () =>
            this.updateMaterials()
        );
    }

    /**
     * Configure l'interaction avec les cubes
     */
    setupInteraction() {
        this.interaction = new Interaction(this.camera, this.scene, this.cubes);
    }

    /**
     * Boucle de mise à jour pour l'animation
     */
    update() {
        if (this.controls) {
            this.controls.update();
        }

       /* if (this.interaction) {
            this.interaction.update();
        }*/
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
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    /**
     * Met à jour les matériaux pour tous les cubes
     */
    updateMaterials() {
        this.cubes.forEach((cube, index) => {
            if (!this.params.isAnimating) cube.updateMaterial(this.params, index);
        });
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
