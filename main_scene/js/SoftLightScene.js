import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

export default class SoftLightScene {
  constructor() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("#f5f5f5");

    this.setupRenderer();
    this.setupCamera();
    this.setupControls();
    this.setupLights();
    this.createFloor();
    this.createCubes();

    // Bind methods
    this.onResize = this.onResize.bind(this);
    this.render = this.render.bind(this);

    // Add event listeners
    window.addEventListener("resize", this.onResize);

    // Start animation loop
    this.render();
  }

  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setClearColor("#f0e6e6");
    document.body.appendChild(this.renderer.domElement);
  }

  setupCamera() {
    // Orthographic camera for a clean, design-oriented look
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

    // Position for 45-degree view
    this.camera.position.set(15, 15, 15);
    this.camera.lookAt(0, 0, 0);
  }

  setupControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true; // Smooth camera movement
    this.controls.dampingFactor = 0.05;
    this.controls.screenSpacePanning = true;

    // Limit zoom
    this.controls.minDistance = 10;
    this.controls.maxDistance = 50;

    // // Optional: limit rotation if desired
    // this.controls.maxPolarAngle = Math.PI / 2;

    // // Optional: set initial rotation limits
    // this.controls.minAzimuthAngle = -Math.PI / 4;
    // this.controls.maxAzimuthAngle = Math.PI / 4;
  }

  setupLights() {
    // Main soft light
    const mainLight = new THREE.DirectionalLight("#ffffff", 1);
    mainLight.position.set(-8, 8, 8);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    mainLight.shadow.camera.near = 0.1;
    mainLight.shadow.camera.far = 50;
    mainLight.shadow.camera.left = -15;
    mainLight.shadow.camera.right = 15;
    mainLight.shadow.camera.top = 15;
    mainLight.shadow.camera.bottom = -15;
    mainLight.shadow.radius = 5;
    this.scene.add(mainLight);

    // Ambient light for soft fill
    const ambientLight = new THREE.AmbientLight("#ffffff", 0.4);
    this.scene.add(ambientLight);

    // Additional soft light for better depth
    const fillLight = new THREE.DirectionalLight("#e8f4ff", 0.4);
    fillLight.position.set(-5, 5, -5);
    this.scene.add(fillLight);
  }

  createFloor() {
    // Create a large floor plane
    const floorGeometry = new THREE.PlaneGeometry(50, 50);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: "#f0e6e6",
      roughness: 0.8,
      metalness: 0.2,
    });
    floorMaterial.side = THREE.DoubleSide;

    this.floor = new THREE.Mesh(floorGeometry, floorMaterial);
    // make the floor visible from both side

    // Rotate floor to face y-axis and rotate 45 degrees around y
    this.floor.rotation.x = -Math.PI / 2; // 45-degree rotation around Y
    this.floor.position.y = 0; // Optional: lower the floor slightly
    this.floor.receiveShadow = true;
    this.scene.add(this.floor);
  }

  createCubes() {
    const pastelColors = [
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

    const cubeSize = 2.8;
    const spacing = 8;

    // Create a group for all cubes
    this.cubesGroup = new THREE.Group();

    // Create and position cubes relative to group center
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const geometry = new RoundedBoxGeometry(
          cubeSize,
          cubeSize,
          cubeSize,
          6,
          0.4
        );
        // const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
        const material = new THREE.MeshStandardMaterial({
          color: pastelColors[i * 3 + j],
          roughness: 0.6,
          metalness: 0.1,
        });

        const cube = new THREE.Mesh(geometry, material);

        // Position relative to center
        cube.position.x = (j - 1) * spacing;
        cube.position.z = (i - 1) * spacing;
        cube.position.y = cubeSize / 2;

        cube.castShadow = true;
        cube.receiveShadow = true;

        // Add cube to group instead of scene
        this.cubesGroup.add(cube);
      }
    }

    // Add the entire group to the scene
    this.scene.add(this.cubesGroup);
  }

  roundEdges(geometry, radius) {
    // Helper function to round cube edges
    const positions = geometry.attributes.position;
    const vector = new THREE.Vector3();

    for (let i = 0; i < positions.count; i++) {
      vector.fromBufferAttribute(positions, i);
      vector.normalize().multiplyScalar(radius);
      positions.setXYZ(i, vector.x, vector.y, vector.z);
    }

    return geometry;
  }

  render() {
    requestAnimationFrame(this.render);

    // Add any animation updates here if needed
    this.update();

    // Render the scene
    this.renderer.render(this.scene, this.camera);
  }

  // Animation loop method
  update() {
    // Add controls update
    if (this.controls) {
      this.controls.update();
    }
  }

  // Resize handler
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
}
