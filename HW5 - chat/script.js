// Step 1: Create the arrays
const blankImage = "./imgs/blank.jpg"; // Path to blank image
const actualImages = [
    "./imgs/alien.jpg", "./imgs/fairy.jpg", "./imgs/mouse.jpg", "./imgs/goddess.jpg",
    "./imgs/bar.jpg" // Add 5 unique images
];

// Step 2: Randomize the actual images array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
}

// Duplicate the images to create pairs (10 images total)
let pairedImages = [...actualImages, ...actualImages]; // Use `let` instead of `const`
let randomizedImages = shuffleArray(pairedImages); // Use `let` instead of `const`

// Step 3: Create an array of blank images (10 blank images)
const blankImagesArray = Array(10).fill(blankImage);

// Step 4: Variables to track game state
let firstCard = null; // Track the first card clicked
let secondCard = null; // Track the second card clicked
let attempts = 0; // Track the number of attempts
let matchedPairs = 0; // Track the number of matched pairs
const totalPairs = actualImages.length; // Total pairs to match

// Step 5: Display the blank images on the screen
const gameBoard = document.getElementById("game-board");

function displayBlankImages() {
    gameBoard.innerHTML = ""; // Clear the board
    blankImagesArray.forEach((image, index) => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `<img src="${image}" alt="Blank" data-index="${index}">`;
        gameBoard.appendChild(card);
    });
}

// Step 6: Add click event listeners to reveal images
function revealImage(event) {
    const clickedCard = event.target;
    const index = clickedCard.dataset.index;

    // Ignore clicks on already matched cards or the same card
    if (clickedCard.src.includes(blankImage) || clickedCard === firstCard) {
        return;
    }

    // Replace the blank image with the actual image
    clickedCard.src = randomizedImages[index];

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
    if (firstCard.src === secondCard.src) {
        // Match found
        matchedPairs++;
        firstCard.removeEventListener("click", revealImage); // Disable further clicks
        secondCard.removeEventListener("click", revealImage); // Disable further clicks
        resetSelection();

        // Check if all pairs are matched
        if (matchedPairs === totalPairs) {
            endGame();
        }
    } else {
        // No match, hide the images after a delay
        setTimeout(() => {
            firstCard.src = blankImage;
            secondCard.src = blankImage;
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
    // Store the number of attempts in localStorage or a query string
    localStorage.setItem("attempts", attempts);
    window.location.href = "summary.html"; // Redirect to the summary page
}

// Step 10: Reset the game
function resetGame() {
    // Reshuffle the images
    pairedImages = [...actualImages, ...actualImages];
    randomizedImages = shuffleArray(pairedImages);

    // Reset game state
    firstCard = null;
    secondCard = null;
    attempts = 0;
    matchedPairs = 0;

    // Reset the board to display blank images
    displayBlankImages();
}

// Step 11: Attach event listeners
gameBoard.addEventListener("click", (event) => {
    if (event.target.tagName === "IMG") {
        revealImage(event);
    }
});

const resetButton = document.getElementById("reset-button");
resetButton.addEventListener("click", resetGame);

// Step 12: Initialize the game
displayBlankImages();