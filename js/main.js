import { Joueur } from "./models/Joueur.js";
import { StorageService } from "./services/StorageService.js";
import { EffectifService } from "./services/EffectifService.js";

const formulaire = document.querySelector("#formulaire-joueur");
const liste = document.querySelector("#liste-joueurs");
const recherche = document.querySelector("#recherche-joueur");
const filtrePoste = document.querySelector("#filtre-poste");
const message = document.querySelector("#message-validation");

let joueurs = [];

function afficherJoueurs() {
    const texte = recherche.value.toLowerCase().trim();
    const poste = filtrePoste.value;

    const resultat = joueurs.filter(joueur => {
        const nom = joueur.nomComplet().toLowerCase();
        const correspondNom = nom.includes(texte);
        const correspondPoste = poste === "" || joueur.poste === poste;
        return correspondNom && correspondPoste;
    });

    document.querySelector("#compteur-joueurs").textContent =
        resultat.length + " joueur(s) affiché(s) sur " + joueurs.length;

    liste.innerHTML = "";

    if (resultat.length === 0) {
        liste.textContent = "Aucun joueur trouvé.";
        return;
    }

    resultat.forEach(joueur => {
        const carte = document.createElement("article");
        carte.className = "joueur";

        const titre = document.createElement("h3");
        titre.textContent = joueur.nomComplet();

        const infos = document.createElement("p");
        infos.textContent = "N° " + joueur.numero + " - " + joueur.poste;

        const age = document.createElement("p");
        age.textContent = joueur.calculerAge() + " ans";

        const date = document.createElement("p");
        date.textContent = "Ajouté le " +
            new Date(joueur.dateAjout).toLocaleDateString("fr-FR");

        const bouton = document.createElement("button");
        bouton.textContent = "Supprimer";
        bouton.className = "supprimer";
        bouton.addEventListener("click", () => supprimerJoueur(joueur.id));

        carte.append(titre, infos, age, date, bouton);
        liste.appendChild(carte);
    });
}

function afficherStatistiques() {
    document.querySelector("#stat-nombre").textContent = joueurs.length;

    if (joueurs.length === 0) {
        document.querySelector("#stat-moyenne").textContent = "-";
        document.querySelector("#stat-jeune").textContent = "-";
        document.querySelector("#stat-age").textContent = "-";
        document.querySelector("#stat-numero-min").textContent = "-";
        document.querySelector("#stat-numero-max").textContent = "-";
        return;
    }

    const totalAges = joueurs.reduce((total, joueur) => total + joueur.calculerAge(), 0);
    const moyenne = Math.round(totalAges / joueurs.length);

    const plusJeune = joueurs.reduce((a, b) => a.annee > b.annee ? a : b);
    const plusAge = joueurs.reduce((a, b) => a.annee < b.annee ? a : b);
    const numeros = joueurs.map(joueur => joueur.numero);

    document.querySelector("#stat-moyenne").textContent = moyenne + " ans";
    document.querySelector("#stat-jeune").textContent = plusJeune.nomComplet();
    document.querySelector("#stat-age").textContent = plusAge.nomComplet();
    document.querySelector("#stat-numero-min").textContent = Math.min(...numeros);
    document.querySelector("#stat-numero-max").textContent = Math.max(...numeros);
}

function actualiser() {
    afficherJoueurs();
    afficherStatistiques();
}

function supprimerJoueur(id) {
    joueurs = joueurs.filter(joueur => joueur.id !== id);
    StorageService.sauvegarder(joueurs);
    actualiser();
}

formulaire.addEventListener("submit", evenement => {
    evenement.preventDefault();

    const prenom = document.querySelector("#champ-prenom").value;
    const nom = document.querySelector("#champ-nom").value;
    const annee = Number(document.querySelector("#champ-annee").value);
    const numero = Number(document.querySelector("#champ-num").value);
    const poste = document.querySelector("#champ-poste").value;

    try {
        if (joueurs.some(joueur => joueur.numero === numero)) {
            throw new Error("Ce numéro est déjà utilisé.");
        }

        const joueur = new Joueur(prenom, nom, annee, numero, poste);
        joueurs.push(joueur);
        StorageService.sauvegarder(joueurs);

        formulaire.reset();
        recherche.value = "";
        filtrePoste.value = "";
        message.textContent = "Joueur ajouté à l'effectif.";
        actualiser();
    } catch (erreur) {
        message.textContent = erreur.message;
    }
});

recherche.addEventListener("input", afficherJoueurs);
filtrePoste.addEventListener("change", afficherJoueurs);

document.querySelector("#bouton-reinitialiser").addEventListener("click", async () => {
    if (!confirm("Recharger l'effectif de départ ?")) return;

    try {
        joueurs = await EffectifService.chargerJoueurs();
        StorageService.sauvegarder(joueurs);
        recherche.value = "";
        filtrePoste.value = "";
        message.textContent = "Effectif réinitialisé.";
        actualiser();
    } catch (erreur) {
        message.textContent = erreur.message;
    }
});

async function initialiser() {
    const sauvegarde = StorageService.charger();

    if (sauvegarde !== null) {
        joueurs = sauvegarde;
    } else {
        try {
            joueurs = await EffectifService.chargerJoueurs();
            StorageService.sauvegarder(joueurs);
        } catch (erreur) {
            message.textContent = "Impossible de charger les joueurs. Lancez le projet avec Live Server.";
            console.error(erreur);
        }
    }

    actualiser();
}

initialiser();
