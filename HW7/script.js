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
        viewerImage.style.display = "block";  // Ensure the image is visible
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

    // Hide the text box after a delay
    setTimeout(() => {
        textBox.style.display = "none";
    }, 16000); // Matches text fade-out duration

    

    // Show 'viewmaster_eyes' and button after the previous elements disappear
    setTimeout(() => {
        console.log("Displaying viewmaster_eyes and button."); // Debugging
        viewmasterEyes.style.opacity = "1";  // Make viewmaster_eyes visible
        viewmasterEyes.style.display = "block"; // Ensure it's visible
        activateButton.style.display = "block";  // Show the button
        console.log("Button and viewmaster eyes are now visible.");
    }, 1000); // Show after the animations are done

    // When button is clicked, show a random image from the array
    activateButton.addEventListener("click", showRandomImage);
}

// Start animation when page loads
startAnimation();
