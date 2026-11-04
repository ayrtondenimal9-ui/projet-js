import { Joueur } from "../models/Joueur.js";

export class StorageService {
    static cle = "effectifChicagoBullsDeust";

    static sauvegarder(joueurs) {
        const donnees = joueurs.map(joueur => joueur.versObjet());
        localStorage.setItem(this.cle, JSON.stringify(donnees));
    }

    static charger() {
        const texte = localStorage.getItem(this.cle);

        if (texte === null) {
            return null;
        }

        try {
            const donnees = JSON.parse(texte);
            if (!Array.isArray(donnees)) return null;
            return donnees.map(objet => Joueur.depuisObjet(objet));
        } catch (erreur) {
            console.error("Erreur de lecture du stockage :", erreur);
            return null;
        }
    }
}
