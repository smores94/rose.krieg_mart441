// Array of images for the viewer
const images = [
    'Imgs/fist.png', 
    'Imgs/handheart.jpeg', 
    'Imgs/fist.webp', 
    'Imgs/makeasrt.jpeg', 
    'Imgs/redimage.jpeg',
    'Imgs/rose.jpeg'
];

let currentIndex = 0; // Track current image index

function showNextImage() {
    const viewerImage = document.getElementById("viewerImage");

    if (viewerImage) { 
        currentIndex = (currentIndex + 1) % images.length; // Loop through images
        viewerImage.src = images[currentIndex];
    } else {
        console.error("Error: viewerImage element not found!");
    }
}

function startAnimation() {
    const viewfinder = document.getElementById("viewfinder");
    const hand = document.getElementById("hand");
    const textBox = document.querySelector(".text-box");
    const activateButton = document.getElementById("imageArrayButton");
    const background = document.body; // Target entire background

    // Ensure elements exist before proceeding
    if (!viewfinder || !hand || !textBox || !activateButton) {
        console.error("Error: One or more elements not found!");
        return;
    }

    // Hide the text box after a delay
    setTimeout(() => {
        textBox.style.display = "none";
    }, 16000);

    // Start animations
    viewfinder.style.animation = "fadeOut 14s ease-out forwards";
    hand.style.animation = "grab 15s ease-out forwards";

    // Remove background after animations
    setTimeout(() => {
        bac

