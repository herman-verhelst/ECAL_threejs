import * as dat from "dat.gui";

/**
 * Classe gérant les contrôles GUI de l'application
 * Permet de modifier les paramètres des matériaux et de l'animation en temps réel
 */
export default class GuiControls {
  /**
   * Crée une instance des contrôles GUI
   * @param {Object} params - Paramètres à contrôler
   * @param {Function} updateCallback - Fonction appelée lors des changements
   */
  constructor(params, updateCallback) {
    this.params = params;
    this.updateCallback = updateCallback;
    this.gui = new dat.GUI();
    this.setupControls();
  }

  /**
   * Configure tous les contrôles de l'interface
   */
  setupControls() {

    const lightProperties = this.gui.addFolder(
        "Light Properties"
    );
    lightProperties
        .add(this.params, "spotLightX", -20, 50)
        .onChange(() => this.lightPropertiesUpdate());

    lightProperties
        .add(this.params, "spotLightY", -20, 50)
        .onChange(() => this.lightPropertiesUpdate());

    lightProperties
        .add(this.params, "spotLightZ", -20, 50)
        .onChange(() => this.lightPropertiesUpdate());

    lightProperties
        .add(this.params, "spotLightIntensity", 0, 2000)
        .onChange(() => this.lightPropertiesUpdate());

    lightProperties
        .add(this.params, "dirLightX", -20, 50)
        .onChange(() => this.lightPropertiesUpdate());

    lightProperties
        .add(this.params, "dirLightY", -20, 50)
        .onChange(() => this.lightPropertiesUpdate());

    lightProperties
        .add(this.params, "dirLightZ", -20, 50)
        .onChange(() => this.lightPropertiesUpdate());

    lightProperties
        .add(this.params, "dirLightIntensity", 0, 10)
        .onChange(() => this.lightPropertiesUpdate());

    lightProperties
        .add(this.params, "ambientLightIntensity", 0, 10)
        .onChange(() => this.lightPropertiesUpdate());
  }

  /**
   * Met à jour les paramètres et rafraîchit l'affichage GUI
   * @param {Object} newParams - Nouveaux paramètres à appliquer
   */
  updateParams(newParams) {
    Object.assign(this.params, newParams);
    this.gui.updateDisplay();
  }

  lightPropertiesUpdate(newParams) {
    this.updateCallback();
    Object.assign(this.params, newParams);
    this.gui.updateDisplay();
  }

  /**
   * Nettoie l'interface GUI
   */
  destroy() {
    if (this.gui) {
      this.gui.destroy();
    }
  }
}
