// fonction qui fait le fetch(), qui contact l'API
async function callAPI(uri){
    console.log("--callAPI - start --");
    console.log("uri = ", uri);

    // fetch(), appel à l'API et réception de la réponse
    const response = await fetch(uri);
    console.log("response = ", response);

    //récupération des données JSON reçues de l'API
    const data = await response.json();
    console.log("--callAPI - end --");

    console.log("--callAPI - end --");

    // renvoi des données
    return data;
}

//constante globale : l'URI du endpoint de demande de nouveau deck
const API_ENDPOINT_NEW_DECK = "https://deckofcardsapi.com/api/deck/new/";

async function getNewDeck() {
    console.log(">> getNewDeck");

    return await callAPI(API_ENDPOINT_NEW_DECK);
}

// variable globale : l'id du deck utilisé, dans lequel on pioche
let idDeck = null;
// fonctions (syntaxe de fonction fléchée) qui renvoie des URI dynamiques de demande de mélange du deck et de pioche
const getApiEndpointShuffleDeck = () => `https://deckofcardsapi.com/api/deck/${idDeck}/shuffle`;

//fonction de demande de mélange du deck
async function shuffleDeck() {
    return await callAPI(getApiEndpointShuffleDeck());
}

// fonctions (syntaxe de fonction fléchée) qui renvoie des URI dynamiques de demande de mélange du deck et de pioche
const getApiEndpointDrawCard = () => `https://deckofcardsapi.com/api/deck/${idDeck}/draw/?count=1`;

//fonction de demande de pioche du deck
async function drawCard() {
    return await callAPI(getApiEndpointDrawCard());
}

// supprime les cartes de l'ancien deck du DOM
const cleanDomCardsFromPreviousDeck = () => 
// récupération des cartes (classe CSS "card")
document.querySelectorAll(".card")
// et pour chacune des cartes
.forEach((child) => 
// suppression du DOM
child.remove());

// fonction de réinitialisation (demande de nouveau deck + demande de mélange de ce nouvau deck)
async function actionReset() {
    // vider dans le DOm les cartes de l'ancien DOM
    cleanDomCardsFromPreviousDeck();
    // récupération d'un nouveau deck
    const newDeckResponse = await getNewDeck();
    // récupération de l'id de ce nouveau deck dans les données reçues et mise à jour de la variable globale
    idDeck = newDeckResponse.deck_id;
    // mélange du deck
    await shuffleDeck();
}

// éléments HTML pour les évènements et pour la manipulation du DOM
const cardsContainer = document.getElementById("cards-container");

//ajoute une carte dans le DOM (dans la zone des cartes piochées) d'après l'URI de son image
function addCardToDomByImgUri(imgUri){
    //création de l'élément HTML "img", de classe CSS "card et avec pour attribut HTML "src" l'URI reçue en argument
    const imgCardHtmlElement = document.createElement("img");
    imgCardHtmlElement.classList.add("card");
    imgCardHtmlElement.src = imgUri;

    //ajout de cette image dans la zone des cartes piochées (en dernière position, dernier enfant de cardsContainer)
    cardsContainer.append(imgCardHtmlElement);
}

//fonction qui demande à piocher une carte, puis qui fait l'appel pour l'intégrer dans le DOM
async function actionDraw(){
    //appel à l'API pour demander au croupier de piocher une carte et de nous la renvoyer
    const drawCardResponse = await drawCard();

    console.log("drawCardResponse =", drawCardResponse);

    //récupération de l'URI de l'image de cette carte dans les données reçues
    const imgCardUri = drawCardResponse.cards[0].image;

    //ajout de la carte piochée dans la zone des cartes piochées
    addCardToDomByImgUri(imgCardUri);
}

// appel d'initialisation au lancement de l'application
actionReset();

//éléments HTML utiles pour les évènements et pour la manipulation du DOM
const actionResetButton = document.getElementById("action-reset");
const actionDrawButton = document.getElementById("action-draw");

//écoute d'évènement sur le bouttons d'action
actionResetButton.addEventListener("click", actionReset);
actionDrawButton.addEventListener("click", actionDraw);


