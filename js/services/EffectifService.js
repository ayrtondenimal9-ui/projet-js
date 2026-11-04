import { Joueur } from "../models/Joueur.js";

export class EffectifService {
    static async chargerJoueurs() {
        const reponse = await fetch("./data/joueurs.json");

        if (!reponse.ok) {
            throw new Error("Le fichier joueurs.json est introuvable.");
        }

        const donnees = await reponse.json();
        return donnees.map(objet => Joueur.depuisObjet(objet));
    }
}
