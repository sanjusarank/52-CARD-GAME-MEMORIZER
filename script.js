const SUITS = ["C", "D", "H", "S"];
const RANKS = ["2","3","4","5","6","7","8","9","10","J","Q","K","A"];

const orderModeBtn = document.getElementById("orderModeBtn");
const pairModeBtn = document.getElementById("pairModeBtn");
const orderControls = document.getElementById("orderControls");
const pairControls = document.getElementById("pairControls");
const startOrderBtn = document.getElementById("startOrderBtn");
const mixOrderBtn = document.getElementById("mixOrderBtn");
const orderCountInput = document.getElementById("orderCount");

const slotsDiv = document.getElementById("slots");
const gameDiv = document.getElementById("game");
const statusText = document.getElementById("status");
const sectionTitle = document.getElementById("sectionTitle");

let correctOrder = [];
let firstCard = null;
let lockBoard = false;
let matchedPairs = 0;

/* ---------- COMMON ---------- */
function buildDeck() {
    let deck = [];
    for (let r of RANKS) {
        for (let s of SUITS) {
            deck.push(`${r}${s}.png`);
        }
    }
    return deck;
}

function shuffle(arr) {
    return arr.sort(() => Math.random() - 0.5);
}

/* ---------- MODE SWITCH ---------- */
orderModeBtn.onclick = () => {
    resetUI();
    orderControls.classList.remove("hidden");
    sectionTitle.innerText = "Order Memory";
};

pairModeBtn.onclick = () => {
    resetUI();
    pairControls.classList.remove("hidden");
    sectionTitle.innerText = "Pair Memory";
};

function resetUI() {
    orderControls.classList.add("hidden");
    pairControls.classList.add("hidden");
    slotsDiv.innerHTML = "";
    gameDiv.innerHTML = "";
    statusText.innerText = "";
    mixOrderBtn.disabled = true;
}

/* ---------- ORDER MEMORY ---------- */
startOrderBtn.onclick = () => {
    const count = Number(orderCountInput.value);
    const deck = shuffle(buildDeck());

    correctOrder = deck.slice(0, count);
    slotsDiv.innerHTML = "";
    gameDiv.innerHTML = "";
    statusText.innerText = "Memorize the order";

    correctOrder.forEach(card => {
        const img = document.createElement("img");
        img.src = `deck/${card}`;
        img.className = "card";
        gameDiv.appendChild(img);
    });

    mixOrderBtn.disabled = false;
};

mixOrderBtn.onclick = () => {
    slotsDiv.innerHTML = "";
    gameDiv.innerHTML = "";
    statusText.innerText = "Drag cards into correct order";

    correctOrder.forEach(() => {
        const slot = document.createElement("div");
        slot.className = "slot";
        slot.ondragover = e => e.preventDefault();
        slot.ondrop = dropCard;
        slotsDiv.appendChild(slot);
    });

    shuffle([...correctOrder]).forEach(card => {
        gameDiv.appendChild(createDraggableCard(card));
    });
};

function createDraggableCard(card) {
    const img = document.createElement("img");
    img.src = `deck/${card}`;
    img.className = "card";
    img.draggable = true;
    img.dataset.card = card;

    img.ondragstart = e => {
        e.dataTransfer.setData("card", card);
    };

    return img;
}

function dropCard(e) {
    const card = e.dataTransfer.getData("card");
    if (!this.firstChild) {
        this.appendChild(createDraggableCard(card));
        checkOrder();
    }
}

function checkOrder() {
    const placed = [...slotsDiv.children].map(
        s => s.firstChild?.dataset.card
    );

    if (placed.every(Boolean)) {
        statusText.innerText =
            placed.join() === correctOrder.join()
                ? "✅ Correct Order!"
                : "❌ Wrong Order!";
    }
}

/* ---------- PAIR MEMORY ---------- */
document.querySelectorAll("#pairControls button").forEach(btn => {
    btn.onclick = () => startPairMode(Number(btn.dataset.count));
});

function startPairMode(totalCards) {
    gameDiv.innerHTML = "";
    slotsDiv.innerHTML = "";
    statusText.innerText = "";
    firstCard = null;
    lockBoard = false;
    matchedPairs = 0;

    const deck = shuffle(buildDeck()).slice(0, totalCards / 2);
    const pairs = shuffle([...deck, ...deck]);

    pairs.forEach(card => {
        const img = document.createElement("img");
        img.src = "deck/back.png";
        img.className = "card";
        img.dataset.card = card;
        img.onclick = () => flipCard(img);
        gameDiv.appendChild(img);
    });
}

function flipCard(card) {
    if (lockBoard || card === firstCard) return;

    card.src = `deck/${card.dataset.card}`;

    if (!firstCard) {
        firstCard = card;
        return;
    }

    if (firstCard.dataset.card === card.dataset.card) {
        firstCard.onclick = null;
        card.onclick = null;
        firstCard = null;
        matchedPairs++;

        if (matchedPairs * 2 === gameDiv.children.length) {
            statusText.innerText = "🎉 All pairs matched!";
        }
    } else {
        lockBoard = true;
        setTimeout(() => {
            firstCard.src = "deck/back.png";
            card.src = "deck/back.png";
            firstCard = null;
            lockBoard = false;
        }, 700);
    }
}
