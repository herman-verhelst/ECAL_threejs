import * as THREE from "three";

export default class Interaction {
  constructor(camera, scene, cubes) {
    this.camera = camera;
    this.scene = scene;
    this.cubes = cubes;

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    window.addEventListener("click", this.onClick.bind(this));
  }

  onClick(event) {
    // Convert mouse position to normalized device coordinates
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Cast ray from camera through mouse position
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(
      this.cubes.map((cube) => cube.mesh)
    );

    if (intersects.length > 0) {
      const clickedCube = this.cubes.find(
        (cube) => cube.mesh === intersects[0].object
      );

      if (clickedCube) {
        clickedCube.togglePress();
      }
    }
  }

  update() {
    // No animation updates needed - position changes are immediate
  }

  dispose() {
    window.removeEventListener("click", this.onClick);
  }
}
