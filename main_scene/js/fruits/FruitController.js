import * as THREE from "three";
import {FruitElement} from "./FruitElement.js";
import {gsap} from "gsap";

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
        console.log(model.props)

        this.setLocation(model.props, this.group);

        this.scene.add(this.group)

        const axesHelper = new THREE.AxesHelper(2); // Size of the helper
        this.group.add(axesHelper);

        this.elements = model.models.map((model) => {
            this.addElement(model);
            return new FruitElement(model);
        })
        console.log(this.elements)
    }

    startAnimation() {
        this.actions.forEach((action) => {
            action.play();
        });
        this.elements.forEach((element) => {
            if (!element.object.rotationAnimation) return;

            gsap.to(element.object.object.scene.rotation, {z: -Math.PI / 2})
        })
    }

    tick() {
        const delta = this.clock.getDelta();

        this.mixers.forEach((mixer) => {
            mixer.update(delta);
        });
    }

    addElement(model) {
        let object = model.object.scene
        this.setLocation(model.props, object);

        object.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        })

        if (model.animated) {
            for (let i = 0; i < model.object.animations.length; i++) {
                const mixer = new THREE.AnimationMixer(object);
                this.mixers.push(mixer);
                this.actions.push(mixer.clipAction(model.object.animations[i]))
            }
        }

        this.group.add(object);

        return model;
    }

    setLocation(props, threeJsObject) {
        const position = props.position;
        const scale = props.scale;
        const rotation = props.rotation;

        threeJsObject.position.set(position.x, position.y, position.z)
        threeJsObject.scale.set(scale.x, scale.y, scale.z)
        threeJsObject.rotation.set(rotation.x, rotation.y, rotation.z)
    }
}