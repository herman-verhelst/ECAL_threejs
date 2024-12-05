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
        isButton: true,
        material: materials.plate,
        props: {
            scale: {x: 1, y: 1, z: 1},
            position: {x: 0, y: 0.75, z: 11},
            rotation: {x: 0, y: -Math.PI / 2, z: 0},
        },
    },
    {
        type: 'fruit',
        fruit: Fruit.PINEAPPLE,
        uid: 'green',
        props: {
            scale: {x: 1, y: 1, z: 1},
            position: {x: -4.5, y: .5, z: -3.4},
            rotation: {x: 0, y: -Math.PI - .6, z: 0},
        },
        models: [
            {
                src: `${path}/ant_computer/ant/ant_computer.gltf`,
                id: "ant_computer",
                type: "gltf",
                animated: true,
                props: {
                    scale: {x: .15, y: .15, z: .15},
                    position: {x: -1, y: 4, z: 0},
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
        ],
    },
    {
        type: 'fruit',
        fruit: Fruit.PAPAYA,
        uid: 'black',
        props: {
            scale: {x: 1, y: 1, z: 1},
            position: {x: -3, y: .5, z: 3.5},
            rotation: {x: 0, y: Math.PI - 2, z: 0},
        },
        models: [
            {
                src: `${path}/ant_fishing/ant/ant_fishing.gltf`,
                id: "ant_fishing",
                type: "gltf",
                animated: true,
                props: {
                    scale: {x: 2.5, y: 2.5, z: 2.5},
                    position: {x: -.5, y: 2.5, z: -1},
                    rotation: {x: 0, y: Math.PI / 2, z: 0},
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
        fruit: Fruit.KAKI,
        uid: 'pink',
        props: {
            scale: {x: 0.8, y: 0.8, z: 0.8},
            position: {x: 4.5, y: -.5, z: -.5},
            rotation: {x: 0, y: .2, z: 0},
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
                    position: {x: 1.1, y: 3.8, z: -0.5},
                    rotation: {x: 0, y: Math.PI, z: 0},
                },
            },
        ],
    },
    {
        type: 'fruit',
        fruit: Fruit.MANGO,
        uid: 'red',
        props: {
            scale: {x: 1, y: 1, z: 1},
            position: {x: 2, y: 1, z: -6},
            rotation: {x: .2, y: Math.PI - .75, z: 0},
        },
        models: [
            {
                src: `${path}/ant_BED/mangoTOP/mangoTOPgltf.gltf`,
                id: "mango_top",
                type: "gltf",
                animated: false,
                rotationAnimation: true,
                props: {
                    scale: {x: 10, y: 10, z: 10},
                    position: {x: 3.8, y: 1.4, z: -.8},
                    rotation: {x: 0, y: 0, z: 0},
                },
            },
            {
                src: `${path}/ant_BED/mangoBOTTOM/mangoBOTTOM.gltf`,
                id: "mango_bottom",
                type: "gltf",
                animated: false,
                props: {
                    scale: {x: 10, y: 10, z: 10},
                    position: {x: 0, y: 0, z: 0},
                    rotation: {x: 0, y: 0, z: 0},
                },

            },
            {
                src: `${path}/ant_BED/ant/ant.gltf`,
                id: "ant_bed",
                type: "gltf",
                animated: true,
                fire: true,
                props: {
                    scale: {x: 1.2, y: 1.2, z: 1.2},
                    position: {x: 0, y: 1.5, z: 0},
                    rotation: {x: 0, y: -Math.PI / 2, z: 0},
                },
            }

        ],
    },
    {
        type: 'fruit',
        fruit: Fruit.ORANGE,
        uid: 'orange',
        props: {
            scale: {x: 2, y: 2, z: 2},
            position: {x: 0.3, y: 0, z: 0},
            rotation: {x: 0, y: -Math.PI / 2, z: 0},
        },
        models: [
            {
                src: `${path}/ant_liftingWeights/ant_liftingWeights.gltf`,
                id: "ant_liftingWeights",
                type: "gltf",
                animated: true,
                props: {
                    scale: {x: .6, y: .6, z: .6},
                    position: {x: 0, y: 1.1, z: 0},
                    rotation: {x: 0, y: Math.PI, z: 0},
                },
            },
            {
                src: `${path}/ant_Orange/orange_TOP/orange_TOP.gltf`,
                id: "orange_TOP",
                type: "gltf",
                animated: false,
                rotationAnimation: true,
                props: {
                    scale: {x: 1, y: 1, z: 1},
                    position: {x: 1.2, y: 1.4, z: 0},
                    rotation: {x: 0, y: 0, z: 0},
                },
            },
            {
                src: `${path}/ant_Orange/orange_BOTTOM/orange_BOTTOM.gltf`,
                id: "orange_BOTTOM",
                type: "gltf",
                animated: false,
                props: {
                    scale: {x: 1, y: 1, z: 1},
                    position: {x: 0, y: 0, z: 0},
                    rotation: {x: 0, y: 0, z: 0},
                },
            },

        ]
    },
    {
        type: 'fruit',
        fruit: 'MANDARINE',
        uid: 'blue',
        props: {
            scale: {x: 1, y: 1, z: 1},
            position: {x: 4, y: 0, z: 4},
            rotation: {x: 0, y: 0, z: 0},
        },

        models: [
            {
                src: `${path}/ant_UFO/mandarineTOP/mandarineTOP.gltf`,
                id: "mandarineTOP",
                type: "gltf",
                animated: false,
                rotationAnimation: true,
                props: {
                    scale: {x: 2, y: 2, z: 2},
                    position: {x: 2, y: 2.5, z: -1},
                    rotation: {x: 0, y: 0, z: 0},
                },
            },
            {
                src: `${path}/ant_UFO/mandarineBOTTOM/mandarineBOTTOM.gltf`,
                id: "mandarine_BOTTOM",
                type: "gltf",
                animated: false,
                props: {
                    scale: {x: 2, y: 2, z: 2},
                    position: {x: 0, y: 0, z: 0},
                    rotation: {x: 0, y: 0, z: 0},
                },
            },
            {
                src: `${path}/ant_UFO/ant_UFO_animation/sceneUFO.gltf`,
                id: "UFO",
                type: "gltf",
                animated: true,
                props: {
                    scale: {x: .15, y: .15, z: .15},
                    position: {x: -1, y: 1.5, z: -1},
                    rotation: {x: 0, y: 0, z: 0},
                },
            },
        ],
    },
];