export class Joueur {
    #id;
    #prenom;
    #nom;
    #annee;
    #numero;
    #poste;
    #dateAjout;

    constructor(prenom, nom, annee, numero, poste, id = Date.now(), dateAjout = new Date().toISOString()) {
        this.#id = id;
        this.prenom = prenom;
        this.nom = nom;
        this.annee = annee;
        this.numero = numero;
        this.poste = poste;
        this.#dateAjout = dateAjout;
    }

    get id() { return this.#id; }
    get prenom() { return this.#prenom; }
    get nom() { return this.#nom; }
    get annee() { return this.#annee; }
    get numero() { return this.#numero; }
    get poste() { return this.#poste; }
    get dateAjout() { return this.#dateAjout; }

    set prenom(valeur) {
        if (!String(valeur).trim()) throw new Error("Le prénom est obligatoire.");
        this.#prenom = String(valeur).trim();
    }

    set nom(valeur) {
        if (!String(valeur).trim()) throw new Error("Le nom est obligatoire.");
        this.#nom = String(valeur).trim();
    }

    set annee(valeur) {
        const annee = Number(valeur);
        if (!Number.isInteger(annee) || annee < 1940 || annee > new Date().getFullYear()) {
            throw new Error("Année de naissance invalide.");
        }
        this.#annee = annee;
    }

    set numero(valeur) {
        const numero = Number(valeur);
        if (!Number.isInteger(numero) || numero < 0 || numero > 99) {
            throw new Error("Le numéro doit être entre 0 et 99.");
        }
        this.#numero = numero;
    }

    set poste(valeur) {
        const postes = ["Meneur", "Arrière", "Ailier", "Ailier fort", "Pivot"];
        if (!postes.includes(valeur)) throw new Error("Poste invalide.");
        this.#poste = valeur;
    }

    calculerAge() {
        return new Date().getFullYear() - this.#annee;
    }

    nomComplet() {
        return this.#prenom + " " + this.#nom;
    }

    versObjet() {
        return {
            id: this.#id,
            prenom: this.#prenom,
            nom: this.#nom,
            annee: this.#annee,
            numero: this.#numero,
            poste: this.#poste,
            dateAjout: this.#dateAjout
        };
    }

    static depuisObjet(objet) {
        return new Joueur(
            objet.prenom, objet.nom, objet.annee, objet.numero,
            objet.poste, objet.id, objet.dateAjout
        );
    }
}
