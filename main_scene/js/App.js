import SoftLightScene from "./SoftLightScene.js";

export default class App {
  constructor() {
    console.log("App constructor");
    this.init();
  }

  init() {
    this.softLightScene = new SoftLightScene();
  }
}
