import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
export default class Cube {
  constructor(params) {
    console.log(params);
    // Define pastel colors for cubes
    this.pastelColors = [
      "#FFB5E8", // pink
      "#B5DEFF", // blue
      "#E7FFAC", // green
      "#FFC9DE", // light pink
      "#97E5D7", // mint
      "#FFD4B5", // peach
      "#D4B5FF", // purple
      "#B5ECD4", // seafoam
      "#FFE5B5", // yellow
    ];
    /****************** */
    const texture = new THREE.CanvasTexture(this.generateTexture());
    texture.magFilter = THREE.NearestFilter;
    texture.wrapT = THREE.RepeatWrapping;
    texture.wrapS = THREE.RepeatWrapping;
    texture.repeat.set(1, 3.5);
    const hdrEquirect = new RGBELoader()
      .setPath("textures/equirectangular/")
      .load("royal_esplanade_1k.hdr", function () {
        hdrEquirect.mapping = THREE.EquirectangularReflectionMapping;
      });
    this.material2 = new THREE.MeshPhysicalMaterial({
      color: params.color,
      metalness: params.metalness,
      roughness: params.roughness,
      ior: params.ior,
      alphaMap: texture,
      envMap: hdrEquirect,
      envMapIntensity: params.envMapIntensity,
      transmission: params.transmission,
      specularIntensity: params.specularIntensity,
      specularColor: params.specularColor,
      opacity: params.opacity,
      side: false,
      transparent: true,
      shadowSide: THREE.DoubleSide,
      depthWrite: false,
    });
    /******************************************************** */

    const geometry = new RoundedBoxGeometry(
      params.cubeSize,
      params.cubeSize * Math.random() + params.cubeSize,
      params.cubeSize,
      6,
      0.4
    );

    this.initialMaterial = new THREE.MeshStandardMaterial({
      color:
        this.pastelColors[
          (params.i * params.gridSize + params.j) % this.pastelColors.length
        ],
      roughness: 0.6,
      metalness: 0.1,
    });
    // console.log(initialMaterial);
    this.mesh = new THREE.Mesh(geometry, this.initialMaterial);

    // Calculate center offset based on gridSize
    const centerOffset = ((params.gridSize - 1) * params.spacing) / 2;
    this.mesh.position.x = params.j * params.spacing - centerOffset;
    this.mesh.position.z = params.i * params.spacing - centerOffset;

    // Set initial Y position at the bottom of the hole
    const holeDepth = 3; // Same as in Floor class
    const floorY = -4; // Same as in Floor class
    this.mesh.position.y = floorY + holeDepth;

    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;

    // Store initial Y position
    this.initialY = this.mesh.position.y;
    this.floorY = -4; // Floor level
    this.isPressed = false;

    // Animation parameters for click motion
    this.isTransitioning = false;
    this.transitionProgress = 0;
    this.transitionSpeed = 0.03; // Adjusted for better feel
    this.currentY = this.initialY;
    this.targetY = this.initialY;
  }

  set positionY(y) {
    this.mesh.position.y = y;
  }
  set positionX(x) {
    this.mesh.position.x = x;
  }
  set positionZ(z) {
    this.mesh.position.z = z;
  }

  updateMaterial(params, index) {
    if (params.transparentMaterial) {
      // Use transparent material (material2)
      this.mesh.material = this.material2;
      this.mesh.material.color.set(params.color);
      this.mesh.material.transmission = params.transmission;
      this.mesh.material.opacity = params.opacity;
      this.mesh.material.metalness = params.metalness;
      this.mesh.material.roughness = params.roughness;
      this.mesh.material.ior = params.ior;
      this.mesh.material.thickness = params.thickness;
      this.mesh.material.specularIntensity = params.specularIntensity;
      this.mesh.material.envMapIntensity = params.envMapIntensity;
    } else {
      // Use standard material with original pastel colors
      this.mesh.material = new THREE.MeshStandardMaterial({
        color: this.pastelColors[index % this.pastelColors.length],
        roughness: 0.6,
        metalness: 0.1,
      });
    }
  }

  generateTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 2;
    canvas.height = 2;

    const context = canvas.getContext("2d");
    context.fillStyle = "white";
    context.fillRect(0, 0, 2, 2);

    return canvas;
  }

  togglePress() {
    this.isPressed = !this.isPressed;
    if (this.isPressed) {
      //   this.mesh.material = this.material2;
      this.startTransition(this.floorY);
    } else {
      //   this.mesh.material = this.initialMaterial;
      this.startTransition(this.initialY);
    }
  }

  startTransition(targetY) {
    this.isTransitioning = true;
    this.transitionProgress = 0;
    this.currentY = this.mesh.position.y;
    this.targetY = targetY;
  }

  update() {
    if (this.isTransitioning) {
      // Linear progress
      this.transitionProgress += this.transitionSpeed;
      this.transitionProgress = Math.min(this.transitionProgress, 1);
      // Apply easing to the progress
      const eased = this.easeInOutCubic(this.transitionProgress);
      // Simple linear interpolation with eased progress
      const newY = this.currentY + (this.targetY - this.currentY) * eased;
      this.mesh.position.y = newY;
      if (this.transitionProgress >= 1) {
        this.isTransitioning = false;
        this.mesh.position.y = this.targetY;
      }
    }
  }

  /**
   * Cubic easing in both directions
   */
  easeInOutCubic(x) {
    return x;
  }

  get isDown() {
    return this.isPressed;
  }

  get isMoving() {
    return this.isTransitioning;
  }
}
