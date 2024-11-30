import * as THREE from "three";

export default class Lights {
  constructor(scene) {
    this.scene = scene;
    this.setupLights();
  }

  setupLights() {
    this.createMainLight();
    this.createAmbientLight();
    this.createFillLight();
  }

  /**
   * Create and setup the main directional light
   */
  createMainLight() {
    this.mainLight = new THREE.DirectionalLight("#ffffff", 1);
    this.mainLight.position.set(-8, 8, 8);

    // Shadow settings
    this.mainLight.castShadow = true;
    this.mainLight.shadow.mapSize.width = 2048;
    this.mainLight.shadow.mapSize.height = 2048;

    // Shadow camera settings
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
   * Create and setup the ambient light
   */
  createAmbientLight() {
    this.ambientLight = new THREE.AmbientLight("#ffffff", 0.4);
    this.scene.add(this.ambientLight);
  }

  /**
   * Create and setup the fill light
   */
  createFillLight() {
    this.fillLight = new THREE.DirectionalLight("#e8f4ff", 0.4);
    this.fillLight.position.set(-5, 5, -5);
    this.scene.add(this.fillLight);
  }

  /**
   * Update light intensities
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
   * Update main light position
   */
  updateMainLightPosition(x, y, z) {
    this.mainLight.position.set(x, y, z);
  }

  /**
   * Update fill light position
   */
  updateFillLightPosition(x, y, z) {
    this.fillLight.position.set(x, y, z);
  }

  /**
   * Clean up lights
   */
  dispose() {
    this.scene.remove(this.mainLight);
    this.scene.remove(this.ambientLight);
    this.scene.remove(this.fillLight);
  }
}
