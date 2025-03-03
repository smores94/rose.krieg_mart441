// Array of images for the viewfinder
const images = [
    './Imgs/fist.png', 
    './Imgs/handheart.jpeg', 
    './Imgs/fist.webp', 
    './Imgs/makeasrt.jpeg', 
    './Imgs/redimage.jpeg',
    './Imgs/rose.jpeg'
];

// Function to start the animation
function startAnimation() {
    const viewfinder = document.getElementById("viewfinder");
    const hand = document.getElementById("hand");
    const viewer = document.getElementById("viewer");
    const activateButton = document.querySelector(".activate-button");

    // Hide the text box after a delay
    setTimeout(() => {
        document.querySelector(".text-box").style.display = "none";
    }, 10000); // Hide text box after 3 seconds

    // Trigger animations
    viewfinder.style.animation = "fadeOut 15s ease-out forwards"; // Reduced fade-out time
    hand.style.animation = "grab 15s ease-out forwards"; // Reduced animation time

    // Fade out the background
    document.body.classList.add("fade-background");

    // Show the viewer container after the animation
    setTimeout(() => {
        document.getElementById('scene').classList.add('fade');

        setTimeout(() => {
            // Show the viewer container, image, and button
            document.getElementById('viewer').style.display = 'block';
            document.getElementById('viewer').style.opacity = '1';
            activateButton.style.display = 'block'; // Show the button

            showRandomImage(); // Show first random image
        }, 1000); // Wait 1 second after fade
    }, 5000); // Wait 5 seconds for animations to complete
}

// Function to show a random image in the viewer
function showRandomImage() {
    const randomImage = images[Math.floor(Math.random() * images.length)];
    document.getElementById("viewerImage").src = randomImage;
}

// Start the animation when the page loads
startAnimation();