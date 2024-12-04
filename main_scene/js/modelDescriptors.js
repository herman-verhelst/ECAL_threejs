import {Fruit} from "./fruits/Fruit.js";
import {materials} from "./materials/Materials.js";

const path = "/models";

export const modelDescriptors = [
    {
        src: `${path}/fruitbowl/fruitbowl.gltf`,
        id: "fruitbowl",
        type: "gltf",
        animated: false,
        material: materials.plate,
        props: {
            scale: {x: 10, y: 10, z: 10},
            position: {x: 0, y: 0, z: 0},
            rotation: {x: 0, y: 0, z: 0},
        },
    },
    {
        src: `${path}/buttons/buttons.gltf`,
        id: "button",
        type: "gltf",
        animated: false,
        mirrored: true,
        material: materials.plate,
        props: {
            scale: {x: 1, y: 1, z: 1},
            position: {x: -5, y: 0.75, z: 10},
            rotation: {x: 0, y: -Math.PI / 2, z: 0},
        },
    },
    {
        type: 'fruit',
        fruit: Fruit.PINEAPPLE,
        uid: 'pink',
        props: {
            scale: {x: 1, y: 1, z: 1},
            position: {x: -4, y: .5, z: -2},
            rotation: {x: 0, y: -Math.PI, z: 0},
        },
        models: [
            {
                src: `${path}/ant_liftingWeights/ant_liftingWeights.gltf`,
                id: "ant_liftingWeights",
                type: "gltf",
                animated: true,
                props: {
                    scale: {x: 1.5, y: 1.5, z: 1.5},
                    position: {x: -1, y: 3.35, z: 0},
                    rotation: {x: 0, y: Math.PI, z: 0},
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
