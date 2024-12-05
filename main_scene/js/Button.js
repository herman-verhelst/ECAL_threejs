import FirebaseConfig from "./FirebaseConfig.js";
import {gsap} from "gsap";

export default class Button  {

    constructor(params) {

        this.params = params;
        this.uid = params.id;
        this.name = params.name;
        this.accent = params.accent;
        this.group = params.group;
        this.target = params.target;
        this.clickable = true;
        this.mesh = params.mesh;
        this.model = params.model;
    }

    togglePress() {
        if (this.clickable) {
            this.isPressed = !this.isPressed;

            if (this.isPressed) {
                gsap.to(this.mesh.position, {y: -.2, duration: .05})
                gsap.to(this.accent.position, {y: .3, duration: .05})
            }
            else {
                gsap.to(this.mesh.position, {y: .3, duration: .05})
                gsap.to(this.accent.position, {y: .8, duration: .05})
            }

            FirebaseConfig.sendData("connections_orange/" + FirebaseConfig.UID, {
                uid: this.uid,
                target: this.target,
                date: Date.now(),
                position: this.isPressed ? "down" : "up",
            });
        }
    }
}