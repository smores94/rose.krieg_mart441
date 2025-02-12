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



// Function to handle user input
function handleInput() {
    const userInput = document.getElementById('user-input').value.trim().toLowerCase();
    let option = userInput; // Use the raw input for nested choices
    
 // Map initial choices to options
 if (document.getElementById('story').innerHTML.includes("What do you do?")) {
    switch (userInput) {
        case '1':
            option = 'book';
            break;
        case '2':
            option = 'device';
            break;
        case '3':
            option = 'wait';
            break;
        default:
            alert("Invalid choice. Please enter 1, 2, or 3.");
            return;
    }
}

// Call the choose function with the selected option
choose(option);
}

// Function to handle user choices
function choose(option) {
const storyDiv = document.getElementById('story');
let content = "";

     // Check the current state of the story to determine the next step
     if (storyDiv.innerHTML.includes("What do you do?")) {
        // Initial choice
        if (option === 'book') {
            score += 10;
            content = `
                <p>As you open the tome, glowing symbols appear. A potion recipe catches your eye. Will you brew it or seek a different path?</p>
                <p>1. Brew the Potion</p>
                <p>2. Explore the Workshop</p>
                <p>3. what</p>
                <input type="text" id="user-input" placeholder="Enter your choice (1, 2 or 3)">
                <button onclick="handleInput()">Submit</button>
       <img src="./imgs/corpushermetic.jpg" alt="Alchemy book">
        `;

              } else if (storyDiv.innerHTML.includes("Brew the Potion")) {
        // Second-level choice after choosing 'book'
        if (option === '1') {
            content = `
                <p>You brew a shimmering elixir. Drinking it, you gain the ability to see into the future! What will you do with this power?</p>
                <p>1. Use your vision to predict events</p>
                <p>2. Attempt to alter fate</p>
                <input type="text" id="user-input" placeholder="Enter your choice (1 or 2)">
                <button onclick="handleInput()">Submit</button>
                <img src="./imgs/potion.png" alt="Magic potion">
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
        }
    } else if (storyDiv.innerHTML.includes("Use your vision to predict events")) {
        // Final outcome for predicting events
        content = `
            <p>You predict the future, becoming wealthy beyond all your dreams.
            You are famous, loved, but always a feeling of fear surrounds you.</p>
            <img src="./imgs/family.png" alt="Family">
            <button onclick="restart()">Restart</button>
         `;
    } else if (storyDiv.innerHTML.includes("Attempt to alter fate")) {
        // Final outcome for altering fate
        content = `
            <p>Your Great-Grandparents were immigrants to Quebec, and always talked about the glory of France. You decide to try and stop the French Revolution. <br><br>
            But oh no...Without the revolution, King Louis XVI, Marie Antoinette, their descendants and the French Monarchy continue to the present day. The French Monarchy helped England instead of the fledgling United States. The Louisiana Purchase never happened. Your Great-grandparents never immigrated.
            <br><br>You see your hand fading in front of you.....as you cease to exist.</p>
            <img src="./imgs/fadinghands.png" alt="hands in workshop">
            <button onclick="restart()">Restart</button>
        `;
        } else if (option === 'device') {
            score += 20;
            content = `
                <p>You activate the time device! A vortex opens, offering two choices: Victorian London or a futuristic steampunk city.</p>
                <p>1. Travel to Victorian London</p>
                <p>2. Enter the Steampunk Metropolis</p>
                <input type="text" id="user-input" placeholder="Enter your choice (1 or 2)">
                <button onclick="handleInput()">Submit</button>
                <img src="./imgs/antikythera.png" alt="time device">
            `;
 // Second-level choice after choosing 'device
         } else if (storyDiv.innerHTML.includes("Travel to Victorian London")) {
                if (option === '1') {
                    content = `
                        <p>You arrive in Victorian London, where secret societies seek alchemical knowledge. Will you join them or oppose them?</p>
                        <p>1. Join the secret society</p>
                        <p>2. Oppose them and uncover their secrets</p>
                        <input type="text" id="user-input" placeholder="Enter your choice (1 or 2)">
                        <button onclick="handleInput()">Submit</button>
                        <img src="./imgs/victlondstmpnk.jpg" alt="Victorian London">
                    `;
                }

            } else if (storyDiv.innerHTML.includes("Enter the Steampunk Metropolis")) {
                if (option === '1') {
                    content = `
                        <p>The metropolis is alive with steam-powered automatons and airships. A masked figure offers you a mission. Do you accept?</p>
                        <p>1. Accept the mission</p>
                        <p>2. Decline and explore the city</p>
                        <input type="text" id="user-input" placeholder="Enter your choice (1 or 2)">
                        <button onclick="handleInput()">Submit</button>
                        <img src="./imgs/maskedman.jpg" alt="Steampunk city">
                    `;
// Second-level choice after choosing 'device
} else if (storyDiv.innerHTML.includes("Accept the mission")) {
    if (option === '1') {
        content = `
            <p>You nod, curiosity and excitement bubbling within you. The masked figure's eyes gleam with approval as he hands you a brass key, intricately designed with gears and cogs. "This key," he whispers, "unlocks the heart of the city. You must find the Clockwork Cathedral and retrieve the Chrono Crystal before the clock strikes midnight."
With a flourish of his cloak, he vanishes into the steam-filled night. You set off, navigating the bustling streets filled with steam-powered carriages and towering airships. Automatons tip their hats as you pass, their gears whirring in polite acknowledgment. The city pulses with life, a symphony of hissing steam and clanking metal.
Reaching the Clockwork Cathedral, you insert the key into a hidden lock. The massive doors creak open, revealing a labyrinth of gears and pistons. You race against time, dodging mechanical guardians and solving intricate puzzles. Finally, you reach the altar, where the Chrono Crystal glows with an ethereal light. As you grasp it, the city seems to hold its breath, waiting for the dawn of a new era.</p>
            <p>1. The Crystal Glows Dark</p>
            <p>2. The Crystal Glows Golden</p>
            <input type="text" id="user-input" placeholder="Enter your choice (1 or 2)">
            <button onclick="handleInput()">Submit</button>
            <img src="./imgs/clockworkcrystal.jpg" alt="clockwork crystal">
        `;
    }
    // final-level choice after choosing 'device
} else if (storyDiv.innerHTML.includes("The Crystal Glows Dark")) {
    if (option === '1') {
        content = `
            <p>As your fingers close around the Chrono Crystal, a deafening silence falls over the cathedral. The gears grind to a halt, and the air grows heavy with an unnatural stillness. The crystal pulses with a cold, eerie light, and you feel a sharp, searing pain in your palm. <br><br>
Looking down, you see the crystal embedding itself into your skin, its tendrils of light spreading like veins up your arm.<br><br>
The masked figure reappears, his laughter echoing through the cathedral. "Foolish mortal," he sneers. "The Chrono Crystal does not belong to you—it belongs to time itself. And now, you are its prisoner."<br><br>
The walls of the cathedral begin to collapse, but instead of rubble, they dissolve into a swirling void of darkness.<br><br>
 You try to run, but your feet are rooted to the ground, the crystal's energy binding you in place. The masked figure's voice fades as the void consumes everything around you.<br><br>
 Then you open your eyes, you are no longer in the cathedral. You are trapped in a timeless void, surrounded by endless gears and ticking clocks. The Chrono Crystal has fused with your body, and you realize with horror that you have become the new guardian of time—doomed to watch the ages pass, unable to interact with the world, forever alone in the endless machinery of eternity.</p>
            
            <img src="./imgs/crystalcoffin.jpg" alt="crystal coffin">
                        <button onclick="restart()">Restart</button>

        `;
    }

// final-level choice after choosing 'device
} else if (storyDiv.innerHTML.includes("The Crystal Glows Golden")) {
    if (option === '2') {
        content = `
            <p>As your fingers close around the Chrono Crystal, a warm, golden light floods the cathedral. The gears around you hum with newfound energy, and the air fills with the sound of joyous chimes. The crystal pulses in your hand, and you feel a surge of power and clarity, as if the very essence of time is flowing through you.
The masked figure reappears, but this time, his mask is gone, revealing a kind, smiling face. "You have done it," he says, his voice filled with pride. "The Chrono Crystal has chosen you as its guardian. With its power, you can restore balance to the city and usher in a new era of prosperity."
The cathedral doors swing open, and you step outside to find the city transformed. The streets are alive with celebration, as steam-powered carriages and airships glide effortlessly through the air. The automatons dance in the streets, their gears whirring in perfect harmony.
The people of the city cheer as you raise the Chrono Crystal high, its light bathing everything in a warm, golden glow. In the days that follow, you use the crystal's power to heal the city, repairing its broken machinery and bringing hope to its people.
The masked figure, now revealed as the city's former guardian, guides you in your new role. Together, you build a future where technology and humanity coexist in perfect harmony, and the city becomes a beacon of progress and joy for the entire world.
As the sun rises on a new day, you stand atop the Clockwork Cathedral, the Chrono Crystal glowing brightly in your hand. You know that your journey has only just begun, but for the first time in a long time, you feel truly alive—ready to embrace the endless possibilities of this extraordinary new era.</p>
           
            <button onclick="handleInput()">Submit</button>
            <img src="./imgs/crystalcoffin.jpg" alt="crystal coffin">
        `;
    }





















} else if (storyDiv.innerHTML.includes("Travel to Victorian London")) {
    if (option === '1') {
        content = `
            <p>You arrive in Victorian London, where secret societies seek alchemical knowledge. Will you join them or oppose them?</p>
            <p>1. Join the secret society</p>
            <p>2. Oppose them and uncover their secrets</p>
            <input type="text" id="user-input" placeholder="Enter your choice (1 or 2)">
            <button onclick="handleInput()">Submit</button>
            <img src="./imgs/victlondstmpnk.jpg" alt="Victorian London">
        `;
    }












// third-level choice after choosing 'device
} else if (storyDiv.innerHTML.includes("Join the secret society")) {
    if (option === '1') {
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
    }

// final-level choice after choosing 'device
} else if (storyDiv.innerHTML.includes("You change your mind. You are a person of reason. This makes no sense you realize.")) {
    if (option === '2') {
        content = `
            <p>You step back, shaking your head. "I cannot," you say, your voice firm despite the tremor in your heart. The man's smile fades, replaced by a look of cold disappointment.
"Very well," he replies, his tone icy. "But know this: once you leave, you can never return." The hooded figures part, creating a path to the door. As you turn to leave, the air grows colder, and the shadows seem to reach out, as if reluctant to let you go.
You step outside, the door closing behind you with a final, echoing thud. The alleyway feels darker, the mist thicker, and you can't shake the feeling that you have just walked away from a destiny that will forever remain a mystery.
Aghhhh! Your stomach cramps, your heart pounds, your vision begins to go black...
</p>
<button onclick="handleInput()">Submit</button>
<img src="./imgs/walkingaway.jpg" alt="Walkaway">
        `;
    }










 // Final outcome for altering fate
} else if (storyDiv.innerHTML.includes("Lift the Veil")) {
    if (option === '1') {
        content = `
            <p>You take a deep breath, feeling the weight of the moment. With a steady hand, you dip the quill into the ink and sign your name in the ledger.
The hooded figures murmur in approval, their voices a low, harmonious chant. The man smiles, a glint of satisfaction in his eyes.
"Welcome," he says, "to the Order of the Serpent. Your journey into the arcane begins now."
As the ink dries, you feel a strange warmth spread through your body, as if ancient knowledge is being etched into your very soul. The room seems to shift, the shadows deepening, and you realize that you have crossed a threshold into a world hidden from ordinary sight.
</p>
            <p>1. Lift the veil</p>
            <input type="text" id="user-input" placeholder="Enter your choice (1 or 2)">
            <button onclick="handleInput()">Submit</button>
            <img src="./imgs/cult.jpg" alt="The Society">
            <button onclick="restart()">Restart</button>
        `;
    }








} else if (storyDiv.innerHTML.includes("Enter the Steampunk Metropolis")) {
    if (option === '1') {
        content = `
            <p>The metropolis is alive with steam-powered automatons and airships. A masked figure offers you a mission. Do you accept?</p>
            <p>1. Accept the mission</p>
            <p>2. Decline and explore the city</p>
            <input type="text" id="user-input" placeholder="Enter your choice (1 or 2)">
            <button onclick="handleInput()">Submit</button>
            <img src="./imgs/maskedman.jpg" alt="Steampunk city">
        `;






        } else if (option === 'wait') {
            content = `
                <p>In the dimly lit alchemical laboratory, the air is thick with the scent of ancient herbs and the faint hum of arcane machinery. Beakers and flasks bubble with mysterious concoctions, their contents glowing with an otherworldly light. The walls are lined with shelves, each crammed with ancient tomes and strange artifacts, their secrets long forgotten by the world outside.</p>
                <p>1. Reach out your hand to join her</p>
                <p>2. Close your eyes and shake your head</p>
                <input type="text" id="user-input" placeholder="Enter your choice (1 or 2)">
                <button onclick="handleInput()">Submit</button>
                <img src="./imgs/cleothealchemist.jpg" alt="Cleo">
            `;
        }
  
    } 
        }
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