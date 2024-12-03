import BaseShape from "./BaseShape.js";
import FirebaseConfig from "../FirebaseConfig.js";

export default class ButtonCube  {

  constructor(params) {

    this.params = params;
    this.uid = params.id;
    this.name = params.name;
    this.target = params.target;
    this.clickable = true;
    this.mesh = params.mesh;
    this.model = params.model;
    console.log("ButtonCube", this.params);

  }

  togglePress() {
    if (this.clickable) {
      this.isPressed = !this.isPressed;
      FirebaseConfig.sendData("connections_orange/" + FirebaseConfig.UID, {
        uid: this.uid,
        target: this.target,
        date: Date.now(),
        position: this.isPressed ? "down" : "up",
      });
    }
  }
}
