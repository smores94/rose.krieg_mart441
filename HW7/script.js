setTimeout(() => {
    document.getElementById('scene').classList.add('fade');

    setTimeout(() => {
        document.getElementById('scene').style.display = 'none';
        document.body.style.background = 'black'; // Prevents white screen

        document.getElementById('viewer').style.display = 'block';
        document.querySelector(".new-viewfinder").style.opacity = "1"; // Ensures new viewfinder appears

        showRandomImage(); // Show first random image after scene transition
    }, 2000);
}, 2500);

// Array of images for the viewfinder
const images = [
    './Imgs/fist.png', 
    './Imgs/handheart.jpeg', 
    './Imgs/fist.webp', 
    './Imgs/makeasrt.jpeg', 
    './Imgs/redimage.jpeg',
    './Imgs/rose.jpeg'
];

// script.js

// Function to start the animation
function startAnimation() {
    const viewfinder = document.getElementById("viewfinder");
    const hand = document.getElementById("hand");
    const viewer = document.getElementById("viewer");

    // Hide the text box and button
    document.querySelector(".text-box").style.display = "none";
    document.querySelector(".text-button").style.display = "none";

    // Trigger animations
    viewfinder.style.animation = "fadeOut 12s ease-out forwards";
    hand.style.animation = "grab 12s ease-out forwards";

    // Show the viewer container after the animation
    setTimeout(() => {
        viewer.style.display = "block";
        viewer.style.opacity = "1";
    }, 12000); // 12 seconds
}

// Function to show a random image in the viewer
function showRandomImage() {
    const images = [
        "./Imgs/image1.jpg",
        "./Imgs/image2.jpg",
        "./Imgs/image3.jpg",
        // Add more image paths here
    ];

    const randomImage = images[Math.floor(Math.random() * images.length)];
    document.getElementById("viewerImage").src = randomImage;
}

// Function to show the next image (if needed)
function nextImage() {
    showRandomImage();
}