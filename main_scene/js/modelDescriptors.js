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
        uid: 'yellow',
        props: {
            scale: {x: 1, y: 1, z: 1},
            position: {x: -4.5, y: .5, z: -3.4},
            rotation: {x: 0, y: -Math.PI - 1, z: 0},
        },
        models: [
            {
                src: `${path}/ant_liftingWeights/ant_liftingWeights.gltf`,
                id: "ant_liftingWeights",
                type: "gltf",
                animated: true,
                props: {
                    scale: {x: 1.5, y: 1.5, z: 1.5},
                    position: {x: -1, y: 4, z: 0},
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
                    scale: {x: 12, y: 12, z: 12},
                    position: {x: 2.2, y: 4, z: .7},
                    rotation: {x: 0, y: 0, z: 0},
                },
            },
            {
                src: `${path}/pineapple_bottom.gltf`,
                id: "pineapple_bottom",
                type: "gltf",
                animated: false,
                props: {
                    scale: {x: 12, y: 12, z: 12},
                    position: {x: 0, y: 0, z: 0},
                    rotation: {x: 0, y: 0, z: 0},
                },
            },
        ]
    },
    {
        type: 'fruit',
        fruit: Fruit.PAPAYA,
        uid: 'black',
        props: {
            scale: {x: 1, y: 1, z: 1},
            position: {x: -3, y: .5, z: 3},
            rotation: {x: 0, y: Math.PI - 2, z: 0},
        },
        models: [
            {
                src: `${path}/ant_computer/ant/ant_computer.gltf`,
                id: "ant_computer",
                type: "gltf",
                animated: true,
                props: {
                    scale: {x: .15, y: .15, z: .15},
                    position: {x: 0, y: 1.75, z: 1},
                    rotation: {x: 0, y: Math.PI, z: 0},
                },
            },
            {
                src: `${path}/ant_computer/papaya_bottom/papaya_bottom.gltf`,
                id: "papaya_bottom",
                type: "gltf",
                animated: false,
                props: {
                    scale: {x: 12, y: 12, z: 12},
                    position: {x: 0, y: 0, z: 0},
                    rotation: {x: 0, y: 0, z: 0},
                },
            },
            {
                src: `${path}/ant_computer/papaya_top/papaya_top.gltf`,
                id: "papaya_top",
                type: "gltf",
                rotationAnimation: true,
                rotationAxis: 'x',
                animated: false,
                props: {
                    scale: {x: 12, y: 12, z: 12},
                    position: {x: -.75, y: 2.3, z: -4.5},
                    rotation: {x: 0, y: 0, z: 0},
                },
            },
        ],
    },

    
    {
        type: 'fruit',
        fruit: 'CAKI',
        uid: 'red',
        props: {
            scale: {x: 0.8, y: 0.8, z: 0.8},
            position: {x: 2, y: 0, z: -2},
            rotation: {x: 0, y: Math.PI/2, z: 0},
        },
        models: [
            {
                src: `${path}/ant_Splat/cakiTOP/cakiTOP.gltf`,
                id: "caki_top",
                type: "gltf",
                animated: false,
                rotationAnimation: true,
                props: {
                    scale: {x: 13, y: 13, z: 13},
                    position: {x: 3.7, y: 3.5, z: .25},
                    rotation: {x: 0, y: .05, z: 0},
                },
            },
            {
                src: `${path}/ant_Splat/weight/weight.gltf`,
                id: "weight",
                type: "gltf",
                animated: false,
                isWeight: true,
                props: {
                    scale: {x: 10, y: 10, z: 10},
                    position: {x: 1.1, y: 15, z: -.5},
                    rotation: {x: 0, y: 0, z: 0},
                },
            },
            {
                src: `${path}/ant_Splat/cakiBOTTOM/cakiBOTTOM.gltf`,
                id: "caki_bottom",
                type: "gltf",
                animated: false,
                props: {
                    scale: {x: 13, y: 13, z: 13},
                    position: {x: 0, y: 0, z: 0},
                    rotation: {x: 0, y: 0, z: 0},
                },
            },
            {
                src: `${path}/ant_Splat/crashSplat.gltf`,
                id: "ant_Splat",
                type: "gltf",
                animated: true,
                props: {
                    scale: {x: .15, y: .15, z: .15},
                    position: {x: 1.1, y: 4.2, z: -0.5},
                    rotation: {x: 0, y: Math.PI, z: 0},
                },
            },
        ],
    },
];
