import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { loadModels } from "./loader";
import { loadHDRI } from "./loadHDRI";
import { modelDescriptors } from "./modelDescriptors";

export default class App {
	constructor() {
		this.meshes = [];
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		this.arrayModels = modelDescriptors;
		this.lights = {};
		this.preload();
	}

	preload() {
		loadModels(this.arrayModels).then((models) => {
			this.models = models;
			this.init();
		});
	}

	init() {
		this.createRenderer();
		this.createScene();
		this.createCamera();
		this.createLights();
		this.createSky();
		this.createControls();
		this.createModels();
		this.render();
	}
	createRenderer() {
		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(this.renderer.domElement);
	}

	createModels() {
		this.models.forEach((model) => {
			let obj = model.object;
			obj.position.x = Math.random() * 6 - 3;
			obj.position.z = Math.random() * 6 - 3;
			obj.position.y = Math.random() * 6 - 3;
			this.scene.add(obj);
			this.meshes.push(obj);
		});
	}

	createCamera() {
		const zoom = 200;
		this.camera = new THREE.OrthographicCamera(
			this.width / -zoom,
			this.width / zoom,
			this.height / zoom,
			this.height / -zoom,
			0,
			2000
		);
		this.camera.position.set(-10, -10, -10);
		this.camera.lookAt(0, 0, 0);
	}

	createLights() {
		const lightDirectional = new THREE.DirectionalLight(0xffffff, 100, 100);
		lightDirectional.position.set(0, 10, 10);
		const pointLight = new THREE.PointLight(0xffffff, 10, 1000);
		pointLight.position.set(0, 0, -10);
		this.scene.add(lightDirectional, pointLight);
		this.lights.directional = lightDirectional;
		this.lights.point = pointLight;
	}

	createSky() {
		loadHDRI("/hdri/small_harbour_sunset_1k.hdr", this.renderer).then(
			(texture) => {
				this.scene.environment = texture;
			}
		);
	}
	createScene() {
		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color(0x3faafc);
	}
	createControls() {
		this.controls = new OrbitControls(this.camera, this.renderer.domElement);
	}

	render() {
		this.meshes.forEach((mesh, index) => {
			mesh.position.z += Math.cos(Date.now() * 0.001 + index * 10) * 0.01;
			mesh.rotation.y += Math.sin(Date.now() * 0.001 + index * 10) * 0.001;
		});
		this.lights.point.position.z = Math.sin(Date.now() * 0.001) * 20;
		this.lights.point.position.x = Math.cos(Date.now() * 0.001) * 20;
		this.renderer.render(this.scene, this.camera);
		requestAnimationFrame(this.render.bind(this));
	}
}
