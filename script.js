const SUITS = ["C", "D", "H", "S"];
const RANKS = ["2","3","4","5","6","7","8","9","10","J","Q","K","A"];

const startBtn = document.getElementById("startBtn");
const mixBtn = document.getElementById("mixBtn");
const cardCountInput = document.getElementById("cardCount");
const slotsDiv = document.getElementById("slots");
const cardsDiv = document.getElementById("cards");
const statusText = document.getElementById("status");

let correctOrder = [];
let shuffled = [];

startBtn.onclick = startGame;
mixBtn.onclick = mixCards;

function buildDeck() {
    let deck = [];
    for (let r of RANKS) {
        for (let s of SUITS) {
            deck.push(`${r}${s}.png`);
        }
    }
    return deck;
}

function startGame() {
    const deck = buildDeck();
    const count = Number(cardCountInput.value);

    correctOrder = deck.sort(() => Math.random() - 0.5).slice(0, count);

    slotsDiv.innerHTML = "";
    cardsDiv.innerHTML = "";
    statusText.innerText = "";

    // Show correct order briefly
    correctOrder.forEach(() => {
        const slot = document.createElement("div");
        slot.className = "slot";
        slot.ondragover = e => e.preventDefault();
        slot.ondrop = dropCard;
        slotsDiv.appendChild(slot);
    });

    correctOrder.forEach(card => {
        const img = createCard(card);
        slotsDiv.appendChild(img);
    });

    mixBtn.disabled = false;
}

function mixCards() {
    slotsDiv.innerHTML = "";
    cardsDiv.innerHTML = "";

    correctOrder.forEach(() => {
        const slot = document.createElement("div");
        slot.className = "slot";
        slot.ondragover = e => e.preventDefault();
        slot.ondrop = dropCard;
        slotsDiv.appendChild(slot);
    });

    shuffled = [...correctOrder].sort(() => Math.random() - 0.5);

    shuffled.forEach(card => {
        cardsDiv.appendChild(createCard(card));
    });
}

function createCard(cardName) {
    const img = document.createElement("img");
    img.src = `deck/${cardName}`;
    img.className = "card";
    img.draggable = true;
    img.dataset.card = cardName;

    img.ondragstart = e => {
        e.dataTransfer.setData("card", cardName);
        e.dataTransfer.setData("id", img);
        dragged = img;
    };

    return img;
}

function dropCard(e) {
    const cardName = e.dataTransfer.getData("card");
    if (this.children.length === 0) {
        const img = createCard(cardName);
        this.appendChild(img);
        this.classList.add("filled");
        checkResult();
    }
}

function checkResult() {
    const placed = [...slotsDiv.children].map(slot =>
        slot.firstChild ? slot.firstChild.dataset.card : null
    );

    if (placed.every(v => v !== null)) {
        if (placed.join() === correctOrder.join()) {
            statusText.innerText = "✅ Correct Order!";
        } else {
            statusText.innerText = "❌ Wrong Order!";
        }
    }
}
