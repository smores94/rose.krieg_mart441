let health = 100; // Track the player's health
let treasure = 0; // Track the treasure collected

// Play background music when the page loads
const bgMusic = document.getElementById("background-music");
const playMusicBtn = document.getElementById("play-music-btn");

if (bgMusic && playMusicBtn) {
    playMusicBtn.addEventListener("click", () => {
        console.log("Play button clicked. Attempting to play music...");
        bgMusic.play()
            .then(() => {
                console.log("Music is playing.");
                playMusicBtn.style.display = "none"; // Hide the button after clicking
            })
            .catch((error) => {
                console.error("Error playing music:", error);
            });
    });
} else {
    console.error("Audio element or play button not found.");
}

// Rest of your JavaScript code...
function choose(option) {
    const storyDiv = document.getElementById('story');
    let content = "";

    if (option === 'path') {
        health -= 20; // Lose health due to jungle hazards
        content = `
            <p>You follow the narrow path, battling through thick vines and swarms of insects. You lose 20 health but find a mysterious map leading deeper into the jungle.</p>
            <button onclick="choose('map')">Follow the Map</button>
            <img src="./imgs/map.jpg" alt="map">      
            <button onclick="choose('back')">Go Back</button>
            <img src="./imgs/path.jpg" alt="Jungle Path">
        `;
    } else if (option === 'river') {
        health += 10; // Restore health by drinking from the river
        content = `
            <p>You head towards the river, where you find fresh water and a small boat. You restore 10 health. Do you take the boat or continue on foot?</p>
            <button onclick="choose('boat')">Take the Boat</button>
            <img src="./imgs/boat.jpg" alt="boat">
            <button onclick="choose('foot')">Continue on Foot</button>
            <img src="./imgs/river.jpg" alt="River">
        `;
    } else if (option === 'camp') {
        content = `
            <p>You set up camp for the night. As you rest, you hear strange noises in the jungle. Do you investigate or stay in your tent?</p>
            <button onclick="choose('investigate')">Investigate</button>
            <button onclick="choose('stay')">Stay in Tent</button>
            <img src="./imgs/camp.jpg" alt="Camp">
        `;
    } else if (option === 'map') {
        treasure += 50; // Find treasure
        content = `
            <p>Following the map, you discover a hidden chamber filled with gold and jewels! You gain 50 treasure.</p>
            <button onclick="restart()">Restart Adventure</button>
            <img src="./imgs/chamber.jpg" alt="Treasure">
        `;
    } else if (option === 'boat') {
        content = `
            <p>You take the boat down the river and arrive at the temple entrance. The doors are sealed with ancient runes. Do you try to decipher them or look for another way in?</p>
            <button onclick="choose('decipher')">Decipher the Runes</button>
            <button onclick="choose('search')">Search for Another Entrance</button>
            <img src="./imgs/temple.jpg" alt="Temple">
        `;
    } else if (option === 'investigate') {
        health -= 30; // Lose health to a jungle predator
        content = `
            <p>You investigate the noises and are attacked by a jungle predator! You lose 30