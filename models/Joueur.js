class Joueur {
    #id;
    #prenom;
    #nom;
    #annee;
    #numero;
    #poste;
    #dateAjout;

    constructor(prenom, nom, annee, numero, poste) {
        this.#id = Date.now();
        this.prenom = prenom;
        this.nom = nom;
        this.annee = annee;
        this.numero = numero;
        this.poste = poste;
        this.#dateAjout = new Date();
    }

    get id() {
        return this.#id;
    }

    get prenom() {
        return this.#prenom;
    }
}