import * as THREE from "three";

export default class App {
  constructor() {
    // === Configuration du moteur de rendu (Renderer) ===
    // Création d'un renderer WebGL avec antialiasing pour des bords plus lisses
    this.renderer = new THREE.WebGLRenderer({ antialias: true });

    // Adaptation de la taille du renderer à la fenêtre
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    // Activation des ombres dans le renderer
    this.renderer.shadowMap.enabled = true;
    // Utilisation d'ombres douces de type PCF
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Ajout du canvas de rendu au document HTML
    document.body.appendChild(this.renderer.domElement);

    // === Configuration de la scène ===
    // Création d'un nouvel espace 3D
    this.scene = new THREE.Scene();
    // Définition d'un fond gris moyen (RGB: 128,128,128)
    this.scene.background = new THREE.Color(0x808080);

    // === Configuration de la caméra orthographique ===
    // Calcul du ratio d'aspect pour maintenir les proportions
    const aspect = window.innerWidth / window.innerHeight;
    const size = 10; // Taille de la vue orthographique
    // Création d'une caméra avec projection orthographique
    this.camera = new THREE.OrthographicCamera(
      -size * aspect, // gauche
      size * aspect, // droite
      size, // haut
      -size, // bas
      1, // near (plan proche)
      1000 // far (plan éloigné)
    );
    // Positionnement de la caméra en vue isométrique
    this.camera.position.set(10, 10, 10);
    // Orientation de la caméra vers le centre de la scène
    this.camera.lookAt(0, 0, 0);

    // === Configuration de l'éclairage ===
    // Lumière ambiante pour un éclairage global doux
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    this.scene.add(ambientLight);

    // Lumière directionnelle pour créer des ombres
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(15, 5, -5);
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);

    // Helper visuel pour la lumière directionnelle (commenté)
    const helper = new THREE.DirectionalLightHelper(directionalLight, 5);
    // this.scene.add(helper);

    // === Création du cube ===
    // Chargeur de texture pour le cube (non utilisé actuellement)
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load("./texture/crate.jpg");

    // Géométrie et matériau du cube
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshStandardMaterial({
      //   map: texture,
      color: 0x3060ff, // Couleur bleue
      roughness: 1, // Surface mate
      metalness: 0, // Pas d'aspect métallique
    });
    this.cube = new THREE.Mesh(geometry, material);
    this.cube.castShadow = true;
    this.cube.receiveShadow = true;
    this.cube.position.y = 1; // Élévation du cube
    this.cube.position.x = -2; // Décalage vers la gauche
    this.scene.add(this.cube);

    // === Création de la sphère ===
    // Géométrie sphérique avec bonne résolution
    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);

    // Deux matériaux différents pour la sphère
    const sphereMaterial = new THREE.MeshStandardMaterial({
      color: 0x3060ff,
      roughness: 1,
      metalness: 0.5, // Aspect semi-métallique
      // wireframe: true, // Affichage en mode
    });

    const shinyMaterial = new THREE.MeshStandardMaterial({
      color: 0x3060ff,
      roughness: 0.5, // Surface plus lisse
      metalness: 0.8, // Aspect très métallique
      // wireframe: true, // Affichage en mode fil de fer
    });

    // Configuration de la sphère avec le matériau brillant
    this.sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    this.sphere.castShadow = true;
    this.sphere.receiveShadow = true;
    this.sphere.position.set(2, 1, 0); // Position à droite du centre
    this.scene.add(this.sphere);

    // === Création du sol ===
    // Grand plan pour servir de sol
    const planeGeometry = new THREE.PlaneGeometry(20, 20);
    const planeMaterial = new THREE.MeshStandardMaterial({
      color: 0x303080, // Bleu foncé
      roughness: 1, // Surface mate
      metalness: 0, // Pas d'aspect métallique
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2; // Rotation pour l'horizontalité
    plane.receiveShadow = true; // Reçoit les ombres des objets
    this.scene.add(plane);

    // === Initialisation de l'animation ===
    // Démarrage de la boucle de rendu
    this.animate();

    // === Gestion des événements ===
    // Adaptation au redimensionnement de la fenêtre
    // window.addEventListener("resize", this.onWindowResize.bind(this));
  }

  // Boucle d'animation pour le rendu continu
  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.renderer.render(this.scene, this.camera);
  }

  // Gestion du redimensionnement de la fenêtre
  onWindowResize() {
    const aspect = window.innerWidth / window.innerHeight;
    const size = 10;

    // Mise à jour des paramètres de la caméra orthographique
    this.camera.left = -size * aspect;
    this.camera.right = size * aspect;
    this.camera.top = size;
    this.camera.bottom = -size;

    // Application des changements
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
