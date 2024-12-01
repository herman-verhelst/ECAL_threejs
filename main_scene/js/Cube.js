import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import Materials from "./Materials.js";
import FirebaseConfig from "./FirebaseConfig.js";

/**
 * Classe représentant un cube dans la scène
 * Gère la création, l'animation et les transitions du cube
 */
export default class Cube {
  // Valeurs par défaut pour les propriétés du cube
  static DEFAULTS = {
    holeDepth: 4, // Profondeur du trou
    floorY: -4, // Position Y du sol
    transitionSpeed: 0.1, // Vitesse de transition
  };

  /**
   * Crée une instance de Cube
   * @param {Object} params - Paramètres de configuration du cube
   */
  constructor(params) {
    this.params = params;
    this.uid = params.uid;
    this.name = params.name;
    console.log(this.uid);

    // Création des matériaux
    const colorIndex = this.params.i * this.params.gridColumns + this.params.j;
    this.materials = new Materials(this.params);
    this.materials.createStandardMaterial(colorIndex);

    this.createMesh();
    this.setupPositioning();
    this.setupAnimationState();
  }

  /**
   * Crée le mesh du cube avec une géométrie arrondie
   */
  createMesh() {
    // Use shared geometry if provided, otherwise create new one
    const geometry =
      this.params.geometry ||
      new RoundedBoxGeometry(
        this.params.cubeSize,
        this.params.cubeSize * Math.random() + this.params.cubeSize,
        this.params.cubeSize,
        6,
        0.4
      );

    this.mesh = new THREE.Mesh(geometry, this.materials.getStandardMaterial());
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
  }

  /**
   * Configure la position initiale du cube dans la grille
   */
  setupPositioning() {
    const centerOffsetX =
      ((this.params.gridColumns - 1) * this.params.spacing) / 2;
    const centerOffsetZ =
      ((this.params.gridRows - 1) * this.params.spacing) / 2;

    this.mesh.position.x = this.params.j * this.params.spacing - centerOffsetX;
    this.mesh.position.z = this.params.i * this.params.spacing - centerOffsetZ;
    this.mesh.position.y = Cube.DEFAULTS.floorY + Cube.DEFAULTS.holeDepth;

    this.initialY = this.mesh.position.y;
    this.floorY = Cube.DEFAULTS.floorY;
  }

  /**
   * Initialise les états d'animation du cube
   */
  setupAnimationState() {
    this.isPressed = false;
    this.isTransitioning = false;
    this.transitionProgress = 0;
    this.transitionSpeed = Cube.DEFAULTS.transitionSpeed;
    this.currentY = this.initialY;
    this.targetY = this.initialY;
  }

  /**
   * Met à jour le matériau du cube
   * @param {Object} params - Nouveaux paramètres de matériau
   * @param {number} index - Index du cube dans la grille
   */
  updateMaterial(params, index) {
    if (this.mesh.material === this.materials.getTransparentMaterial()) {
      this.materials.updateTransparentMaterial(params);
      this.mesh.material = this.materials.getTransparentMaterial();
    } else {
      this.materials.createStandardMaterial(index);
      this.mesh.material = this.materials.getStandardMaterial();
    }
  }

  /**
   * Met à jour le matériau en fonction de la valeur de la matrice
   * @param {number} value - Valeur de la matrice (0 ou 1)
   */
  setMaterialByMatrix(value) {
    // setup material by value
    if (value === 1) {
      // this.mesh.material = this.materials.getBlackMaterial();
      // random color
      // const randomColor = Math.floor(Math.random() * 16777215).toString(16);
      // this.mesh.material = this.materials.getColorizedStandardMaterial(
      //   "#" + randomColor
      // );
      // set standard material
      this.mesh.material = this.materials.getStandardMaterial();
      this.clickable = true;
    } else {
      this.mesh.material = this.materials.getTransparentMaterial();
      // set position so the top of the cube is at the floorY
      this.mesh.position.y = -this.params.cubeSize / 2;
      // this.initialY = -this.params.cubeSize / 2;
      this.clickable = false;
      this.isPressed = true;
    }
  }

  /**
   * Bascule l'état pressé/relâché du cube
   */
  togglePress() {
    // if (this.uid != FirebaseConfig.UID) {
    if (this.clickable) {
      this.isPressed = !this.isPressed;
      this.startTransition(
        this.isPressed ? -this.params.cubeSize / 2 : this.initialY
      );

      FirebaseConfig.sendData("connections/" + FirebaseConfig.UID, {
        target: this.uid,
        name: this.name,
        date: Date.now(),
        position: this.isPressed ? "down" : "up",
      });
    }
  }

  activate() {
    this.isPressed = !this.isPressed;
    this.startTransition(
      this.isPressed ? -this.params.cubeSize / 2 : this.initialY
    );
  }

  /**
   * Démarre une transition vers une nouvelle position Y
   * @param {number} targetY - Position Y cible
   */
  startTransition(targetY) {
    this.isTransitioning = true;
    this.transitionProgress = 0;
    this.currentY = this.mesh.position.y;
    this.targetY = targetY;
  }

  /**
   * Met à jour la position du cube pendant la transition
   */
  update() {
    if (!this.isTransitioning) return;

    this.transitionProgress = Math.min(
      this.transitionProgress + this.transitionSpeed,
      1
    );

    const eased = this.easeInOutCubic(this.transitionProgress);
    const newY = this.currentY + (this.targetY - this.currentY) * eased;
    this.mesh.position.y = newY;

    if (this.transitionProgress >= 1) {
      this.isTransitioning = false;
      this.mesh.position.y = this.targetY;
    }
  }

  /**
   * Fonction d'interpolation cubique pour les transitions
   * @param {number} x - Valeur à interpoler entre 0 et 1
   * @returns {number} Valeur interpolée
   */
  easeInOutCubic(x) {
    return x;
  }

  // Getters d'état
  get isDown() {
    return this.isPressed;
  }
  get isMoving() {
    return this.isTransitioning;
  }

  // Setters de position
  set positionY(y) {
    this.mesh.position.y = y;
  }

  set positionX(x) {
    this.mesh.position.x = x;
  }

  set positionZ(z) {
    this.mesh.position.z = z;
  }
}
