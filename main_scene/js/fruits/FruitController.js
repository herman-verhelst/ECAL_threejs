import * as THREE from "three";
import {FruitElement} from "./FruitElement.js";
import {gsap} from "gsap";
import {setLocation} from "../utils/LocationUtil.js";
import {setMaterialOnLoadedModels} from "../utils/MaterialUtil.js";
import {Car} from "../animations/Car.js";
import Fire from "../animations/Fire.js";

const gsapDuration = .2;

export class FruitController {

    scene;
    clock;

    group;

    isAnimating;
    uid;

    fire = [];

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

    checkAnimation(position) {
        if (position === 'down') {
            this.animate = true;
            this.startAnimation();
        }
        else if (position === 'up') {
            this.animate = false;
            this.endAnimation();
        }
    }

    startAnimation() {

        this.actions.forEach((action) => {
            action.reset();
            action.setLoop(THREE.LoopOnce, 0)
            action.clampWhenFinished = true;

            action.play();
        });

        if (this.fire) {
            let scales = [.5, 2];
            let delay = [0,2 ];
            for (let i = 0; i < this.fire.length; i++) {

                gsap.to(this.fire[i], {
                    value: scales[i],
                    delay: delay[i],
                    duration: 5, onUpdate: () => {
                        this.fire[i].setScale(this.fire[i].value, this.fire[i].value, this.fire[i].value)
                    }
                })
            }
        }


        this.elements.forEach((element) => {

            if (!element.object.rotationAnimation) return;

            const rotationAxis = element.object.rotationAxis;
            if (!rotationAxis || rotationAxis === 'z') gsap.to(element.object.object.rotation, {
                z: -Math.PI / 2 - Math.PI / 4,
                duration: gsapDuration
            })
            else if (!rotationAxis || rotationAxis === 'x') gsap.to(element.object.object.rotation, {
                x: -Math.PI / 2 - Math.PI / 4,
                duration: gsapDuration
            })
        })
    }

    endAnimation() {
        this.isAnimating = false;

        setTimeout(() => {
            this.actions.forEach((action) => {
                action.stop();
            });
        }, gsapDuration * 1000)


        if (this.fire) {
            for (let i = 0; i < this.fire.length; i++) {
                gsap.to(this.fire[i], {
                    value: 0,
                    duration: .2, onUpdate: () => {
                        this.fire[i].setScale(this.fire[i].value, this.fire[i].value, this.fire[i].value)

                    }
                })
            }

        }


        this.elements.forEach((element) => {
            if (!element.object.rotationAnimation) return;

            const rotationAxis = element.object.rotationAxis;
            if (!rotationAxis || rotationAxis === 'z') gsap.to(element.object.object.rotation, {
                z: 0,
                duration: gsapDuration
            })
            else if (!rotationAxis || rotationAxis === 'x') gsap.to(element.object.object.rotation, {
                x: 0,
                duration: gsapDuration
            })
        })
    }

    tick() {
        const delta = this.clock.getDelta();

        if (this.fire) {
            this.fire.forEach(f => {
                f.update(performance.now() * .0005)
            });
        }

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

        if (model.fire) {

            const firePositions = [
                new THREE.Vector3(-1.2, .5
                    ,.65),
                new THREE.Vector3(0, .1, 1)
            ];

            for (let i = 0; i < firePositions.length; i++) {
                let fire = new Fire();
                fire.setScale(3, 3, 3);
                const firePosition = new THREE.Vector3(model.props.position.x, model.props.position.y, model.props.position.z)
                    .add(this.group.position)
                    .add(firePositions[i]);

                fire.setPosition(firePosition.x, firePosition.y, firePosition.z);
                fire.setScale(0, 0, 0);
                this.scene.add(fire.getMesh())

                this.fire.push(fire)
            }


        }

        this.group.add(object);

        return model;
    }
}