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
    holeDepth: 3, // Profondeur du trou
    floorY: -4, // Position Y du sol
    transitionSpeed: 0.03, // Vitesse de transition
  };

  /**
   * Crée une instance de Cube
   * @param {Object} params - Paramètres de configuration du cube
   */
  constructor(params) {
    this.params = params;
    this.UID = params.UID;

    // Création des matériaux
    const colorIndex = this.params.i * this.params.gridSize + this.params.j;
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
    const centerOffset = ((this.params.gridSize - 1) * this.params.spacing) / 2;

    this.mesh.position.x = this.params.j * this.params.spacing - centerOffset;
    this.mesh.position.z = this.params.i * this.params.spacing - centerOffset;
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
    if (params.transparentMaterial) {
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
      this.mesh.material = this.materials.getBlackMaterial();
    } else {
      this.mesh.material = this.materials.getTransparentMaterial();
    }
  }

  /**
   * Bascule l'état pressé/relâché du cube
   */
  togglePress() {
    this.isPressed = !this.isPressed;
    this.startTransition(this.isPressed ? this.floorY : this.initialY);

    FirebaseConfig.sendData("connections/" + FirebaseConfig.UID, {
      target: this.UID,
      date: Date.now(),
      value: [],
    });
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
