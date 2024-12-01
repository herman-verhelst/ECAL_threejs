import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Cube from "./Cube.js";
import GuiControls from "./GuiControls.js";
import Lights from "./Lights.js";
// import CubeAnimator from "./CubeAnimator.js";
import Floor from "./Floor.js";
import Interaction from "./Interaction.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import FirebaseConfig from "./FirebaseConfig.js";
import DebugLayer from "./DebugLayer.js";
/**
 * Classe principale qui gère la scène 3D
 * Cette classe coordonne tous les éléments : cubes, lumières, animations, etc.
 */
export default class SoftLightScene {
  /**
   * Initialise la scène avec les paramètres par défaut
   */
  constructor() {
    // on est obligé de déléguer l'init pour pouvoir utiliser async/await
    // le constructeur ne peut pas être async
    this.init();
  }

  async init() {
    // Charger la configuration
    // Sauvegarder son identifiant unique de la config
    // Charger les identifiants des autres personnes pour chaque cube
    await this.loadConfig();

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
    // this.setupAnimation();

    // Configuration des écouteurs d'événements
    this.setupEventListeners();

    // // Initialisation de l'écouteur Firebase
    // this.firstCall = false;
    // FirebaseConfig.listenToData("connections", (data) => {
    //   if (!this.firstCall) {
    //     this.firstCall = true;
    //     return;
    //   }
    //   console.log(data);
    //   // ------> MISE À JOUR DES FORMES DEPUIS L'ENTRÉE FIREBASE
    // });

    // Initialisation des contrôles GUI
    this.setupGUI();

    // Chargement du motif initial de la matrice
    this.loadMatrixPattern();

    // Configuration de l'interaction après la création des cubes
    this.setupInteraction();

    // Démarrage de la boucle de rendu
    this.render();

    // Initialisation du debug layer
    this.debugLayer = new DebugLayer();

    // Mise à jour de l'écouteur Firebase
    this.firstCall = false;
    FirebaseConfig.listenToData("connections", (data) => {
      if (!this.firstCall) {
        this.firstCall = true;
        return;
      }
      // Ajoute le message au debug layer
      this.debugLayer.addMessage(data);

      // on écoute TOUS LES CHANGEMENTS SUR LE RESEAU
      // on ne réagit que lorsque qu'une target dans le json connections est égale à notre uid
      Object.keys(data).forEach((key) => {
        if (data[key].target === FirebaseConfig.UID) {
          console.log("target is me", key);
          // et on va activer le cube qui est designé comme KEY
          // SI IL N'Y EN A QU'UN SEUL
          // this.cubes.find((cube) => cube.uid === key).togglePress(true);
          this.cubes.forEach((cube) => {
            console.log(cube.uid, cube.clickable);
            if (cube.uid === key && !cube.clickable) {
              if (
                (cube.isPressed && data[key].position === "up") ||
                (!cube.isPressed && data[key].position === "down")
              )
                return;
              cube.activate();
            }
          });
        } else {
          console.log("target is not me");
        }
      });
    });
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
    this.cubeSpacing = Math.max(this.cubeSize + 0.4, 6);
    this.gridRows = 3;
    this.gridColumns = 4;

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
   * Configure les propriétés d'animation
   */
  // setupAnimation() {
  //   this.animator = new CubeAnimator(this.params);
  // }

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
    fetch("json/grid.json")
      .then((response) => response.json())
      .then((matrix) => this.setMaterialsByMatrix(matrix))
      .catch((error) =>
        console.error("Erreur lors du chargement de smiley.json:", error)
      );
  }

  /**
   * Crée le sol avec des trous pour les cubes
   */
  createFloor() {
    this.floor = new Floor({
      // gridSize: this.gridSize,
      gridColumns: this.gridColumns,
      gridRows: this.gridRows,
      cubeSize: this.cubeSize,
      cubeSpacing: this.cubeSpacing,
    });
    this.floor.addToScene(this.scene);

    // Mise à jour de l'arrière-plan de la scène pour correspondre aux couleurs du sol (assombries)
    const colors = this.floor.materials.getActiveColors();
    this.scene.background = new THREE.Color(colors.background);
  }

  /**
   * Crée la grille de cubes
   */
  createCubes() {
    this.cubesGroup = new THREE.Group();
    this.cubes = [];

    // Création de la géométrie partagée
    const geometry = new RoundedBoxGeometry(
      this.cubeSize,
      this.cubeSize,
      this.cubeSize,
      6,
      0.4
    );

    // index for otherUIDs
    let index = 0;
    let buttonIndex = 0;
    for (let i = 0; i < this.gridRows; i++) {
      for (let j = 0; j < this.gridColumns; j++) {
        this.params = {
          ...this.params,
          cubeSize: this.cubeSize,
          spacing: this.cubeSpacing,
          gridRows: this.gridRows,
          gridColumns: this.gridColumns,
          i: i,
          j: j,
          geometry: geometry, // Passage de la géométrie partagée
          uid:
            j > 1 ? this.otherUIDs[buttonIndex].uid : this.otherUIDs[index].uid, //FirebaseConfig.UID,
          name:
            j > 1
              ? this.otherUIDs[buttonIndex].name
              : this.otherUIDs[index].name, // FirebaseConfig.NAME,
        };
        console.log(index);
        const cube = new Cube(this.params);
        this.cubes.push(cube);
        this.cubesGroup.add(cube.mesh);

        // on incrémente l'index juste pour les 2première col
        if (j > 1) {
          buttonIndex++;
        } else {
          index++;
        }
      }
    }

    this.scene.add(this.cubesGroup);
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

    // Mise à jour des transitions des cubes
    this.cubes.forEach((cube) => cube.update());

    // Met à jour tous les cubes
    // this.animator.update(this.cubes, this.gridSize);

    // Mise à jour des interactions
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
      if (this.params.isAnimating) return;
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
      matrix.length !== this.gridRows ||
      matrix[0].length !== this.gridColumns
    ) {
      console.error(
        "Les dimensions de la matrice doivent correspondre à gridRows:",
        this.gridRows,
        "et gridColumns:",
        this.gridColumns
      );
      return;
    }
    // console.log(matrix);
    this.cubes.forEach((cube, index) => {
      const x = index % this.gridColumns;
      const y = Math.floor(index / this.gridColumns);
      cube.setMaterialByMatrix(matrix[y][x]);
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
    if (this.interaction) {
      this.interaction.dispose();
    }
    window.removeEventListener("resize", this.onResize);
  }

  /**
   * Charge la configuration depuis le fichier JSON
   */
  loadConfig() {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch("json/Config.json");
        const config = await response.json();

        const urlParams = new URLSearchParams(window.location.search);
        const uid = urlParams.get("uid");

        // Sauvegarder l'identifiant unique
        FirebaseConfig.UID = uid || config.UID;
        FirebaseConfig.NAME = config.NAME;

        // Sauvegarder les identifiants des autres personnes
        this.otherUIDs = config.OTHERS.map((other) => ({
          name: other.name,
          uid: other.uid,
        }));
      } catch (error) {
        console.error("Erreur lors du chargement de la configuration:", error);
      }
      resolve();
    });
  }
}
