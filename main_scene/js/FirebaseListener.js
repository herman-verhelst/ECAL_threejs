import FirebaseConfig from "./FirebaseConfig.js";
import DebugLayer from "./UI_tools/DebugLayer.js";

/**
 * Classe qui écoute les changements dans Firebase et met à jour les cubes en conséquence
 */
export default class FirebaseListener {
  /**
   * Initialise l'écouteur Firebase
   * @param {Array} cubes - Tableau des cubes à contrôler
   */
  constructor(cubes) {
    this.cubes = cubes;
    this.firstCall = false;
    this.initDebugLayer();
    this.setupListener();
  }

  /**
   * Initialise la couche de débogage
   */
  initDebugLayer() {
    this.debugLayer = new DebugLayer();
  }

  /**
   * Configure l'écouteur sur le nœud "connections" de Firebase
   */
  setupListener() {
    FirebaseConfig.listenToData("connections", (data) => {
      // Ignore le premier appel pour éviter les effets indésirables à l'initialisation
      if (!this.firstCall) {
        this.firstCall = true;
        return;
      }

      this.handleFirebaseData(data);
    });
  }

  /**
   * Gère les données reçues de Firebase
   * @param {Object} data - Données reçues de Firebase
   */
  handleFirebaseData(data) {
    // Ajoute le message à la couche de débogage
    this.debugLayer.addMessage(data);

    // Traite chaque entrée de données
    Object.keys(data).forEach((key) => {
      this.processDataEntry(key, data[key]);
    });
  }

  /**
   * Traite une entrée de données spécifique
   * @param {string} key - Clé de l'entrée
   * @param {Object} entry - Données de l'entrée
   */
  processDataEntry(key, entry) {
    if (entry.target === FirebaseConfig.UID) {
      this.cubes.forEach((cube) => {
        if (this.shouldActivateCube(cube, key, entry)) {
          cube.activate();
        }
      });
    }
  }

  /**
   * Vérifie si un cube doit être activé
   * @param {Cube} cube - Le cube à vérifier
   * @param {string} key - Identifiant de l'entrée
   * @param {Object} entry - Données de l'entrée
   * @returns {boolean} - Vrai si le cube doit être activé
   */
  shouldActivateCube(cube, key, entry) {
    if (cube.uid !== key || cube.clickable) return false;

    // Vérifie si un changement d'état est nécessaire
    return !(
      (cube.isPressed && entry.position === "up") ||
      (!cube.isPressed && entry.position === "down")
    );
  }

  /**
   * Met à jour la référence aux cubes si nécessaire
   * @param {Array} newCubes - Nouveau tableau de cubes
   */
  updateCubes(newCubes) {
    this.cubes = newCubes;
  }

  /**
   * Met à jour la référence à la couche de débogage si nécessaire
   * @param {DebugLayer} newDebugLayer - Nouvelle couche de débogage
   */
  updateDebugLayer(newDebugLayer) {
    this.debugLayer = newDebugLayer;
  }
}
