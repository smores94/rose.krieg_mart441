// Step 1: Create the arrays
const blankImage = "./imgs/blank.jpg"; // Path to your blank image
const actualImages = [
    "./imgs/alien.jpg", "./imgs/fairy.jpg", "./imgs/mouse.jpg", "./imgs/goddess.jpg",
    "image5.jpg", "image6.jpg", "image7.jpg", "image8.jpg",
    "image9.jpg", "image10.jpg", "image11.jpg", "image12.jpg"
];

// Step 2: Randomize the actual images array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
}

// Duplicate the images to create pairs
const pairedImages = [...actualImages, ...actualImages];
const randomizedImages = shuffleArray(pairedImages);

// Step 3: Create an array of blank images
const blankImagesArray = Array(12).fill(blankImage);

// Step 4: Display the blank images on the screen
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

// Step 5: Add click event listeners to reveal images
function revealImage(event) {
    const clickedCard = event.target;
    const index = clickedCard.dataset.index;

    // Replace the blank image with the actual image
    clickedCard.src = randomizedImages[index];
}

// Attach event listeners to the game board
gameBoard.addEventListener("click", (event) => {
    if (event.target.tagName === "IMG") {
        revealImage(event);
    }
});

// Step 6: Initialize the game
displayBlankImages();