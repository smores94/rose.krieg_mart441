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

let images = ['./Imgs/fist.png', './Imgs/handheart.jpeg', './Imgs/fist.webp', './Imgs/makeasrt.jpeg', './Imgs/redimage.jpeg','./Imgs/rose.jpeg'];
function nextImage() {
    let randomIndex = Math.floor(Math.random() * images.length);
    document.getElementById('viewerImage').src = images[randomIndex];
}