import * as THREE from "three";
import {materials} from "./materials/Materials.js";

export default class Floor {
    constructor(scene) {
        this.scene = scene;
        this.setupFloor();
    }

    setupFloor() {
        const geometry = new THREE.BoxGeometry(100, 100, 1);
        this.floor = new THREE.Mesh(geometry, materials.floor)
        this.floor.position.set(0, -.5, 0)
        this.floor.rotation.set(Math.PI / 2, 0, Math.PI / 2);
        this.floor.castShadow = true;
        this.floor.receiveShadow = true;
        this.scene.add(this.floor)
    }
  }