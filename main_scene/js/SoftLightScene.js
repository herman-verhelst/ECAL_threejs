import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Cube from "./Cube.js";
import GuiControls from "./GuiControls.js";
import Lights from "./Lights.js";
import CubeAnimator from "./CubeAnimator.js";
import Floor from "./Floor.js";

/**
 * Classe principale qui gère la scène 3D
 * Cette classe coordonne tous les éléments : cubes, lumières, animations, etc.
 */
export default class SoftLightScene {
  /**
   * Initialise la scène avec les paramètres par défaut
   */
  constructor() {
    // Configuration de base de la scène
    this.initializeBasicSettings();

    // Configuration de tous les composants nécessaires
    this.setupRenderer();
    this.setupCamera();
    this.setupControls();
    this.setupLights();

    // Création des éléments de la scène
    this.createFloor();
    this.createCubes();

    // Configuration des propriétés d'animation
    this.setupAnimation();

    // Configuration des écouteurs d'événements
    this.setupEventListeners();

    // Initialisation des contrôles GUI
    this.setupGUI();

    // Démarrage de la boucle de rendu
    this.render();

    // Chargement du motif initial de la matrice
    this.loadMatrixPattern();
  }

  /**
   * Initialise les paramètres de base de la scène
   */
  initializeBasicSettings() {
    // Création de la scène
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("#575656");

    // Définition des dimensions de base
    this.cubeSize = 4;
    this.cubeSpacing = Math.max(this.cubeSize + 0.4, 8);
    this.gridSize = 3;

    // Initialisation des paramètres pour les matériaux et l'animation
    this.params = {
      // Paramètres des matériaux
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

      // Contrôle de l'animation
      isAnimating: false,
      animationSpeed: 0.005,
      amplitude: this.cubeSize,
      duration: 80,
      phaseOffset: 20,
      downwardOffset: 3,
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
   * Configure les propriétés d'animation
   */
  setupAnimation() {
    this.animator = new CubeAnimator(this.params);
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
  loadMatrixPattern() {
    fetch("json/smiley.json")
      .then((response) => response.json())
      .then((matrix) => this.setMaterialsByMatrix(matrix))
      .catch((error) => console.error("Error loading smiley.json:", error));
  }

  /**
   * Crée le sol avec des trous pour les cubes
   */
  createFloor() {
    this.floor = new Floor({
      gridSize: this.gridSize,
      cubeSize: this.cubeSize,
      cubeSpacing: this.cubeSpacing,
    });
    this.floor.addToScene(this.scene);
  }

  /**
   * Crée la grille de cubes
   */
  createCubes() {
    this.cubesGroup = new THREE.Group();
    this.cubes = [];

    const spacing = this.cubeSpacing;
    const cubeSize = this.cubeSize;

    for (let i = 0; i < this.gridSize; i++) {
      for (let j = 0; j < this.gridSize; j++) {
        // Ajoute les paramètres du cube à this.params
        this.params = {
          ...this.params,
          cubeSize: cubeSize,
          spacing: spacing,
          gridSize: this.gridSize,
          i: i,
          j: j,
        };

        const cube = new Cube(this.params);
        this.cubes.push(cube);
        this.cubesGroup.add(cube.mesh);
      }
    }

    this.scene.add(this.cubesGroup);
  }

  /**
   * Boucle de mise à jour pour l'animation
   */
  update() {
    if (this.controls) {
      this.controls.update();
    }

    // Met à jour l'état de l'animation en fonction du contrôle GUI
    this.animator.toggleAnimation(this.params.isAnimating);

    // Met à jour tous les cubes
    this.animator.update(this.cubes, this.gridSize);
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
      cube.updateMaterial(this.params, index);
    });

    // Met à jour les paramètres de l'animateur lorsque le GUI change
    if (this.animator) {
      this.animator.updateParams(this.params);
    }
  }

  /**
   * Définit les matériaux en fonction du motif de la matrice
   */
  setMaterialsByMatrix(matrix) {
    if (
      !matrix ||
      matrix.length !== this.gridSize ||
      matrix[0].length !== this.gridSize
    ) {
      console.error("Matrix dimensions must match gridSize:", this.gridSize);
      return;
    }

    this.cubes.forEach((cube, index) => {
      const row = Math.floor(index / this.gridSize);
      const col = index % this.gridSize;
      cube.setMaterialByMatrix(matrix[row][col]);
    });
  }

  /**
   * Méthode de nettoyage
   */
  cleanup() {
    if (this.guiControls) {
      this.guiControls.destroy();
    }
    if (this.lights) {
      this.lights.dispose();
    }
    if (this.floor) {
      this.floor.removeFromScene(this.scene);
    }
    window.removeEventListener("resize", this.onResize);
  }
}
