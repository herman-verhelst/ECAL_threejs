import BaseCube from "./BaseCube.js";

export default class RemoteCube extends BaseCube {
  constructor(params) {
    super(params);
    this.clickable = false;
    this.setupAsRemote();
    this.addDebugLabel();
  }

  setupAsRemote() {
    this.mesh.material = this.materials.getTransparentMaterial();
    this.mesh.position.y = -this.params.cubeSize / 2;
    this.isPressed = true;
  }

  activate() {
    this.isPressed = !this.isPressed;
    this.startTransition(
      this.isPressed ? -this.params.cubeSize / 2 : this.initialY
    );
  }
}
