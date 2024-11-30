import * as THREE from "three";

/**
 * Classe qui gère la création et la gestion du sol
 */
export default class Floor {
  /**
   * @param {Object} params - Paramètres de configuration du sol
   * @param {number} params.gridSize - Taille de la grille
   * @param {number} params.cubeSize - Taille des cubes
   * @param {number} params.cubeSpacing - Espacement entre les cubes
   */
  constructor(params) {
    this.gridSize = params.gridSize;
    this.cubeSize = params.cubeSize;
    this.cubeSpacing = params.cubeSpacing;

    this.floorSize = 52;
    this.holeSize = this.cubeSize + 0.4;
    this.holeDepth = 3;

    this.createFloor();
  }

  /**
   * Crée la forme du sol avec les trous
   */
  createFloorShape() {
    const shape = new THREE.Shape();
    shape.moveTo(-this.floorSize / 2, -this.floorSize / 2);
    shape.lineTo(this.floorSize / 2, -this.floorSize / 2);
    shape.lineTo(this.floorSize / 2, this.floorSize / 2);
    shape.lineTo(-this.floorSize / 2, this.floorSize / 2);
    shape.lineTo(-this.floorSize / 2, -this.floorSize / 2);

    shape.holes = this.createHoles();
    return shape;
  }

  /**
   * Crée les trous pour chaque position de cube
   */
  createHoles() {
    const holes = [];
    for (let i = 0; i < this.gridSize; i++) {
      for (let j = 0; j < this.gridSize; j++) {
        const holeShape = new THREE.Path();
        const centerOffset = ((this.gridSize - 1) * this.cubeSpacing) / 2;
        const x = j * this.cubeSpacing - centerOffset - this.holeSize / 2;
        const y = i * this.cubeSpacing - centerOffset - this.holeSize / 2;

        // Crée un rectangle arrondi pour chaque trou
        const radius = 0.4;
        holeShape.moveTo(x + radius, y);
        holeShape.lineTo(x + this.holeSize - radius, y);
        holeShape.quadraticCurveTo(
          x + this.holeSize,
          y,
          x + this.holeSize,
          y + radius
        );
        holeShape.lineTo(x + this.holeSize, y + this.holeSize - radius);
        holeShape.quadraticCurveTo(
          x + this.holeSize,
          y + this.holeSize,
          x + this.holeSize - radius,
          y + this.holeSize
        );
        holeShape.lineTo(x + radius, y + this.holeSize);
        holeShape.quadraticCurveTo(
          x,
          y + this.holeSize,
          x,
          y + this.holeSize - radius
        );
        holeShape.lineTo(x, y + radius);
        holeShape.quadraticCurveTo(x, y, x + radius, y);

        holes.push(holeShape);
      }
    }
    return holes;
  }

  /**
   * Crée le sol complet avec les murs intérieurs
   */
  createFloor() {
    const shape = this.createFloorShape();
    const extrudeSettings = {
      steps: 1,
      depth: this.holeDepth,
      bevelEnabled: true,
      bevelThickness: 0.2,
      bevelSize: 0.2,
      bevelOffset: 0,
      bevelSegments: 10,
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

    // Crée le sol principal
    const material = new THREE.MeshStandardMaterial({
      color: "#f0e6e6",
      roughness: 0.8,
      metalness: 0.2,
      side: THREE.DoubleSide,
    });

    this.floor = new THREE.Mesh(geometry, material);
    this.floor.rotation.x = -Math.PI / 2;
    this.floor.position.y = -4;
    this.floor.receiveShadow = true;

    // Crée les murs intérieurs
    const innerMaterial = new THREE.MeshStandardMaterial({
      color: "#e0d6d6",
      roughness: 0.9,
      metalness: 0.1,
      side: THREE.BackSide,
    });

    this.innerFloor = new THREE.Mesh(geometry, innerMaterial);
    this.innerFloor.rotation.x = -Math.PI / 2;
    this.innerFloor.position.y = -4;
    this.innerFloor.receiveShadow = true;
  }

  /**
   * Ajoute le sol à la scène
   */
  addToScene(scene) {
    scene.add(this.floor);
    scene.add(this.innerFloor);
  }

  /**
   * Supprime le sol de la scène
   */
  removeFromScene(scene) {
    scene.remove(this.floor);
    scene.remove(this.innerFloor);
  }

  /**
   * Met à jour les couleurs du sol
   */
  updateColors(floorColor, innerWallColor) {
    this.floor.material.color.set(floorColor);
    this.innerFloor.material.color.set(innerWallColor);
  }
}
