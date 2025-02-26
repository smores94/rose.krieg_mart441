/* script.js */
setTimeout(() => {
    document.getElementById('scene').classList.add('fade');
    setTimeout(() => {
        document.getElementById('scene').style.display = 'none';
        document.body.style.background = 'none';
        document.getElementById('viewer').style.display = 'block';
        nextImage(); // Show first random image after scene transition
    }, 2000);
}, 2500);


// Array of images for the viewfinder
const images = ['./Imgs/fist.png', './Imgs/handheart.jpeg', './Imgs/fist.webp', './Imgs/makeasrt.jpeg', './Imgs/redimage.jpeg','./Imgs/rose.jpeg'];

function startAnimation() {
    // Hide text and button
    document.querySelector(".text-box").style.display = "none";
    document.querySelector(".text-button").style.display = "none";

    // Start fading out the background
    document.body.style.background = "black";

    // Fade out hand and old viewfinder
    document.querySelector(".hand").classList.add("fade");
    document.querySelector(".viewfinder").classList.add("fade");

    // After animation, fade in new viewfinder
    setTimeout(() => {
        document.querySelector(".new-viewfinder").style.opacity = "1";
        document.querySelector(".viewer-container").style.display = "block";
        document.querySelector(".activate-button").style.display = "block";
    }, 2000);
}

function showRandomImage() {
    let randomIndex = Math.floor(Math.random() * images.length);
    document.getElementById("viewerImage").src = images[randomIndex];
    document.querySelector(".viewer-container").style.opacity = "1";
}
