// Variables
let score = 0;

document.addEventListener("DOMContentLoaded", () => {
let introAnimation = document.getElementById("intro-animation");
let zoomImage = document.getElementById("zoom-image");

function hideIntro() {
console.log("Animation ended, hiding intro screen...");

// Fade out the intro animation
introAnimation.style.opacity = "0";


// Apply background and show content
document.body.classList.add("background-active");
document.querySelector("h1").style.display = "block";
document.getElementById("story").style.display = "block";


// Remove the intro animation from the DOM after the fade-out
setTimeout(hideIntro, 6000); // Fallback after 6 seconds

setTimeout(() => {
    console.log("Removing intro animation from the DOM...");
    introAnimation.remove(); // This removes the element entirely
}, 1000); // Wait for the fade-out to complete
}

if (zoomImage) {
// Listen for the end of the animation
zoomImage.addEventListener("animationend", hideIntro);

// Fallback in case the animationend event doesn't fire
setTimeout(hideIntro, 9000); // Fallback after 4 seconds
}
});





// Function to handle user choices
function choose(option) {
    const storyDiv = document.getElementById('story');
    let content = "";

 function handleInput() {
    let option = document.getElementById('user-input').value;
    let storyDiv = document.getElementById('story');
    let content = '';

    if (option === '1') {
        content = `
            <p>As you open the tome, glowing symbols appear. A potion recipe catches your eye. Will you brew it or seek a different path?</p>
            <p>1. Brew the Potion</p>
            <p>2. Explore the Workshop</p>
            <input type="text" id="user-input" placeholder="Enter your choice (1 or 2)">
            <button onclick="handleInput()">Submit</button>
            <img src="./imgs/corpushermetic.jpg" alt="Alchemy book">
        `;
    } else if (option === '2') {
        content = `
            <p>Exploring the workshop, you discover a hidden compartment with blueprints for an airship. Adventure awaits!</p>
            <p>1. Build the airship</p>
            <p>2. Sell the blueprints for gold</p>
            <input type="text" id="user-input" placeholder="Enter your choice (1 or 2)">
            <button onclick="handleInput()">Submit</button>
            <img src="./imgs/airship.jpg" alt="Steampunk airship">
        `;
    } else if (storyDiv.innerHTML.includes("Brew the Potion")) {
        content = `
            <p>You brew a shimmering elixir. Drinking it, you gain the ability to see into the future! What will you do with this power?</p>
            <p>1. Use your vision to predict events</p>
            <p>2. Attempt to alter fate</p>
            <input type="text" id="user-input" placeholder="Enter your choice (1 or 2)">
            <button onclick="handleInput()">Submit</button>
            <img src="./imgs/potion.png" alt="Magic potion">
        `;
    } else if (storyDiv.innerHTML.includes("Use your vision to predict events")) {
        content = `
            <p>You predict the future, becoming wealthy beyond all your dreams.
            You are famous, loved, but always a feeling of fear surrounds you.</p>
            <img src="./imgs/family.png" alt="Family">
            <button onclick="restart()">Restart</button>
        `;
    } else if (storyDiv.innerHTML.includes("Attempt to alter fate")) {
        content = `
            <p>Your Great-Grandparents were immigrants to Quebec, and always talked about the glory of France. You decide to try and stop the French Revolution. <br><br>
            But oh no...Without the revolution, King Louis XVI, Marie Antoinette, their descendants and the French Monarchy continue to the present day. The French Monarchy helped England instead of the fledgling United States. The Louisiana Purchase never happened. Your Great-grandparents never immigrated.
            <br><br>You see your hand fading in front of you.....as you cease to exist.</p>
            <img src="./imgs/fadinghands.png" alt="hands in workshop">
            <button onclick="restart()">Restart</button>
        `;
    } else {
        content = `<p>Invalid choice. Please try again.</p>`;
    }

    // Update the story content
    storyDiv.innerHTML = content;
}

// Restart Function
function restart() {
    score = 0; // Reset score
    startStory();
}