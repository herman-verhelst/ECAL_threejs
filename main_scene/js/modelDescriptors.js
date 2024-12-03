const path = "/models";

export const modelDescriptors = [
	{
		src: `${path}/fruitbowl/model.obj`,
		id: "fruitbowl",
		type: "obj",
		animated: false,
		target: "brown",
		clickable: true,
		props: {
			scale: { x: 10, y: 10, z: 10 },
			position: { x: 0, y: -5, z: 0 },
			rotation: { x: 0, y: 0, z: 0 },
		},
	},
	{
		src: `${path}/ant_liftingWeights.gltf`,
		id: "ant_liftingWeights",
		type: "gltf",
		animated: true,
		props: {
			scale: { x: 1, y: 1, z: 1 },
			position: { x: 0, y: 0, z: 0 },
			rotation: { x: 0, y: 0, z: 0 },
		},
	},
];
