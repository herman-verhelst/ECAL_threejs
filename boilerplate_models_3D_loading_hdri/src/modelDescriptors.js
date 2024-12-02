const path = "/models";

export const modelDescriptors = [
	{
		src: `${path}/vulture/model.gltf`,
		id: "vulture",
		type: "gltf",
		animated: false,
		props: {
			scale: { x: 1, y: 1, z: 1 },
			position: { x: 4, y: 0, z: 0 },
			rotation: { x: 0, y: 0, z: 0 },
		},
	},
	{
		src: `${path}/turkey/source/model.gltf`,
		id: "turkey",
		type: "gltf",
		animated: false,
		props: {
			scale: { x: 1, y: 1, z: 1 },
			position: { x: 3, y: 0, z: 0 },
			rotation: { x: 0, y: 0, z: 0 },
		},
	},
	{
		src: `${path}/goose/source/model.gltf`,
		id: "goose",
		type: "gltf",
		animated: false,
		props: {
			scale: { x: 1, y: 1, z: 1 },
			position: { x: 2, y: 0, z: 0 },
			rotation: { x: 0, y: 0, z: 0 },
		},
	},
	{
		src: `${path}/magpie/source/model.gltf`,
		id: "magpie",
		type: "gltf",
		animated: false,
		props: {
			scale: { x: 1, y: 1, z: 1 },
			position: { x: 1, y: 0, z: 0 },
			rotation: { x: 0, y: 0, z: 0 },
		},
	},
	{
		src: `${path}/pelican/source/model.gltf`,
		id: "pelican",
		type: "gltf",
		animated: false,
		props: {
			scale: { x: 1, y: 1, z: 1 },
			position: { x: 0, y: 0, z: 0 },
			rotation: { x: 0, y: 0, z: 0 },
		},
	},
	{
		src: `${path}/penguin/source/model.gltf`,
		id: "penguin",
		type: "gltf",
		animated: false,
		props: {
			scale: { x: 1, y: 1, z: 1 },
			position: { x: -1, y: 0, z: 0 },
			rotation: { x: 0, y: 0, z: 0 },
		},
	},
	{
		src: `${path}/phoenix/source/model.gltf`,
		id: "phoenix",
		type: "gltf",
		animated: false,
		props: {
			scale: { x: 1, y: 1, z: 1 },
			position: { x: -2, y: 0, z: 0 },
			rotation: { x: 0, y: 0, z: 0 },
		},
	},
	{
		src: `${path}/toucan/source/model.gltf`,
		id: "toucan",
		type: "gltf",
		animated: false,
		props: {
			scale: { x: 1, y: 1, z: 1 },
			position: { x: -3, y: 0, z: 0 },
			rotation: { x: 0, y: 0, z: 0 },
		},
	},
	{
		src: `${path}/toucan/source/model.gltf`,
		id: "toucan",
		type: "gltf",
		animated: false,
		props: {
			scale: { x: 1, y: 1, z: 1 },
			position: { x: -4, y: 0, z: 0 },
			rotation: { x: 0, y: 0, z: 0 },
		},
	},

	{
		src: `${path}/pant-walking.fbx`,
		id: "shark",
		type: "fbx",
		animated: true,
		props: {
			scale: { x: 0.02, y: 0.02, z: 0.02 },
			position: { x: 5, y: 0, z: 3 },
			rotation: { x: 0, y: -Math.PI / 2, z: 0 },
		},
	},
];
