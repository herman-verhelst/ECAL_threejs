import * as THREE from "three";
import {FruitElement} from "./FruitElement.js";
import {gsap} from "gsap";
import {setLocation} from "../utils/LocationUtil.js";
import {setMaterial} from "../utils/MaterialUtil.js";

export class FruitController {

    scene;
    clock;

    group;

    isAnimating;

    elements = [];
    mixers = [];
    actions = [];


    constructor(
        scene,
        model,
    ) {
        this.scene = scene;
        this.clock = new THREE.Clock();

        this.group = new THREE.Object3D();

        setLocation(model.props, this.group);

        this.scene.add(this.group)

        const axesHelper = new THREE.AxesHelper(2); // Size of the helper
        this.group.add(axesHelper);

        this.elements = model.models.map((model) => {
            this.addElement(model);
            return new FruitElement(model);
        })
    }

    startAnimation() {
        this.isAnimating = true;

        this.actions.forEach((action) => {
            action.startAt(0);
            action.play();
        });

        this.elements.forEach((element) => {
            if (!element.object.rotationAnimation) return;
            gsap.to(element.object.object.rotation, {z: -Math.PI / 2})
        })
    }

    endAnimation() {
        this.isAnimating = false;

        this.actions.forEach((action) => {
            action.stop();
        });

        this.elements.forEach((element) => {
            if (!element.object.rotationAnimation) return;
            gsap.to(element.object.object.rotation, {z: 0})
        })
    }

    tick() {
        const delta = this.clock.getDelta();

        this.mixers.forEach((mixer) => {
            mixer.update(delta);
        });
    }

    addElement(model) {
        let object = model.object
        setLocation(model.props, object);
        setMaterial(model);

        if (model.animated) {
            for (let i = 0; i < model.animation.length; i++) {
                const mixer = new THREE.AnimationMixer(object);
                this.mixers.push(mixer);
                this.actions.push(mixer.clipAction(model.animation[i]))
            }
        }

        this.group.add(object);

        return model;
    }
}