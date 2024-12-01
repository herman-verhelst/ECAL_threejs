import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import ButtonCube from "./shapes/ButtonCube.js";
import RemoteCube from "./shapes/RemoteCube.js";
import GuiControls from "./UI_tools/GuiControls.js";
import Lights from "./Lights.js";
import Floor from "./Floor.js";
import Interaction from "./Interaction.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import FirebaseConfig from "./FirebaseConfig.js";
import FirebaseListener from "./FirebaseListener.js";

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
    this.init();
  }

  async init() {
    await this.loadConfig();

    this.initializeBasicSettings();
    this.setupRenderer();
    this.setupCamera();
    this.setupControls();
    this.setupLights();
    this.setupEventListeners();
    this.setupGUI();
    this.createFloor();

    await this.loadMatrixPattern();
    this.setupInteraction();
    this.render();

    this.firebaseListener = new FirebaseListener(this.cubes);
  }

  /**
   * Initialise les paramètres de base de la scène
   */
  initializeBasicSettings() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("#575656");

    this.cubeSize = 4;
    this.cubeSpacing = Math.max(this.cubeSize + 0.4, 6);
    this.gridRows = 3;
    this.gridColumns = 4;

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

  /**
   * Configure le rendu WebGL
   */
  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
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
    this.camera.position.set(14, 15, 15);
    this.camera.lookAt(0, 0, 0);
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
   * Charge le motif initial de la matrice
   */
  async loadMatrixPattern() {
    try {
      const response = await fetch("json/grid.json");
      const matrix = await response.json();

      if (
        !matrix ||
        matrix.length !== this.gridRows ||
        matrix[0].length !== this.gridColumns
      ) {
        throw new Error("Dimensions de matrice invalides");
      }

      this.matrix = matrix;
      this.createCubes();
    } catch (error) {
      console.error("Erreur lors du chargement de grid.json:", error);
      this.matrix = Array(this.gridRows)
        .fill()
        .map(() => Array(this.gridColumns).fill(1));
      this.createCubes();
    }
  }

  /**
   * Crée le sol avec des trous pour les cubes
   */
  createFloor() {
    this.floor = new Floor({
      gridColumns: this.gridColumns,
      gridRows: this.gridRows,
      cubeSize: this.cubeSize,
      cubeSpacing: this.cubeSpacing,
    });
    this.floor.addToScene(this.scene);

    const colors = this.floor.materials.getActiveColors();
    this.scene.background = new THREE.Color(colors.background);
  }

  /**
   * Crée la grille de cubes selon le motif de la matrice
   */
  createCubes() {
    this.cubesGroup = new THREE.Group();
    this.cubes = [];

    const geometry = new RoundedBoxGeometry(
      this.cubeSize,
      this.cubeSize,
      this.cubeSize,
      6,
      0.4
    );

    let remoteIndex = 0;
    let buttonIndex = 0;

    for (let i = 0; i < this.gridRows; i++) {
      for (let j = 0; j < this.gridColumns; j++) {
        const isButton = this.matrix[i][j] === 1;
        const currentIndex = isButton ? buttonIndex : remoteIndex;

        const params = {
          ...this.params,
          cubeSize: this.cubeSize,
          spacing: this.cubeSpacing,
          gridRows: this.gridRows,
          gridColumns: this.gridColumns,
          i: i,
          j: j,
          geometry: geometry,
          uid: this.otherUIDs[currentIndex].uid,
          name: this.otherUIDs[currentIndex].name,
          title: this.otherUIDs[currentIndex].title,
        };

        let cube = isButton ? new ButtonCube(params) : new RemoteCube(params);
        isButton ? buttonIndex++ : remoteIndex++;

        this.cubes.push(cube);
        this.cubesGroup.add(cube.mesh);
      }
    }

    this.scene.add(this.cubesGroup);

    if (this.firebaseListener) {
      this.firebaseListener.updateCubes(this.cubes);
    }
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

    // Update cubes
    this.cubes.forEach((cube) => {
      cube.update();
      // If cube has particle system, pass camera
      if (cube.particleSystem) {
        cube.particleSystem.update(this.camera);
      }
    });

    if (this.interaction) {
      this.interaction.update();
    }
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
    if (this.floor) this.floor.removeFromScene(this.scene);
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
