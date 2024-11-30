import * as THREE from "three";

/**
 * Classe gérant les lumières de la scène
 */
export default class Lights {
  /**
   * Initialise une nouvelle instance de Lights
   * @param {THREE.Scene} scene - La scène Three.js
   */
  constructor(scene) {
    this.scene = scene;
    this.setupLights();
  }

  /**
   * Configure toutes les lumières de la scène
   */
  setupLights() {
    this.createMainLight();
    this.createAmbientLight();
    this.createFillLight();
  }

  /**
   * Crée et configure la lumière directionnelle principale
   */
  createMainLight() {
    this.mainLight = new THREE.DirectionalLight("#ffffff", 1);
    this.mainLight.position.set(-8, 8, 8);

    // Paramètres des ombres
    this.mainLight.castShadow = true;
    this.mainLight.shadow.mapSize.width = 2048;
    this.mainLight.shadow.mapSize.height = 2048;

    // Configuration de la caméra d'ombre
    this.mainLight.shadow.camera.near = 0.1;
    this.mainLight.shadow.camera.far = 50;
    this.mainLight.shadow.camera.left = -15;
    this.mainLight.shadow.camera.right = 15;
    this.mainLight.shadow.camera.top = 15;
    this.mainLight.shadow.camera.bottom = -15;
    this.mainLight.shadow.radius = 5;

    this.scene.add(this.mainLight);
  }

  /**
   * Crée et configure la lumière ambiante
   */
  createAmbientLight() {
    this.ambientLight = new THREE.AmbientLight("#ffffff", 0.4);
    this.scene.add(this.ambientLight);
  }

  /**
   * Crée et configure la lumière de remplissage
   */
  createFillLight() {
    this.fillLight = new THREE.DirectionalLight("#e8f4ff", 0.4);
    this.fillLight.position.set(-5, 5, -5);
    this.scene.add(this.fillLight);
  }

  /**
   * Met à jour l'intensité des lumières
   * @param {number} mainIntensity - Intensité de la lumière principale
   * @param {number} ambientIntensity - Intensité de la lumière ambiante
   * @param {number} fillIntensity - Intensité de la lumière de remplissage
   */
  updateIntensities(
    mainIntensity = 1,
    ambientIntensity = 0.4,
    fillIntensity = 0.4
  ) {
    this.mainLight.intensity = mainIntensity;
    this.ambientLight.intensity = ambientIntensity;
    this.fillLight.intensity = fillIntensity;
  }

  /**
   * Met à jour la position de la lumière principale
   * @param {number} x - Position X
   * @param {number} y - Position Y
   * @param {number} z - Position Z
   */
  updateMainLightPosition(x, y, z) {
    this.mainLight.position.set(x, y, z);
  }

  /**
   * Met à jour la position de la lumière de remplissage
   * @param {number} x - Position X
   * @param {number} y - Position Y
   * @param {number} z - Position Z
   */
  updateFillLightPosition(x, y, z) {
    this.fillLight.position.set(x, y, z);
  }

  /**
   * Nettoie les lumières de la scène
   */
  dispose() {
    this.scene.remove(this.mainLight);
    this.scene.remove(this.ambientLight);
    this.scene.remove(this.fillLight);
  }
}
