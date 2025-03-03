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
    const viewmasterEyes = document.getElementById("viewmasterEyes");
    const activateButton = document.getElementById("imageArrayButton");

    if (viewerImage) {
        const randomImage = images[Math.floor(Math.random() * images.length)];
        viewerImage.src = randomImage;
        viewerImage.style.display = "block";  // Make the image visible

        // Determine where to position the image (above or below the button)
        const isAbove = Math.random() > 0.5; // Randomly decide to place it above or below
        
        if (isAbove) {
            // Move image above viewmaster_eyes
            viewerImage.style.position = "absolute";
            viewerImage.style.top = `${viewmasterEyes.offsetTop - viewerImage.offsetHeight - 10}px`; // Adjusting position above
        } else {
            // Move image below the button
            viewerImage.style.position = "absolute";
            viewerImage.style.top = `${activateButton.offsetTop + activateButton.offsetHeight + 10}px`; // Adjusting position below
        }
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
