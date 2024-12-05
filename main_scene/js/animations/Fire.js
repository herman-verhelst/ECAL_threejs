import * as THREE from "three";

export default class Fire {
  constructor() {
    this.value = 0
    this.createParticleSystem();
    this.scale = new THREE.Vector3(1, 1, 1);
  }

  createParticleSystem() {
    // Create particle geometry
    const particleCount = 20000;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const randomness = new Float32Array(particleCount);

    for (let i = 0; i < particleCount * 3; i += 3) {
      // Position
      const radius = Math.random() * 0.5;
      const theta = Math.random() * Math.PI * 2;
      positions[i] = radius * Math.cos(theta); // x
      positions[i + 1] = Math.random() * 2; // y
      positions[i + 2] = radius * Math.sin(theta); // z

      // Color
      const intensity = Math.random();
      colors[i] = Math.min(1, intensity * 1.5); // red
      colors[i + 1] = intensity * 0.5; // green
      colors[i + 2] = Math.min(0.4, intensity * 0.1); // blue

      // Random value for movement
      randomness[i / 3] = Math.random();
    }

    particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particles.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    particles.setAttribute("random", new THREE.BufferAttribute(randomness, 1));

    // Custom shader material
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        baseSize: { value: 20.0 },
      },
      vertexShader: `
        varying vec3 vColor;
        uniform float time;
        uniform float baseSize;
        attribute float random;
        
        void main() {
          vColor = color;
          vec3 pos = position;
          
          // Spiral upward movement - reversed direction
          float t = time * (1.0 + random * 0.5);
          float yOffset = mod(pos.y + t, 2.0);
          pos.y = yOffset;
          
          // Spiral movement
          float angle = t * 2.0 + random * 6.28;
          float radius = 0.1 * (2.0 - yOffset);
          pos.x += sin(angle) * radius;
          pos.z += cos(angle) * radius;
          
          // Add some turbulence
          pos.x += sin(t * 3.0 + random * 6.28) * 0.1;
          pos.z += cos(t * 2.0 + random * 6.28) * 0.1;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          
          // Size based on y position and distance to camera
          float size = baseSize * (2.0 - yOffset) * (1.0 / -mvPosition.z);
          gl_PointSize = size * (0.5 + random * 0.5);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          
          // Softer particles with gradient
          float intensity = 1.0 - pow(dist * 2.0, 1.5);
          vec3 finalColor = vColor * intensity;
          
          // Add more orange/yellow to the center
          finalColor += vec3(0.2, 0.1, 0.0) * (1.0 - dist);
          
          gl_FragColor = vec4(finalColor, intensity);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true,
    });

    this.particles = new THREE.Points(particles, material);
  }

  getMesh() {
    return this.particles;
  }

  setPosition(x, y, z) {
    if (this.particles) {
      this.particles.position.set(x, y, z);
    }
  }

  setScale(x, y, z) {
    if (this.particles) {
      this.particles.scale.set(x, y, z);
      this.scale.set(x, y, z);

      // Adjust particle size based on scale
      const averageScale = (x + y + z) / 3;
      this.particles.material.uniforms.baseSize.value = 100.0 * averageScale;
    }
  }

  getPosition() {
    return this.particles ? this.particles.position : new THREE.Vector3();
  }

  getScale() {
    return this.scale;
  }

  update(time) {
    this.particles.material.uniforms.time.value = time;
  }
}
