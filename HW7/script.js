/* script.js */
setTimeout(() => {
    document.getElementById('scene').classList.add('fade');
    setTimeout(() => {
        document.getElementById('scene').style.display = 'none';
        document.getElementById('viewer').style.display = 'block';
    }, 2000);
}, 2500);

let images = ['image1.jpg', 'image2.jpg', 'image3.jpg', 'image4.jpg', 'image5.jpg'];
function nextImage() {
    let randomIndex = Math.floor(Math.random() * images.length);
    document.getElementById('viewerImage').src = images[randomIndex];
}