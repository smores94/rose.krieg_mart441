// Step 1: Define the colors for the game
const colors = [
    "red", "blue", "green", "yellow", "purple" // 5 unique colors
];

// Step 2: Duplicate the colors to create pairs
let colorPairs = [...colors, ...colors]; // 10 colors (5 pairs)

// Step 3: Shuffle the colors
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
}

let shuffledColors = shuffleArray(colorPairs);

// Step 4: Variables to track game state
let firstCard = null; // Track the first card clicked
let secondCard = null; // Track the second card clicked
let attempts = 0; // Track the number of attempts
let matchedPairs = 0; // Track the number of matched pairs
const totalPairs = colors.length; // Total pairs to match

// Step 5: Display the cards on the screen
const gameBoard = document.getElementById("game-board");

function displayCards() {
    gameBoard.innerHTML = ""; // Clear the board
    shuffledColors.forEach((color, index) => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.color = color; // Store the color in a data attribute
        card.dataset.index = index; // Store the index for identification
        gameBoard.appendChild(card);
    });
}

// Step 6: Add click event listeners to reveal colors
function revealColor(event) {
    const clickedCard = event.target;

    // Ignore clicks on already revealed cards or the same card
    if (clickedCard.classList.contains("revealed") || clickedCard === firstCard) {
        return;
    }

    // Reveal the color of the clicked card
    clickedCard.style.backgroundColor = clickedCard.dataset.color;
    clickedCard.classList.add("revealed");

    // Track the first and second card clicked
    if (!firstCard) {
        firstCard = clickedCard;
    } else {
        secondCard = clickedCard;
        attempts++; // Increment attempts after the second card is clicked
        checkForMatch();
    }
}

// Step 7: Check if the two selected cards match
function checkForMatch() {
    if (firstCard.dataset.color === secondCard.dataset.color) {
        // Match found
        matchedPairs++;
        resetSelection();

        // Check if all pairs are matched
        if (matchedPairs === totalPairs) {
            endGame();
        }
    } else {
        // No match, hide the colors after a delay
        setTimeout(() => {
            firstCard.style.backgroundColor = "#ccc";
            secondCard.style.backgroundColor = "#ccc";
            firstCard.classList.remove("revealed");
            secondCard.classList.remove("revealed");
            resetSelection();
        }, 1000); // 1-second delay
    }
}

// Step 8: Reset the selection after each attempt
function resetSelection() {
    firstCard = null;
    secondCard = null;
}

// Step 9: End the game and redirect to the summary page
function endGame() {
    // Store the number of attempts in localStorage
    localStorage.setItem("attempts", attempts);
    window.location.href = "summary.html"; // Redirect to the summary page
}

// Step 10: Reset the game
function resetGame() {
    // Reshuffle the colors
    shuffledColors = shuffleArray([...colors, ...colors]);

    // Reset game state
    firstCard = null;
    secondCard = null;
    attempts = 0;
    matchedPairs = 0;

    // Reset the board to display blank cards
    displayCards();
}

// Step 11: Attach event listeners
gameBoard.addEventListener("click", (event) => {
    if (event.target.classList.contains("card")) {
        revealColor(event);
    }
});

const resetButton = document.getElementById("reset-button");
resetButton.addEventListener("click", resetGame);

// Step 12: Initialize the game
displayCards();