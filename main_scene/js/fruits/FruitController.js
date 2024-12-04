import * as THREE from "three";
import {FruitElement} from "./FruitElement.js";
import {gsap} from "gsap";
import {setLocation} from "../utils/LocationUtil.js";
import {setMaterialOnLoadedModels} from "../utils/MaterialUtil.js";
import {Car} from "../animations/Car.js";

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

    startAnimation() {
        this.isAnimating = true;

        this.actions.forEach((action) => {
            action.startAt(0);
            action.setLoop(THREE.LoopOnce)
            action.play();
        });

        this.elements.forEach((element) => {
            if (element.object.isWeight) {
                console.log('weight')
                gsap.to(element.object.object.position, {y: 4.4, duration: .2, delay: 3, ease: 'power1.in'})
            }
            if (!element.object.rotationAnimation) return;
            const rotationAxis = element.object.rotationAxis;
            if (!rotationAxis || rotationAxis === 'z') gsap.to(element.object.object.rotation, {z: -Math.PI / 2})
            else if (!rotationAxis || rotationAxis === 'x') gsap.to(element.object.object.rotation, {x: -Math.PI / 2})
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