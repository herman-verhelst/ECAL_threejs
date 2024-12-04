import {Fruit} from "./fruits/Fruit.js";
import {materials} from "./materials/Materials.js";
import * as THREE from "three";

const path = "/models";


export const modelDescriptors = [
    {
        src: `${path}/fruitbowl/fruitbowl.gltf`,
        id: "fruitbowl",
        type: "gltf",
        animated: false,
        target: "brown",
        clickable: true,
        material: materials.glass,
        props: {
            scale: {x: 10, y: 10, z: 10},
            position: {x: 0, y: 0, z: 0},
            rotation: {x: 0, y: 0, z: 0},
        },
    },
    {
        type: 'fruit',
        fruit: Fruit.PINEAPPLE,
        props: {
            scale: {x: 1, y: 1, z: 1},
            position: {x: 0, y: 2, z: 0},
            rotation: {x: 0, y: Math.PI / 2, z: 0},
        },
        models: [
            {
                src: `${path}/ant_liftingWeights.gltf`,
                id: "ant_liftingWeights",
                type: "gltf",
                animated: true,
                props: {
                    scale: {x: 1.5, y: 1.5, z: 1.5},
                    position: {x: 0, y: 3.35, z: 0},
                    rotation: {x: 0, y: -Math.PI / 2, z: 0},
                },
            },
            {
                src: `${path}/pineapple_top.gltf`,
                id: "pineapple_top",
                type: "gltf",
                animated: false,
                rotationAnimation: true,
                props: {
                    scale: {x: 10, y: 10, z: 10},
                    position: {x: 2, y: 3.1, z: .65},
                    rotation: {x: 0, y: 0, z: 0},
                },
            },
            {
                src: `${path}/pineapple_bottom.gltf`,
                id: "pineapple_bottom",
                type: "gltf",
                animated: false,
                props: {
                    scale: {x: 10, y: 10, z: 10},
                    position: {x: 0, y: 0, z: 0},
                    rotation: {x: 0, y: 0, z: 0},
                },
            },
        ]
    },
];
