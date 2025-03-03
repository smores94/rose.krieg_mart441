// Array of images for the viewer
const images = [
    './Imgs/fist.png', 
    './Imgs/handheart.jpeg', 
    './Imgs/fist.webp', 
    './Imgs/makeasrt.jpeg', 
    './Imgs/redimage.jpeg',
    './Imgs/rose.jpeg'
];
function showRandomImage() {
    const viewerImage = document.getElementById("viewerImage");

    if (viewerImage) { // Check if viewerImage exists before setting src
        const randomImage = images[Math.floor(Math.random() * images.length)];
        viewerImage.src = randomImage;
    } else {
        console.error("Error: viewerImage element not found!");
    }
}

function startAnimation() {
    const viewfinder = document.getElementById("viewfinder");
    const hand = document.getElementById("hand");
    const textBox = document.querySelector(".text-box");
    const viewer = document.getElementById("viewer");
    const activateButton = document.getElementById("imageArrayButton");
    const viewmasterEyes = document.getElementById("viewmasterEyes");

    // Hide the text box after a delay
    setTimeout(() => {
        textBox.style.display = "none";
    }, 16000); // Matches text fade-out duration

    // Start animations
    viewfinder.style.animation = "fadeOut 14s ease-out forwards";
    hand.style.animation = "grab 15s ease-out forwards";

    // Fade out background
    document.body.classList.add("fade-background");

    // Show 'viewmaster_eyes' after the other elements fade out
    setTimeout(() => {
        viewmasterEyes.style.opacity = "1";
        activateButton.style.display = "block"; // Show the button
    }, 17000); // Slight delay after previous elements fade out

    // When button is clicked, show a random image from the array
    activateButton.addEventListener("click", showRandomImage);
}

function showRandomImage() {
    const randomImage = images[Math.floor(Math.random() * images.length)];
    document.getElementById("viewerImage").src = randomImage;
}

// Start animation when page loads
startAnimation();
