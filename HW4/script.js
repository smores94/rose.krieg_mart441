// Variables
let score = 0;

// DOMContentLoaded Event Listener
document.addEventListener("DOMContentLoaded", () => {
    let introAnimation = document.getElementById("intro-animation");
    let zoomImage = document.getElementById("zoom-image");

    // Function to hide the intro animation
    function hideIntro() {
        console.log("Animation ended, hiding intro screen...");

        if (!introAnimation) return; // Ensure the element exists

        // Apply transition before setting opacity to 0
        introAnimation.style.transition = "opacity 1s ease-out";
        introAnimation.style.opacity = "0";

        // After fade-out completes, remove the element
        setTimeout(() => {
            if (introAnimation) {
                introAnimation.remove();
                console.log("Intro animation removed from DOM.");
            }
        }, 1000); // Matches the CSS transition time
    }

    // Run `hideIntro` after 17 seconds (matching animation duration)
    setTimeout(hideIntro, 17000);

    // Apply background and show content
    document.body.classList.add("background-active");
    document.querySelector("h1").style.display = "block";
    document.getElementById("story").style.display = "block";

    // Fallback in case the animationend event doesn't fire
    setTimeout(hideIntro, 18000); // Slightly longer than the animation duration
});

// Function to handle user input
function handleInput() {
    const userInput = document.getElementById('user-input').value.trim().toLowerCase();
    let option = userInput; // Use the raw input for nested choices

    // Map initial choices to options
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

    // Call the choose function with the selected option
    choose(option);
}

// Function to handle user choices
function choose(option) {
    const storyDiv = document.getElementById('story');
    let content = "";

    // Example of concatenation and addition
    let introText = "You chose: " + option + ". ";
    content += `<p>${introText}</p>`;

    // Handle initial and subsequent choices
    if (option === 'book') {
        content += `
            <p>As you open the tome, glowing symbols appear. A potion recipe catches your eye. Will you brew it or seek a different path?</p>
            <p>1. Brew the Potion</p>
            <p>2. Explore the Workshop</p>
            <input type="text" id="user-input" placeholder="Enter your choice (1 or 2)">
            <button onclick="handleInput()">Submit</button>
            <img src="./imgs/corpushermetic.jpg" alt="Alchemy book">
        `;
    } else if (option === 'Brew the Potion') {
        content += `
            <p>You brew a shimmering elixir. Drinking it, you gain the ability to see into the future! What will you do with this power?</p>
            <p>1. Use your vision to predict events</p>
            <p>2. Attempt to alter fate</p>
            <input type="text" id="user-input" placeholder="Enter your choice (1 or 2)">
            <button onclick="handleInput()">Submit</button>
            <img src="./imgs/potion.png" alt="Magic potion">
        `;
    } else if (option === 'Use your vision to predict events') {
        content += `
            <p>You predict the future, becoming wealthy beyond all your dreams. You are famous, loved, but always a feeling of fear surrounds you.</p>
            <img src="./imgs/family.png" alt="Family">
            <button onclick="restart()">Restart</button>
        `;
    } else if (option === 'Attempt to alter fate') {
        content += `
            <p>Your Great-Grandparents were immigrants to Quebec, and always talked about the glory of France. You decide to try and stop the French Revolution. <br><br>
            But oh no...Without the revolution, King Louis XVI, Marie Antoinette, their descendants and the French Monarchy continue to the present day. The French Monarchy helped England instead of the fledgling United States. The Louisiana Purchase never happened. Your Great-grandparents never immigrated.
            <br><br>You see your hand fading in front of you.....as you cease to exist.</p>
            <img src="./imgs/fadinghands.png" alt="hands in workshop">
            <button onclick="restart()">Restart</button>
        `;
    } else if (option === 'Explore the Workshop') {
        content += `
            <p>Exploring the workshop, you discover a hidden compartment with blueprints for an airship. Adventure awaits!</p>
            <p>1. Build the airship</p>
            <p>2. Sell the blueprints for gold</p>
            <input type="text" id="user-input" placeholder="Enter your choice (1 or 2)">
            <button onclick="handleInput()">Submit</button>
            <img src="./imgs/airship.jpg" alt="Steampunk airship">
        `;
    } else if (option === 'Build the airship') {
        score += 20;
        content += `
            <p>You build the airship and sell it.
            <br><br>On the day of its maiden flight, you stand proudly on the deck of the ship, looking down at the city.
            <br><br>All of a sudden you hear an explosion. You look around. Part of the ship is missing and the part you are standing on is in flames. You are in shock, as more explosions rip through the air.
            <br><br>You make your peace.</p>
            <img src="./imgs/airshipflames.jpg" alt="airship in flames">
            <button onclick="restart()">Restart Adventure</button>
        `;
    } else if (option === 'Sell the blueprints for gold') {
        score += 20;
        content += `
            <p>You look at the blueprints. For as old as they are, you can see the ship that could be made will be more advanced than anything you have ever seen. <br><br>
            You decide to sell them. As you reach for your pile of gold, you feel a pain in your back.
            <br><br>The buyer looks at you and says "It's not personal mate. But I'm not going to risk competition." He smiles. Everything begins to fade.</p>
            <img src="./imgs/gold.jpg" alt="gold">
            <button onclick="restart()">Restart Adventure</button>
        `;
    } else if (option === 'device') {
        content += `
            <p>You activate the Time Device, and the world around you starts to warp. A vortex opens, offering two choices:</p>
            <p>1. Travel to Victorian London</p>
            <p>2. Enter the Steampunk Metropolis</p>
            <input type="text" id="user-input" placeholder="Enter your choice (1 or 2)">
            <button onclick="handleInput()">Submit</button>
            <img src="./imgs/antikythera.png" alt="Time Device">
        `;
    } else if (option === 'Travel to Victorian London') {
        content += `
            <p>You arrive in Victorian London, where secret societies seek alchemical knowledge. Will you join them or oppose them?</p>
            <p>1. Join the secret society</p>
            <p>2. Oppose them and uncover their secrets</p>
            <input type="text" id="user-input" placeholder="Enter your choice (1 or 2)">
            <button onclick="handleInput()">Submit</button>
            <img src="./imgs/victlondstmpnk.jpg" alt="Victorian London">
        `;
    } else if (option === 'Join the secret society') {
        content += `
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
    } else if (option === 'Lift the veil') {
        content += `
            <p>You take a deep breath, feeling the weight of the moment. With a steady hand, you dip the quill into the ink and sign your name in the ledger.
            The hooded figures murmur in approval, their voices a low, harmonious chant. The man smiles, a glint of satisfaction in his eyes.
            "Welcome," he says, "to the Order of the Serpent. Your journey into the arcane begins now."
            As the ink dries, you feel a strange warmth spread through your body, as if ancient knowledge is being etched into your very soul. The room seems to shift, the shadows deepening, and you realize that you have crossed a threshold into a world hidden from ordinary sight.</p>
            <img src="./imgs/cult.jpg" alt="The Society">
            <button onclick="restart()">Restart</button>
        `;
    } else if (option === 'You change your mind. You are a person of reason. This makes no sense you realize.') {
        content += `
            <p>You step back, shaking your head. "I cannot," you say, your voice firm despite the tremor in your heart. The man's smile fades, replaced by a look of cold disappointment.
            "Very well," he replies, his tone icy. "But know this: once you leave, you can never return." The hooded figures part, creating a path to the door. As you turn to leave, the air grows colder, and the shadows seem to reach out, as if reluctant to let you go.
            You step outside, the door closing behind you with a final, echoing thud. The alleyway feels darker, the mist thicker, and you can't shake the feeling that you have just walked away from a destiny that will forever remain a mystery.
            Aghhhh! Your stomach cramps, your heart pounds, your vision begins to go black...</p>
            <img src="./imgs/walkingaway.jpg" alt="Walkaway">
            <button onclick="restart()">Restart</button>
        `;
    } else if (option === 'Enter the Steampunk Metropolis') {
        content += `
            <p>The metropolis is alive with steam-powered automatons and airships. A masked figure offers you a mission. Do you accept?</p>
            <p>1. Accept the mission</p>
            <p>2. Decline and explore the city</p>
            <input type="text" id="user-input" placeholder="Enter your choice (1 or 2)">
            <button onclick="handleInput()">Submit</button>
            <img src="./imgs/maskedman.jpg" alt="Steampunk city">
        `;
    } else if (option === 'Accept the mission') {
        content += `
            <p>You nod, curiosity and excitement bubbling within you. The masked figure's eyes gleam with approval as he hands you a brass key, intricately designed with gears and cogs. "This key," he whispers, "unlocks the heart of the city. You must find the Clockwork Cathedral and retrieve the Chrono Crystal before the clock strikes midnight."
            With a flourish of his cloak, he vanishes into the steam-filled night. You set off, navigating the bustling streets filled with steam-powered carriages and towering airships. Automatons tip their hats as you pass, their gears whirring in polite acknowledgment. The city pulses with life, a symphony of hissing steam and clanking metal.
            Reaching the Clockwork Cathedral, you insert the key into a hidden lock. The massive doors creak open, revealing a labyrinth of gears and pistons. You race against time, dodging mechanical guardians and solving intricate puzzles. Finally, you reach the altar, where the Chrono Crystal glows with an ethereal light. As you grasp it, the city seems to hold its breath, waiting for the dawn of a new era.</p>
            <p>1. The Crystal Glows Dark</p>
            <p>2. The Crystal Glows Golden</p>
            <input type="text" id="user-input" placeholder="Enter your choice (1 or 2)">
            <button onclick="handleInput()">Submit</button>
            <img src="./imgs/clockworkcrystal.jpg" alt="clockwork crystal">
        `;
    } else if (option === 'The Crystal Glows Dark') {
        content += `
            <p>As your fingers close around the Chrono Crystal, a deafening silence falls over the cathedral. The gears grind to a halt, and the air grows heavy with an unnatural stillness. The crystal pulses with a cold, eerie light, and you feel a sharp, searing pain in your palm. <br><br>
            Looking down, you see the crystal embedding itself into your skin, its tendrils of light spreading like veins up your arm.<br><br>
            The masked figure reappears, his laughter echoing through the cathedral. "Foolish mortal," he sneers. "The Chrono Crystal does not belong to you—it belongs to time itself. And now, you are its prisoner."<br><br>
            The walls of the cathedral begin to collapse, but instead of rubble, they dissolve into a swirling void of darkness.<br><br>
            You try to run, but your feet are rooted to the ground, the crystal's energy binding you in place. The masked figure's voice fades as the void consumes everything around you.<br><br>
            Then you open your eyes, you are no longer in the cathedral. You are trapped in a timeless void, surrounded by endless gears and ticking clocks. The Chrono Crystal has fused with your body, and you realize with horror that you have become the new guardian of time—doomed to watch the ages pass, unable to interact with the world, forever alone in the endless machinery of eternity.</p>
            <img src="./imgs/crystalcoffin.jpg" alt="crystal coffin">
            <button onclick="restart()">Restart</button>
        `;
    } else if (option === 'The Crystal Glows Golden') {
        content += `
            <p>As your fingers close around the Chrono Crystal, a warm, golden light floods the cathedral. The gears around you hum with newfound energy, and the air fills with the sound of joyous chimes. The crystal pulses in your hand, and you feel a surge of power and clarity, as if the very essence of time is flowing through you.
            The masked figure reappears, but this time, his mask is gone, revealing a kind, smiling face. "You have done it," he says, his voice filled with pride. "The Chrono Crystal has chosen you as its guardian. With its power, you can restore balance to the city and usher in a new era of prosperity."
            The cathedral doors swing open, and you step outside to find the city transformed. The streets are alive with celebration, as steam-powered carriages and airships glide effortlessly through the air. The automatons dance in the streets, their gears whirring in perfect harmony.
            The people of the city cheer as you raise the Chrono Crystal high, its light bathing everything in a warm, golden glow. In the days that follow, you use the crystal's power to heal the city, repairing its broken machinery and bringing hope to its people.
            The masked figure, now revealed as the city's former guardian, guides you in your new role. Together, you build a future where technology and humanity coexist in perfect harmony, and the city becomes a beacon of progress and joy for the entire world.
            As the sun rises on a new day, you stand atop the Clockwork Cathedral, the Chrono Crystal glowing brightly in your hand. You know that your journey has only just begun, but for the first time in a long time, you feel truly alive—ready to embrace the endless possibilities of this extraordinary new era.</p>
            <img src="./imgs/crystalcoffin.jpg" alt="crystal coffin">
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