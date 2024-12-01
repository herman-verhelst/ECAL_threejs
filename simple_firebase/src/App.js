import FirebaseConfig from "./FirebaseConfig.js";

/**
 * Classe principale de l'application
 * Gère l'interface utilisateur et les interactions avec Firebase
 */
export default class App {
  /**
   * Initialise l'application
   * Crée un identifiant unique, configure l'interface et initialise les écouteurs
   */
  constructor() {
    console.log("Application initialisée");

    // Définir un UID aléatoire pour cette instance
    FirebaseConfig.sourceUID =
      "user" + Math.random().toString(36).replace(".", "");

    // Créer et ajouter le bouton au document
    this.creerBoutonMessage();

    // Envoyer des données initiales
    // this.envoyerMessage("Bonjour de " + FirebaseConfig.UID);

    // Écouter les messages
    this.ecouterMessages();
  }

  /**
   * Crée et configure le bouton d'envoi de message
   * Ajoute un gestionnaire d'événements pour l'envoi de messages aléatoires
   */
  creerBoutonMessage() {
    const bouton = document.createElement("button");
    bouton.textContent = "Envoyer un message aléatoire";
    bouton.addEventListener("click", () => {
      // Liste des messages possibles
      const messagesAleatoires = [
        "Bonjour !",
        "Comment ça va ?",
        "Il fait beau aujourd'hui",
        "Firebase est génial",
        "Message aléatoire en approche",
      ];
      // Sélection aléatoire d'un message
      const messageAleatoire =
        messagesAleatoires[
          Math.floor(Math.random() * messagesAleatoires.length)
        ];
      this.envoyerMessage(messageAleatoire);
    });
    document.body.appendChild(bouton);
  }

  /**
   * Envoie un message à la base de données Firebase
   * @param {string} message - Le message à envoyer
   */
  envoyerMessage(message) {
    // Envoyer un message au chemin 'messages' avec horodatage
    FirebaseConfig.sendData(`messages/${FirebaseConfig.UID}`, {
      message: message,
      timestamp: Date.now(),
    });
  }

  /**
   * Configure l'écouteur pour les messages entrants
   * Affiche les messages reçus dans la console
   */
  ecouterMessages() {
    // Écouter tous les messages
    FirebaseConfig.listenToData("messages", (data) => {
      if (data) {
        console.log("Messages reçus:", data);
        // Traitement et affichage des messages reçus
        document.getElementById("zoneMessages").value = "";
        Object.entries(data).forEach(([uid, messageData]) => {
          console.log(`Message de ${uid}:`, messageData.message);
          // Afficher les messages dans la zone de texte
          document.getElementById(
            "zoneMessages"
          ).value += `[${new Date().toLocaleTimeString()}] ${uid}: ${
            messageData.message
          }\n`;
        });
      }
    });
  }
}
