import * as THREE from "three";

export class Car {
    constructor(scene, car, pos) {
        const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
        this.car = car.object;
        scene.add(this.car);

        // Circle parameters
        this.radius = 3.5; // Radius of the circle
        this.center = new THREE.Vector3(pos.x, pos.y + 4, pos.z); // Center of the circle
        this.angle = 0; // Initial angle
        this.speed = 0.1; // Speed of the animation

    }

    animate() { // Update angle
        this.angle += this.speed;

        // Calculate new position on the circle
        this.car.position.z = this.center.z + this.radius * Math.cos(this.angle);
        this.car.position.y = this.center.y + this.radius * Math.sin(this.angle);
        this.car.position.x = this.center.x; // Keep y constant (optional)
        this.car.lookAt(this.center);
        this.car.rotateX(-Math.PI / 2);
    }
}