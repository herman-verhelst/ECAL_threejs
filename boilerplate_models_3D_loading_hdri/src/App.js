import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { loadModels } from "./loader";
import { loadHDRI } from "./loadHDRI";
import { modelDescriptors } from "./modelDescriptors";

export default class App {
	constructor() {
		this.meshes = [];
		this.mixers = [];
		this.clock = new THREE.Clock();
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
			const pos = model.props.position;
			const scale = model.props.scale;
			const rot = model.props.rotation;
			obj.position.set(pos.x, pos.y, pos.z);
			obj.scale.set(scale.x, scale.y, scale.z);
			obj.rotation.set(rot.x, rot.y, rot.z);

			this.scene.add(obj);
			this.meshes.push(obj);
			if (model.animated == true) {
				const mixer = new THREE.AnimationMixer(obj);
				let action = mixer.clipAction(obj.animations[0]).play();
				action.play();
				this.mixers.push(mixer);
			}
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
		const lightDirectional = new THREE.DirectionalLight(0xffffff, 10, 10);
		lightDirectional.position.set(0, 10, 10);
		const pointLight = new THREE.PointLight(0xffffff, 1, 1000);
		pointLight.position.set(0, 1, 0);
		this.scene.add(lightDirectional, pointLight);
		const helper = new THREE.PointLightHelper(pointLight, 5);
		// this.scene.add(helper);
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
		const delta = this.clock.getDelta();
		this.mixers.forEach((mixer) => {
			mixer.update(delta);
		});
		this.meshes.forEach((mesh, index) => {
			// mesh.position.z += Math.cos(Date.now() * 0.001 + index * 10) * 0.01;
			mesh.rotation.y += Math.sin(Date.now() * 0.001 + index * 10) * 0.001;
		});
		this.lights.point.position.y = Math.sin(Date.now() * 0.001) * 10;
		this.lights.point.position.z = Math.sin(Date.now() * 0.001) * 10;
		this.lights.point.position.x = Math.cos(Date.now() * 0.001) * 10;
		this.renderer.render(this.scene, this.camera);
		requestAnimationFrame(this.render.bind(this));
	}
}
