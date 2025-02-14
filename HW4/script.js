// Variables
let score = 0; // Optional: Track score if needed

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




function handleInput() {
    const option = document.getElementById('user-input').value;
    const storyDiv = document.getElementById('story');
    let content = '';

    // Handle initial and subsequent choices
    if (option === '1' && !storyDiv.innerHTML.includes("Brew the Potion")) {
        content = `
            <p>As you open the tome, glowing symbols appear. A potion recipe catches your eye. Will you brew it or seek a different path?</p>
            <p>1. Brew the Potion</p>
            <p>2. Explore the Workshop</p>
            <input type="text" id="user-input" placeholder="Enter your choice (1 or 2)">
            <button onclick="handleInput()">Submit</button>
            <img src="./imgs/corpushermetic.jpg" alt="Alchemy book">
        `;
    } else if (option === '1' && storyDiv.innerHTML.includes("Brew the Potion")) {
        content = `
            <p>You brew a shimmering elixir. Drinking it, you gain the ability to see into the future! What will you do with this power?</p>
            <p>1. Use your vision to predict events</p>
            <p>2. Attempt to alter fate</p>
            <input type="text" id="user-input" placeholder="Enter your choice (1 or 2)">
            <button onclick="handleInput()">Submit</button>
            <img src="./imgs/potion.png" alt="Magic potion">
        `;
    } else if (option === '2' && !storyDiv.innerHTML.includes("Explore the Workshop")) {
        content = `
            <p>Exploring the workshop, you discover a hidden compartment with blueprints for an airship. Adventure awaits!</p>
            <p>1. Build the airship</p>
            <p>2. Sell the blueprints for gold</p>
            <input type="text" id="user-input" placeholder="Enter your choice (1 or 2)">
            <button onclick="handleInput()">Submit</button>
            <img src="./imgs/airship.jpg" alt="Steampunk airship">
        `;
    } else if (option === '2' && storyDiv.innerHTML.includes("Explore the Workshop")) {
        content = `
            <p>You activate the time device! A vortex opens, offering two choices: Victorian London or a futuristic steampunk city.</p>
            <p>1. Travel to Victorian London</p>
            <p>2. Enter the Steampunk Metropolis</p>
            <input type="text" id="user-input" placeholder="Enter your choice (1 or 2)">
            <button onclick="handleInput()">Submit</button>
            <img src="./imgs/antikythera.png" alt="Time device">
        `;
    } else if (storyDiv.innerHTML.includes("Use your vision to predict events")) {
        content = `
            <p>You predict the future, becoming wealthy beyond all your dreams. You are famous, loved, but always a feeling of fear surrounds you.</p>
            <img src="./imgs/family.png" alt="Family">
            <button onclick="restart()">Restart</button>
        `;
    } else if (storyDiv.innerHTML.includes("Attempt to alter fate")) {
        content = `
            <p>Your Great-Grandparents were immigrants to Quebec, and always talked about the glory of France. You decide to try and stop the French Revolution. <br><br>
            But oh no...Without the revolution, King Louis XVI, Marie Antoinette, their descendants and the French Monarchy continue to the present day. The French Monarchy helped England instead of the fledgling United States. The Louisiana Purchase never happened. Your Great-grandparents never immigrated.
            <br><br>You see your hand fading in front of you.....as you cease to exist.</p>
            <img src="./imgs/fadinghands.png" alt="Hands fading">
            <button onclick="restart()">Restart</button>
        `;
    } else if (storyDiv.innerHTML.includes("Travel to Victorian London")) {
        content = `
            <p>You arrive in Victorian London, where secret societies seek alchemical knowledge. Will you join them or oppose them?</p>
            <p>1. Join the secret society</p>
            <p>2. Oppose them and uncover their secrets</p>
            <input type="text" id="user-input" placeholder="Enter your choice (1 or 2)">
            <button onclick="handleInput()">Submit</button>
            <img src="./imgs/victlondstmpnk.jpg" alt="Victorian London">
        `;
    } else if (storyDiv.innerHTML.includes("Join the secret society")) {
        content = `
            <p>The Invitation
London, 1887.

The air is thick with soot and secrecy, the gas lamps flickering in defiance of the smog. You tread carefully through the damp alleyways, your boots echoing against cobblestone streets slick with evening mist. The letter in your coat pocket is sealed with black wax, stamped with an insignia you do not recognize—a serpent entwined with a dagger. It had arrived without explanation, slipped under your door as if by ghostly hands.
You reach the unmarked door as instructed. A single knock. A pause.
Then, it creaks open just enough to reveal the glint of watchful eyes. No words are spoken. You step inside.
The room beyond is dimly lit by candelabras dripping wax like blood. Hooded figures stand in a circle, their faces obscured, their eyes burning through the shadows. The scent of old books, ink, and something metallic—like rust or dried blood—lingers in the air.
A man steps forward. His voice is velvet over steel.
"You stand at the threshold of something far greater than yourself. The world outside is blind, shackled by ignorance. But we... we see beyond the veil. We unearth truths long buried. We shape the fate of nations from the darkness in which we dwell."
He gestures to a table draped in crimson cloth. Upon it, a quill and a ledger, its pages aged and yellowed. Names fill its lines—some crossed out, others stained, perhaps with ink… or something else.
"One mark, and you are bound to us. No king, no parliament, no god shall own you. Only the pursuit of power, knowledge, and the unseen forces that weave the fabric of this world. But beware—once the ink dries, there is no turning back."
The candlelight wavers. The air grows heavy. Behind you, the door has closed.</p>
            <p>1. Lift the veil</p>
            <p>2. You change your mind. You are a person of reason. This makes no sense you realize.</p>
            <input type="text" id="user-input" placeholder="Enter your choice (1 or 2)">
            <button onclick="handleInput()">Submit</button>
            <img src="./imgs/letter.jpg" alt="The Invitation">
        `;
    } else if (storyDiv.innerHTML.includes("Lift the veil")) {
        content = `
            <p>You take a deep breath, feeling the weight of the moment. With a steady hand, you dip the quill into the ink and sign your name in the ledger.
The hooded figures murmur in approval, their voices a low, harmonious chant. The man smiles, a glint of satisfaction in his eyes.
"Welcome," he says, "to the Order of the Serpent. Your journey into the arcane begins now."
As the ink dries, you feel a strange warmth spread through your body, as if ancient knowledge is being etched into your very soul. The room seems to shift, the shadows deepening, and you realize that you have crossed a threshold into a world hidden from ordinary sight.</p>
            <img src="./imgs/cult.jpg" alt="The Society">
            <button onclick="restart()">Restart</button>
        `;
    } else if (storyDiv.innerHTML.includes("You change your mind. You are a person of reason. This makes no sense you realize.")) {
        content = `
            <p>You step back, shaking your head. "I cannot," you say, your voice firm despite the tremor in your heart. The man's smile fades, replaced by a look of cold disappointment.
"Very well," he replies, his tone icy. "But know this: once you leave, you can never return." The hooded figures part, creating a path to the door. As you turn to leave, the air grows colder, and the shadows seem to reach out, as if reluctant to let you go.
You step outside, the door closing behind you with a final, echoing thud. The alleyway feels darker, the mist thicker, and you can't shake the feeling that you have just walked away from a destiny that will forever remain a mystery.
Aghhhh! Your stomach cramps, your heart pounds, your vision begins to go black...</p>
            <img src="./imgs/walkingaway.jpg" alt="Walkaway">
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

// Start the story
function startStory() {
    const storyDiv = document.getElementById('story');
    storyDiv.innerHTML = `
        <p>Welcome to the world of alchemy and adventure! What will you do?</p>
        <p>1. Open the ancient tome</p>
        <p>2. Explore the workshop</p>
        <input type="text" id="user-input" placeholder="Enter your choice (1 or 2)">
        <button onclick="handleInput()">Submit</button>
    `;
}

// Initialize the story
startStory();

    // Update the story content
    storyDiv.innerHTML = content;


// Restart Function
function restart() {
    score = 0; // Reset score
    startStory();
}