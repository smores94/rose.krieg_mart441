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

    if (viewerImage) { 
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
    const activateButton = document.getElementById("imageArrayButton");
    const viewmasterEyes = document.getElementById("viewmasterEyes");

    if (!viewfinder || !hand || !textBox || !activateButton || !viewmasterEyes) {
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

    // Fade out background
    document.body.classList.add("fade-background");

    // Show 'viewmaster_eyes' and the button after previous elements fade out
    setTimeout(() => {
        console.log("Displaying viewmaster_eyes and button.");
        viewmasterEyes.style.opacity = "1"; 
        viewmasterEyes.style.display = "block"; 
        activateButton.style.display = "block"; 
    }, 17000);

    // Attach event listener to button
    activateButton.addEventListener("click", showRandomImage);
}

// Start animation when page loads
window.onload = startAnimation;
