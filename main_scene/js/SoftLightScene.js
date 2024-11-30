import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Cube from "./Cube.js";
import GuiControls from "./GuiControls.js";

export default class SoftLightScene {
  constructor() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("#575656");
    this.cubeSize = 4; //1.1;
    this.cubeSpacing = Math.max(this.cubeSize + 0.4, 8);
    this.gridSize = 3; //16 pour le smiley

    // Add GUI parameters
    this.params = {
      // Material parameters
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

      //   // Animation parameters
      //   animationSpeed: 0.005,
      //   amplitude: this.cubeSize,
      //   duration: 80,
      //   phaseOffset: 20,

      //   // Scene parameters
      //   backgroundColor: "#575656",
      //   floorColor: "#f0e6e6",
      //   innerWallColor: "#e0d6d6",
      //   material option
      transparentMaterial: false,

      // Add animation control
      isAnimating: false, // New parameter to control animation state
    };

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

    // Update animation properties
    this.time = 0;
    this.animationSpeed = 0.005; // Reduced for smoother motion
    this.amplitude = this.cubeSize;
    this.duration = 80; // Duration of one complete cycle
    this.phaseOffset = 20; // Offset between cubes in frames

    // Track cube states
    // this.cubeStates = new Array(9).fill(false); // Track if each cube has played sound

    // Initialize GUI controls
    this.guiControls = new GuiControls(this.params, () =>
      this.updateMaterials()
    );

    fetch("json/smiley.json")
      .then((response) => response.json())
      .then((matrix) => {
        this.setMaterialsByMatrix(matrix);
      })
      .catch((error) => {
        console.error("Error loading smiley.json:", error);
      });
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
    this.camera.position.set(14, 15, 15);
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
    const floorSize = 52;
    const holeSize = this.cubeSize + 0.4; // Slightly larger than cube size
    const spacing = this.cubeSpacing; // Same spacing as cubes
    const holeDepth = 3; // Depth of the extruded holes

    // Create floor shape with holes
    const shape = new THREE.Shape();
    shape.moveTo(-floorSize / 2, -floorSize / 2);
    shape.lineTo(floorSize / 2, -floorSize / 2);
    shape.lineTo(floorSize / 2, floorSize / 2);
    shape.lineTo(-floorSize / 2, floorSize / 2);
    shape.lineTo(-floorSize / 2, -floorSize / 2);

    // Create holes for each cube position
    const holes = [];
    for (let i = 0; i < this.gridSize; i++) {
      for (let j = 0; j < this.gridSize; j++) {
        const holeShape = new THREE.Path();
        // Calculate center offset based on gridSize
        const centerOffset = ((this.gridSize - 1) * spacing) / 2;
        const x = j * spacing - centerOffset - holeSize / 2;
        const y = i * spacing - centerOffset - holeSize / 2;

        // Create rounded rectangle for each hole
        const radius = 0.4; // Corner radius matching cube roundness

        // Start at top-left + radius
        holeShape.moveTo(x + radius, y);

        // Top edge
        holeShape.lineTo(x + holeSize - radius, y);
        // Top-right corner
        holeShape.quadraticCurveTo(x + holeSize, y, x + holeSize, y + radius);

        // Right edge
        holeShape.lineTo(x + holeSize, y + holeSize - radius);
        // Bottom-right corner
        holeShape.quadraticCurveTo(
          x + holeSize,
          y + holeSize,
          x + holeSize - radius,
          y + holeSize
        );

        // Bottom edge
        holeShape.lineTo(x + radius, y + holeSize);
        // Bottom-left corner
        holeShape.quadraticCurveTo(x, y + holeSize, x, y + holeSize - radius);

        // Left edge
        holeShape.lineTo(x, y + radius);
        // Top-left corner
        holeShape.quadraticCurveTo(x, y, x + radius, y);

        holes.push(holeShape);
      }
    }

    // Add holes to shape
    shape.holes = holes;

    // Extrusion settings
    const extrudeSettings = {
      steps: 1,
      depth: holeDepth,
      bevelEnabled: true,
      bevelThickness: 0.2,
      bevelSize: 0.2,
      bevelOffset: 0,
      bevelSegments: 10,
    };

    // Create geometry with extrusion
    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

    const material = new THREE.MeshStandardMaterial({
      color: "#f0e6e6",
      roughness: 0.8,
      metalness: 0.2,
      side: THREE.DoubleSide,
    });

    this.floor = new THREE.Mesh(geometry, material);
    this.floor.rotation.x = -Math.PI / 2;
    this.floor.position.y = -4; // Slight offset to prevent z-fighting
    this.floor.receiveShadow = true;
    this.scene.add(this.floor);

    // Create inner walls for holes (optional)
    const innerMaterial = new THREE.MeshStandardMaterial({
      color: "#e0d6d6",
      roughness: 0.9,
      metalness: 0.1,
      side: THREE.BackSide,
    });

    const innerFloor = new THREE.Mesh(geometry, innerMaterial);
    innerFloor.rotation.x = -Math.PI / 2;
    innerFloor.position.y = -4;
    innerFloor.receiveShadow = true;
    this.scene.add(innerFloor);
  }

  createCubes() {
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

    const cubeSize = this.cubeSize;
    const spacing = this.cubeSpacing;

    // Create a group for all cubes
    this.cubesGroup = new THREE.Group();
    this.cubes = []; // Array to store cube references

    // Create and position cubes relative to group center
    for (let i = 0; i < this.gridSize; i++) {
      for (let j = 0; j < this.gridSize; j++) {
        // Add cube parameters to this.params
        this.params = {
          ...this.params,
          cubeSize: cubeSize,
          spacing: spacing,
          gridSize: this.gridSize,
          pastelColors: this.pastelColors,
          i: i,
          j: j,
        };

        const cube = new Cube(this.params);

        // Store cube reference
        this.cubes.push(cube);

        // Add cube to group
        this.cubesGroup.add(cube.mesh);
      }
    }

    // Add the entire group to the scene
    this.scene.add(this.cubesGroup);
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
    if (this.controls) {
      this.controls.update();
    }

    // Only update animation if isAnimating is true
    if (this.params.isAnimating) {
      this.time += this.animationSpeed;

      this.cubes.forEach((cube, index) => {
        const row = Math.floor(index / this.gridSize);
        const col = index % this.gridSize;

        const phase = (row + col) * this.phaseOffset;
        let progress =
          ((this.time * 100 + phase) % this.duration) / this.duration;

        if (progress > 0.5) {
          progress = 1 - (progress - 0.5) * 2;
        } else {
          progress = progress * 2;
        }

        const easedProgress = this.easeOutBack(progress);
        const y = cube.initialY + this.amplitude * easedProgress;
        cube.positionY = y;
      });
    } else {
      this.cubes.forEach((cube) => {
        cube.positionY = cube.initialY;
      });
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

  easeOutBack(x) {
    const c1 = 1.70158;
    const c3 = c1 + 1;

    return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
  }

  updateMaterials() {
    this.cubes.forEach((cube, index) => {
      cube.updateMaterial(this.params, index);
    });
  }

  setMaterialsByMatrix(matrix) {
    // Validate matrix dimensions
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

      if (matrix[row][col] === 1) {
        // Use standard material with original pastel colors
        cube.material = new THREE.MeshStandardMaterial({
          //   color: this.pastelColors[index % this.pastelColors.length],
          color: 0x000000,
          roughness: 0.6,
          metalness: 0.1,
        });
      } else if (matrix[row][col] === 0) {
        // Use transparent material (material2)
        cube.material = this.material2.clone(); // Clone to avoid sharing materials
        cube.material.color.set(this.params.color);
        cube.material.transmission = this.params.transmission;
        cube.material.opacity = this.params.opacity;
        cube.material.metalness = this.params.metalness;
        cube.material.roughness = this.params.roughness;
        cube.material.ior = this.params.ior;
        cube.material.thickness = this.params.thickness;
        cube.material.specularIntensity = this.params.specularIntensity;
        cube.material.envMapIntensity = this.params.envMapIntensity;
        cube.castShadow = false;
      }
    });
  }

  cleanup() {
    // ... other cleanup code ...
    if (this.guiControls) {
      this.guiControls.destroy();
    }
  }
}
