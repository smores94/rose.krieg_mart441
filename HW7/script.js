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
    }, 5000); // Hide text box after 5 seconds

    // Trigger animations
    viewfinder.style.animation = "fadeOut 12s ease-out forwards";
    hand.style.animation = "grab 12s ease-out forwards";

    // Show the viewer container after the animation
    setTimeout(() => {
        document.getElementById('scene').classList.add('fade');

        setTimeout(() => {
            document.getElementById('scene').style.display = 'none';
            document.body.style.background = 'black'; // Prevents white screen

            // Show the viewer container, image, and button
            document.getElementById('viewer').style.display = 'block';
            document.getElementById('viewer').style.opacity = '1';
            activateButton.style.display = 'block'; // Show the button

            showRandomImage(); // Show first random image
        }, 2000); // Wait 2 seconds after fade
    }, 12000); // Wait 12 seconds for animations to complete
}

// Function to show a random image in the viewer
function showRandomImage() {
    const randomImage = images[Math.floor(Math.random() * images.length)];
    document.getElementById("viewerImage").src = randomImage;
}

// Start the animation when the page loads
startAnimation();