import * as THREE from "three";
import {FruitElement} from "./FruitElement.js";
import {gsap} from "gsap";
import {setLocation} from "../utils/LocationUtil.js";
import {setMaterialOnLoadedModels} from "../utils/MaterialUtil.js";
import {Car} from "../animations/Car.js";

const gsapDuration = .2;

export class FruitController {

    scene;
    clock;

    group;

    isAnimating;
    uid;

    car;
    elements = [];
    mixers = [];
    actions = [];


    constructor(
        scene,
        model,
    ) {
        this.scene = scene;
        this.clock = new THREE.Clock();
        this.uid = model.uid;

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

    animate() {
        this.isAnimating = !this.isAnimating;
        if (this.isAnimating) this.startAnimation();
        else this.endAnimation();
    }

    startAnimation() {

        this.actions.forEach((action) => {
            action.reset();
            action.setLoop(THREE.LoopOnce, 0)
            action.clampWhenFinished = true;

            action.play();
        });

        this.elements.forEach((element) => {

            if (!element.object.rotationAnimation) return;

            const rotationAxis = element.object.rotationAxis;
            if (!rotationAxis || rotationAxis === 'z') gsap.to(element.object.object.rotation, {z: -Math.PI / 2, duration: gsapDuration})
            else if (!rotationAxis || rotationAxis === 'x') gsap.to(element.object.object.rotation, {x: -Math.PI / 2, duration: gsapDuration})
        })
    }

    endAnimation() {
        this.isAnimating = false;

        setTimeout(() => {
            this.actions.forEach((action) => {
                action.stop();
            });
        }, gsapDuration * 1000)

        this.elements.forEach((element) => {
            if (!element.object.rotationAnimation) return;

            const rotationAxis = element.object.rotationAxis;
            if (!rotationAxis || rotationAxis === 'z') gsap.to(element.object.object.rotation, {z: 0, duration: gsapDuration})
            else if (!rotationAxis || rotationAxis === 'x') gsap.to(element.object.object.rotation, {x: 0, duration: gsapDuration})
        })
    }

    tick() {
        const delta = this.clock.getDelta();

        if (this.car) this.car.animate();

        this.mixers.forEach((mixer) => {
            mixer.update(delta);
        });
    }

    addElement(model) {
        let object = model.object
        setLocation(model.props, object);
        setMaterialOnLoadedModels(model);

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