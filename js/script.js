const formulaire = document.getElementById("formulaire-joueur");

formulaire.addEventListener("submit", function(event) {

    event.preventDefault();

    const prenom = document.getElementById("champ-prenom").value;
    const nom = document.getElementById("champ-nom").value;
    const annee = document.getElementById("champ-annee").value;
    const numero = document.getElementById("champ-num").value;
    const poste = document.getElementById("champ-poste").value;

    document.getElementById("apercu-prenom").textContent = prenom;
    document.getElementById("apercu-nom").textContent = nom;

    document.getElementById("apercu-annee").textContent = "Année : " + annee;
    document.getElementById("apercu-poste").textContent = " | Poste : " + poste;

    document.getElementById("apercu-num").textContent = "Numéro : " + numero;

});