import * as THREE from "three";

/**
 * Classe gérant les interactions utilisateur avec les cubes
 * Permet de détecter et gérer les clics sur les cubes
 */
export default class Interaction {
  /**
   * Initialise le gestionnaire d'interactions
   * @param {THREE.Camera} camera - Caméra de la scène
   * @param {THREE.Scene} scene - Scène Three.js
   * @param {Array} cubes - Tableau des cubes interactifs
   */
  constructor(camera, scene, cubes) {
    this.camera = camera;
    this.scene = scene;
    this.cubes = cubes;

    // Initialisation du raycaster pour la détection des clics
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    window.addEventListener("click", this.onClick.bind(this));
  }

  /**
   * Gère les événements de clic
   * @param {Event} event - Événement de clic
   */
  onClick(event) {
    // Conversion de la position de la souris en coordonnées normalisées
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Lance un rayon depuis la caméra à travers la position de la souris
    this.raycaster.setFromCamera(this.mouse, this.camera);

    const arrayChildren = [];
    this.cubes.map((cube) => {
      cube.traverse((child) => {
        if (child.isMesh) {
          arrayChildren.push(child);
        }
      });
    });

    

    const intersects = this.raycaster.intersectObjects(
      arrayChildren
    );


    let dist =null;
    let clickedCube  = null;
    if(intersects.length>0){
      intersects.map((intersect)=>{
        if(dist==null || intersect.distance<dist){
          clickedCube = intersect.object;
      }});

      console.log(clickedCube)
      if (clickedCube) {
        // clickedCube.togglePress();
      }
    }



    // Vérifie si un cube a été touché
    // if (intersects.length > 0) {
    //   const clickedCube = this.cubes.find(
    //     (cube) => cube.mesh === intersects[0].object
    //   );


    //   console.log(clickedCube);

     
    // }
  }

  /**
   * Met à jour l'état des interactions
   * Pas d'animations nécessaires - les changements de position sont immédiats
   */
  update() {
    // Aucune mise à jour d'animation nécessaire
  }

  /**
   * Nettoie les écouteurs d'événements
   */
  dispose() {
    window.removeEventListener("click", this.onClick);
  }
}
