const CLE_STOCKAGE = "joueursChicagoBulls";

const creerId = () => Date.now() + "-" +
    Math.random().toString(36).slice(2, 8);

const creerJoueur = (prenom, nom, annee, numero, poste) => ({
    id: creerId(),
    prenom,
    nom,
    annee: Number(annee),
    numero: Number(numero),
    poste,
    dateAjout: new Date().toISOString()
});

const chargerJoueurs = () => {
    try {
        const donnees = localStorage.getItem(CLE_STOCKAGE);

        if (donnees !== null) {
            const joueursCharges = JSON.parse(donnees);

            if (Array.isArray(joueursCharges)) {
                return joueursCharges;
            }
        }
    } catch (erreur) {
        console.error("Erreur de chargement des joueurs :", erreur);
    }

    return [
        {
            id: "jordan-23",
            prenom: "Michael",
            nom: "Jordan",
            annee: 1963,
            numero: 23,
            poste: "Arrière",
            dateAjout: new Date().toISOString()
        }
    ];
};

let joueurs = chargerJoueurs();

const sauvegarderJoueurs = () => {
    try {
        localStorage.setItem(
            CLE_STOCKAGE,
            JSON.stringify(joueurs)
        );
    } catch (erreur) {
        console.error("Erreur de sauvegarde :", erreur);
        afficherMessage(
            "Impossible de sauvegarder les données dans le navigateur.",
            false
        );
    }
};

const echapperHTML = (valeur) =>
    String(valeur).replace(/[&<>"']/g, (caractere) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[caractere]);

const afficherMessage = (texte, succes = true) => {
    const message = document.querySelector("#message-validation");

    message.textContent = texte;
    message.className = succes ? "message succes" : "message erreur";
};

const validerJoueur = (prenom, nom, annee, numero, poste) => {
    const anneeNombre = Number(annee);
    const numeroNombre = Number(numero);
    const anneeActuelle = new Date().getFullYear();

    if (!prenom.trim() || !nom.trim() || !poste) {
        return "Remplis tous les champs.";
    }

    if (
        !Number.isInteger(anneeNombre) ||
        anneeNombre < 1900 ||
        anneeNombre > anneeActuelle
    ) {
        return "Saisis une année de naissance valide.";
    }

    if (
        !Number.isInteger(numeroNombre) ||
        numeroNombre < 0 ||
        numeroNombre > 99
    ) {
        return "Le numéro doit être compris entre 0 et 99.";
    }

    return "";
};


const afficherJoueurs = () => {
    const liste = document.querySelector("#liste-joueurs");
    const compteur = document.querySelector("#compteur-joueurs");
    const recherche = document.querySelector("#recherche-joueur")
        .value.trim().toLowerCase();
    const messageListe = document.querySelector("#message-liste");

    const joueursFiltres = joueurs.filter((joueur) => {
        const texteJoueur = [
            joueur.prenom,
            joueur.nom,
            joueur.poste
        ].join(" ").toLowerCase();

        return texteJoueur.includes(recherche);
    });


    const cartes = joueursFiltres.map((joueur) => {
        const age = new Date().getFullYear() - joueur.annee;
        const dateAjout = new Date(joueur.dateAjout);

        const dateFormatee = Number.isNaN(dateAjout.getTime())
            ? "Date inconnue"
            : dateAjout.toLocaleDateString("fr-FR");

        return `
            <article class="carte-joueur">
                <div class="numero-joueur">
                    #${echapperHTML(joueur.numero)}
                </div>

                <h3>
                    ${echapperHTML(joueur.prenom)}
                    ${echapperHTML(joueur.nom)}
                </h3>

                <p>
                    <strong>Poste :</strong>
                    ${echapperHTML(joueur.poste)}
                </p>

                <p>
                    <strong>Naissance :</strong>
                    ${echapperHTML(joueur.annee)}
                </p>

                <p>
                    <strong>Âge :</strong>
                    ${age} ans
                </p>

                <p class="date-ajout">
                    Ajouté le ${dateFormatee}
                </p>

                <button
                    type="button"
                    class="bouton-supprimer"
                    data-id="${echapperHTML(joueur.id)}"
                >
                    Supprimer
                </button>
            </article>
        `;
    });

    liste.innerHTML = cartes.join("");

    compteur.textContent =
        `${joueursFiltres.length} joueur(s) affiché(s) sur ${joueurs.length}`;

    messageListe.textContent = joueursFiltres.length === 0
        ? "Aucun joueur ne correspond à la recherche."
        : "";
};


const calculerStatistiques = () => {
    const nombre = joueurs.length;
    const anneeActuelle = new Date().getFullYear();

    const elementNombre = document.querySelector("#stat-nombre");
    const elementMoyenne = document.querySelector("#stat-moyenne");
    const elementJeune = document.querySelector("#stat-jeune");
    const elementAge = document.querySelector("#stat-age");
    const elementNumeroMin = document.querySelector("#stat-numero-min");
    const elementNumeroMax = document.querySelector("#stat-numero-max");

    elementNombre.textContent = nombre;

    if (nombre === 0) {
        elementMoyenne.textContent = "0,00 ans";
        elementJeune.textContent = "—";
        elementAge.textContent = "—";
        elementNumeroMin.textContent = "—";
        elementNumeroMax.textContent = "—";
        return;
    }


    const totalAges = joueurs.reduce((total, joueur) => {
        return total + (anneeActuelle - joueur.annee);
    }, 0);

    const moyenne = totalAges / nombre;

    elementMoyenne.textContent = `${moyenne.toFixed(2)} ans`;

    const ages = joueurs.map(
        (joueur) => anneeActuelle - joueur.annee
    );

    const numeros = joueurs.map((joueur) => joueur.numero);

    const ageMinimum = Math.min(...ages);
    const ageMaximum = Math.max(...ages);

    const numeroMinimum = Math.min(...numeros);
    const numeroMaximum = Math.max(...numeros);

    const plusJeune = joueurs.find(
        (joueur) => anneeActuelle - joueur.annee === ageMinimum
    );

    const plusAge = joueurs.find(
        (joueur) => anneeActuelle - joueur.annee === ageMaximum
    );

    elementJeune.textContent =
        `${plusJeune.prenom} ${plusJeune.nom} (${ageMinimum} ans)`;

    elementAge.textContent =
        `${plusAge.prenom} ${plusAge.nom} (${ageMaximum} ans)`;

    elementNumeroMin.textContent = numeroMinimum;
    elementNumeroMax.textContent = numeroMaximum;
};


const ajouterJoueur = (event) => {
    event.preventDefault();

    const prenom = document.querySelector("#champ-prenom").value.trim();
    const nom = document.querySelector("#champ-nom").value.trim();
    const annee = document.querySelector("#champ-annee").value;
    const numero = document.querySelector("#champ-num").value;
    const poste = document.querySelector("#champ-poste").value;

    const erreur = validerJoueur(
        prenom,
        nom,
        annee,
        numero,
        poste
    );

    if (erreur) {
        afficherMessage(erreur, false);
        return;
    }

    const nouveauJoueur = creerJoueur(
        prenom,
        nom,
        annee,
        numero,
        poste
    );

    joueurs = [...joueurs, nouveauJoueur];

    sauvegarderJoueurs();

    document.querySelector("#formulaire-joueur").reset();

    afficherMessage("Joueur ajouté avec succès !");
    actualiserApplication();
};


const supprimerJoueur = (id) => {

    joueurs = joueurs.filter((joueur) => joueur.id !== id);

    sauvegarderJoueurs();
    actualiserApplication();

    afficherMessage("Joueur supprimé.");
};


document.querySelector("#liste-joueurs").addEventListener("click", (event) => {
    const bouton = event.target.closest(".bouton-supprimer");

    if (bouton) {
        supprimerJoueur(bouton.dataset.id);
    }
});


const actualiserApplication = () => {
    afficherJoueurs();
    calculerStatistiques();
};


document
    .querySelector("#formulaire-joueur")
    .addEventListener("submit", ajouterJoueur);

document
    .querySelector("#recherche-joueur")
    .addEventListener("input", afficherJoueurs);


actualiserApplication();
