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
        //this.createMainLight();
        //this.createAmbientLight();
        //this.createFillLight();
        // Lights

        this.scene.background = new THREE.Color(0xffffff);
        this.scene.fog = new THREE.Fog('#a50909', 10, 100);

        this.ambientLight = new THREE.AmbientLight('#e8ae8e', 2.25);
        this.scene.add(this.ambientLight);

        this.spotLight = new THREE.SpotLight('#dd4e0e', 2000);
        this.spotLight.angle = Math.PI / 5;
        this.spotLight.penumbra = 0.3;
        this.spotLight.position.set(30, 12, 10);
        this.spotLight.castShadow = true;
        this.spotLight.shadow.camera.near = 8;
        this.spotLight.shadow.camera.far = 200;
        this.spotLight.shadow.mapSize.width = 256;
        this.spotLight.shadow.mapSize.height = 256;
        this.spotLight.shadow.bias = -0.002;
        this.spotLight.shadow.radius = 4;
        this.spotLight.lookAt(0, 0, 0);
        this.scene.add(this.spotLight);

        const spotLightHelper = new THREE.SpotLightHelper(this.spotLight, 5);
        //this.scene.add(spotLightHelper);

        this.dirLight = new THREE.DirectionalLight('#d2e19d', 2.5);
        this.dirLight.position.set(-11, 50, 20);
        this.dirLight.castShadow = true;
        this.dirLight.shadow.camera.near = 0.1;
        this.dirLight.shadow.camera.far = 500;
        this.dirLight.shadow.camera.right = 100;
        this.dirLight.shadow.camera.left = -17;
        this.dirLight.shadow.camera.top = 17;
        this.dirLight.shadow.camera.bottom = -17;
        this.dirLight.shadow.mapSize.width = 512;
        this.dirLight.shadow.mapSize.height = 512;
        this.dirLight.shadow.radius = 4;
        this.dirLight.shadow.bias = -0.0005;
        this.dirLight.lookAt(0, 0, 0);

        const directionalLightHelper = new THREE.DirectionalLightHelper(this.dirLight, 5);
        //this.scene.add(directionalLightHelper);

        this.dirGroup = new THREE.Group();
        this.dirGroup.add(this.dirLight);
        this.scene.add(this.dirGroup);

    }

    update(params) {
        this.spotLight.position.set(params.spotLightX, params.spotLightY, params.spotLightZ)
        this.dirLight.position.set(params.dirLightX, params.dirLightY, params.dirLightZ)
        this.spotLight.intensity = params.spotLightIntensity;
        this.dirLight.intensity = params.dirLightIntensity;
        this.ambientLight.intensity = params.ambientLightIntensity;
    }

    /**
     * Crée et configure la lumière directionnelle principale
     */
    createMainLight() {
        this.mainLight = new THREE.DirectionalLight("#ffffff", 10);
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
        this.ambientLight = new THREE.AmbientLight("#ffffff", .5);
        this.scene.add(this.ambientLight);
    }

    /**
     * Crée et configure la lumière de remplissage
     */
    createFillLight() {
        this.fillLight = new THREE.DirectionalLight("#e8f4ff", 1);
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
