import * as dat from "dat.gui";

export default class GuiControls {
  constructor(params, updateCallback) {
    this.params = params;
    this.updateCallback = updateCallback;
    this.gui = new dat.GUI();
    this.setupControls();
  }

  setupControls() {
    // Material type selector
    const materialTypeFolder = this.gui.addFolder("Material Type");
    materialTypeFolder
      .add(this.params, "transparentMaterial")
      .name("Use Transparent Material")
      .onChange(() => this.updateCallback());
    materialTypeFolder.open();

    // Transparent material properties
    const transparentMaterialFolder = this.gui.addFolder(
      "Transparent Material Properties"
    );
    transparentMaterialFolder
      .addColor(this.params, "color")
      .onChange(() => this.updateCallback());
    transparentMaterialFolder
      .add(this.params, "transmission", 0, 1)
      .onChange(() => this.updateCallback());
    transparentMaterialFolder
      .add(this.params, "opacity", 0, 1)
      .onChange(() => this.updateCallback());
    transparentMaterialFolder
      .add(this.params, "metalness", 0, 1)
      .onChange(() => this.updateCallback());
    transparentMaterialFolder
      .add(this.params, "roughness", 0, 1)
      .onChange(() => this.updateCallback());
    transparentMaterialFolder
      .add(this.params, "ior", 1, 2.333)
      .onChange(() => this.updateCallback());
    transparentMaterialFolder
      .add(this.params, "thickness", 0, 5)
      .onChange(() => this.updateCallback());
    transparentMaterialFolder
      .add(this.params, "specularIntensity", 0, 1)
      .onChange(() => this.updateCallback());
    transparentMaterialFolder
      .add(this.params, "envMapIntensity", 0, 3)
      .onChange(() => this.updateCallback());

    // Add Animation Control folder with more parameters
    const animationFolder = this.gui.addFolder("Animation Control");
    animationFolder.add(this.params, "isAnimating").name("Animation On/Off");
    animationFolder
      .add(this.params, "animationSpeed", 0.001, 0.01)
      .name("Speed")
      .onChange(() => this.updateCallback());
    animationFolder
      .add(this.params, "amplitude", 0, 10)
      .name("Height")
      .onChange(() => this.updateCallback());
    animationFolder
      .add(this.params, "duration", 40, 200)
      .name("Duration")
      .onChange(() => this.updateCallback());
    animationFolder
      .add(this.params, "phaseOffset", 0, 50)
      .name("Phase Offset")
      .onChange(() => this.updateCallback());
    animationFolder.open();
  }

  // Method to update parameters
  updateParams(newParams) {
    Object.assign(this.params, newParams);
    // Optionally refresh GUI if needed
    this.gui.updateDisplay();
  }

  // Method to destroy GUI
  destroy() {
    if (this.gui) {
      this.gui.destroy();
    }
  }
}
