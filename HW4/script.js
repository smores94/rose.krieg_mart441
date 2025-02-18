// Variables
let score = 0;

document.addEventListener("DOMContentLoaded", () => {
    let introAnimation = document.getElementById("intro-animation");
    let zoomImage = document.getElementById("zoom-image");

    function hideIntro() {
        console.log("Animation ended, hiding intro screen...");

        // Fade out the intro animation
        introAnimation.style.transition = "opacity 1s ease-out"; // Set transition
        introAnimation.style.opacity = "0"; // Start fade-out

        // Remove the intro animation from the DOM after the fade-out
        setTimeout(() => {
            console.log("Removing intro animation from the DOM...");
            introAnimation.remove(); // This removes the element entirely
        }, 1000); // Wait for the fade-out to complete (1 second)
    }

    if (zoomImage) {
        // Listen for the end of the animation
        zoomImage.addEventListener("animationend", hideIntro);

        // Fallback in case the animationend event doesn't fire
        setTimeout(hideIntro, 5000); // Fallback after 5 seconds
    }

    // Apply background and show content after the intro animation
    setTimeout(() => {
        document.body.classList.add("background-active");
        document.querySelector("h1").style.display = "block";
        document.getElementById("story").style.display = "block";
    }, 1000); // Wait for the fade-out to complete
});

// Function to handle user choices
function choose(option) {
    const storyDiv = document.getElementById('story');
    let content = "";

    // Example of concatenation and addition
    let introText = "You chose: " + option + ". ";
    content += `<p>${introText}</p>`;

    // Update the story content
    storyDiv.innerHTML = content;
}

// Function to handle user input and choices
function handleInput() {
    const userInput = document.getElementById('user-input').value.trim(); // Get the input value
    const storyDiv = document.getElementById('story'); // Get the story div
    let content = "";

    // Check the input and update the story based on the user's choice
    switch (userInput) {
        case '1':
            content += "<p>You chose option 1: Read the Alchemical Tome.</p>";
            content += "<p>As you open the tome, glowing symbols appear. A potion recipe catches your eye. Will you brew it or seek a different path?</p>";
            content += "<p>1. Brew the Potion</p><p>2. Nevermind, let's explore the Workshop</p>";
            content += '<img src="./imgs/corpushermetic.jpg" alt="Alchemy book">'; // Add the image here
            break;
        case '2':
            content += "<p>You chose option 2: Activate the Time Device.</p>";
            content += "<p>You activate the Time Device, and the world around you starts to warp. A vortex opens, offering two choices:</p>";
            content += "<p>1. Travel to Victorian London</p><p>2. Enter the Steampunk Metropolis</p>";
            content += '<img src="./imgs/antikythera.png" alt="Time Device">'; // Add the image here
            break;
        case '1a': // Brew Potion (follow-up choice)
            content += "<p>You chose to brew the potion.</p>";
            content += "<p>You brew a shimmering elixir. Drinking it, you gain the ability to see into the future! What will you do with this power?</p>";
            content += "<p>1. Use your vision to predict events</p><p>2. Attempt to alter fate</p>";
            content += '<img src="./imgs/potion.png" alt="Magic potion">'; // Add the image here
            break;
        case '2a': // Explore Workshop (follow-up choice)
            content += "<p>You chose to explore the Workshop.</p>";
            content += "<p>Exploring the workshop, you discover a hidden compartment with blueprints for an airship. Adventure awaits!</p>";
            content += "<p>1. Build the airship</p><p>2. Sell the blueprints for gold</p>";
            content += '<img src="./imgs/airship.jpg" alt="Steampunk airship">'; // Add the image here
            break;
        default:
            content += "<p>Invalid choice. Please enter 1 or 2.</p>";
            break;
    }
// Next choice for Predict the Future
switch (userInput) {
    case '1b':
        content = "<p>You chose to Use your vision to predict events</p>";
        content += "<p>You predict the future, becoming wealthy beyond all your dreams. You are famous, loved, but always a feeling of fear surrounds you.</p>";
        content += '<img src="./imgs/family.png" alt="Family">';
        break;
    case '2b':
        content = "<p>You chose option 2: Attempt to alter fate</p>";
        content += "<p>You attempt to alter fate itself, but the timeline begins to unravel. A shadow looms over you as time collapses... you begin to disappear.</p>";
        content += '<img src="./imgs/fadinghands.png" alt="Fading">';
        break;
    default:
        content = "<p>Invalid choice. Please enter 1 or 2.</p>";
}

// Next choice for airships
switch (userInput) {
    case '1c':
        content = "<p>You chose to Build the airship</p>";
        content += "<p>You build the airship and sell it. On the day of its maiden flight, you stand proudly on the deck of the ship, looking down at the city. All of a sudden you hear an explosion. You look around. Part of the ship is missing and the part you are standing on is in flames. You are in shock, as more explosions rip through the air. You make your peace.</p>";
        content += '<img src="./imgs/airshipflames.jpg" alt="Airship in flames">';
        break;
    case '2c':
        content = "<p>You chose to Sell the blueprints for gold</p>";
        content += "<p>You look at the blueprints. For as old as they are, you can see the ship that could be made will be more advanced than anything you have ever seen. You decide to sell them. As you reach for your pile of gold, you feel a pain in your back. The buyer looks at you and says, 'It's not personal, mate. But I'm not going to risk competition.' He smiles. Everything begins to fade.</p>";
        content += '<img src="./imgs/gold.jpg" alt="Gold">';
        break;
    default:
        content = "<p>Invalid choice. Please enter 1 or 2.</p>";
}

// Next choice for activating the time device
switch (userInput) {
    case '1d':
        content = "<p>You chose to Travel to Victorian London</p>";
        content += "<p>You arrive in Victorian London, where secret societies seek alchemical knowledge. Will you join them or oppose them?</p>";
        content += "<p>1. Join the secret society</p>";
        content += "<p>2. Oppose them and uncover their secrets</p>";
        content += '<img src="./imgs/victlondstmpnk.jpg" alt="Victorian London">';
        break;
    case '2d':
        content = "<p>You chose to Enter the Steampunk Metropolis</p>";
        content += "<p>The metropolis is alive with steam-powered automatons and airships. A masked figure offers you a mission. Do you accept?</p>";
        content += "<p>1. Accept the mission</p>";
        content += "<p>2. Decline and explore the city.</p>";
        content += '<img src="./imgs/maskedman.jpg" alt="Steampunk city">';
        break;
    default:
        content = "<p>Invalid choice. Please enter 1 or 2.</p>";
}

// Next choice for victorian london
switch (userInput) {
    case '1e':
        content = "<p>You chose to Join the secret society</p>";
        content = "<p>The Invitation London, 1887.The air is thick with soot and secrecy, the gas lamps flickering in defiance of the smog. You tread carefully through the damp alleyways, your boots echoing against cobblestone streets slick with evening mist. The letter in your coat pocket is sealed with black wax, stamped with an insignia you do not recognize—a serpent entwined with a dagger. It had arrived without explanation, slipped under your door as if by ghostly hands.You reach the unmarked door as instructed. A single knock. A pause.        Then, it creaks open just enough to reveal the glint of watchful eyes. No words are spoken. You step inside.The room beyond is dimly lit by candelabras dripping wax like blood. Hooded figures stand in a circle, their faces obscured, their eyes burning through the shadows. The scent of old books, ink, and something metallic—like rust or dried blood—lingers in the air.A man steps forward. His voice is velvet over steel. You stand at the threshold of something far greater than yourself. The world outside is blind, shackled by ignorance. But we... we see beyond the veil. We unearth truths long buried. We shape the fate of nations from the darkness in which we dwell.He gestures to a table draped in crimson cloth. Upon it, a quill and a ledger, its pages aged and yellowed. Names fill its lines—some crossed out, others stained, perhaps with ink… or something else. One mark, and you are bound to us. No king, no parliament, no god shall own you. Only the pursuit of power, knowledge, and the unseen forces that weave the fabric of this world. But beware—once the ink dries, there is no turning back.The candlelight wavers. The air grows heavy. Behind you, the door has closed.</p>"
        content = "<p>1. Lift the veil</p>";
        content = "<p>2. You change your mind. You are a person of reason. This makes no sense you realize.</p>";
        content += '<img src="./imgs/letter.jpg" alt="The Invitation"></img>'; // Add the image here
        content = "<p>Invalid choice. Please enter 1 or 2.</p>";
        break;
        case '2e':
            content = "<p>You chose to Oppose them and uncover their secrets</p>";
            content = "<p>You step back, shaking your head. I cannot, you say, your voice firm despite the tremor in your heart. The man's smile fades, replaced by a look of cold disappointment.Very well, he replies, his tone icy. But know this: once you leave, you can never return. The hooded figures part, creating a path to the door. As you turn to leave, the air grows colder, and the shadows seem to reach out, as if reluctant to let you go.You step outside, the door closing behind you with a final, echoing thud. The alleyway feels darker, the mist thicker, and you can't shake the feeling that you have just walked away from a destiny that will forever remain a mystery.Aghhhh! Your stomach cramps, your heart pounds, your vision begins to go black...</p>"
           content = '<img src="./imgs/victlondstmpnk.jpg" alt="Victorian London">'; //add image
            content = "<p>Invalid choice. Please enter 1 or 2.</p>";
            break;        
}

// Next choice for join the secret society
switch (userInput) {
    case '1f':
        content = "<p>You chose to Lift the veil</p>";
        content = "<p>You take a deep breath, feeling the weight of the moment. With a steady hand, you dip the quill into the ink and sign your name in the ledger.The hooded figures murmur in approval, their voices a low, harmonious chant. The man smiles, a glint of satisfaction in his eyes.Welcome, he says, to the Order of the Serpent. Your journey into the arcane begins now.As the ink dries, you feel a strange warmth spread through your body, as if ancient knowledge is being etched into your very soul. The room seems to shift, the shadows deepening, and you realize that you have crossed a threshold into a world hidden from ordinary sight.</p>"
        content += '<img src="./imgs/cult.jpg" alt="The Society">'; // Add the image here
        content = "<p>Invalid choice. Please enter 1 or 2.</p>";
        break;
        case '2f':
            content = "<p>You chose to You change your mind. You are a person of reason. This makes no sense you realize.</p>";
            content = "<p>You step back, shaking your head. I cannot, you say, your voice firm despite the tremor in your heart. The man's smile fades, replaced by a look of cold disappointment.Very well, he replies, his tone icy. But know this: once you leave, you can never return. The hooded figures part, creating a path to the door. As you turn to leave, the air grows colder, and the shadows seem to reach out, as if reluctant to let you go.You step outside, the door closing behind you with a final, echoing thud. The alleyway feels darker, the mist thicker, and you can't shake the feeling that you have just walked away from a destiny that will forever remain a mystery.Aghhhh! Your stomach cramps, your heart pounds, your vision begins to go black...</p>"
           content = '<img src="./imgs/walkingaway.jpg" alt="Walkaway">'; //add image
            content = "<p>Invalid choice. Please enter 1 or 2.</p>";
            break;        
}

// Next choice for steampunk metropolis
switch (userInput) {
    case '2g':
        content = "<p>You chose to Enter the Steampunk Metropolis</p>";
        content = "<p>The metropolis is alive with steam-powered automatons and airships. A masked figure offers you a mission. Do you accept?</p>"
        content = "<p>1. Accept the mission</p>";
        content = "<p>2. Decline and explore the city.</p>";
        content += '<img src="./imgs/maskedman.jpg" alt="Steampunk city"></img>'; // Add the image here
        content = "<p>Invalid choice. Please enter 1 or 2.</p>";
        break;
 }

 // Next choice for steampunk metropolis mission 
switch (userInput) {
    case '1h':
        content = "<p>You chose option 1: Accept the mission</p>";
        content = "<p>You nod, curiosity and excitement bubbling within you.The masked figure's eyes gleam with approval as he hands you a brass key, intricately designed with gears and cogs. This key,he whispers, unlocks the heart of the city. You must find the Clockwork Cathedral and retrieve the Chrono Crystal before the clock strikes midnight. With a flourish of his cloak, he vanishes into the steam-filled night. You set off, navigating the bustling streets filled with steam-powered carriages and towering airships. Automatons tip their hats as you pass, their gears whirring in polite acknowledgment. The city pulses with life, a symphony of hissing steam and clanking metal. Reaching the Clockwork Cathedral, you insert the key into a hidden lock. The massive doors creak open, revealing a labyrinth of gears and pistons. You race against time, dodging mechanical guardians and solving intricate puzzles. Finally, you reach the altar, where the Chrono Crystal glows with an ethereal light. As you grasp it, the city seems to hold its breath, waiting for the dawn of a new era.</p>"
        content = "<p>1. The Crystal Glows Dark</p>";
        content = "<p>2. The Crystal Glows Golden</p>";
        content += '<img src="./imgs/clockworkcrystal.jpg" alt="clockwork crystal">'; // Add the image here
        content = "<p>Invalid choice. Please enter 1 or 2.</p>";
        break;
        case '2h':
            content = "<p>You chose option 2: Decline and explore the city.</p>";
            content = "<p>You shake your head, the weight of the unknown too great to bear. The masked figure's eyes narrow, but he nods in understanding. <br><br>"Very well," he says, his voice a blend of disappointment and respect. But know this: the city will remember your choice. As he disappears into the mist, you turn away, the bustling metropolis still alive with its mechanical wonders. You wander the streets, watching airships soar above and automatons go about their duties. The city is a marvel, but you can't shake the feeling that you've missed out on something extraordinary. Suddenly, a small automaton scurries up to you, its eyes glowing with a soft blue light. It hands you a tiny, intricately crafted music box. As you wind it up, a haunting melody fills the air, and you realize that even in your refusal, the city has gifted you a piece of its magic. The music box's tune lingers in your mind, a reminder of the adventure that could have been.</p>"
           content = '<img src="./imgs/notoadventure.jpg" alt="no to adventure">'; //add image
            content = "<p>Invalid choice. Please enter 1 or 2.</p>";
            break;        
}

// Next choice for golden crystal 
switch (userInput) {
    case '1':
        content = `<p>You chose option 1: The Crystal Glows Dark</p>
                   <p>As your fingers close around the Chrono Crystal, a deafening silence falls over the cathedral. The gears grind to a halt, and the air grows heavy with an unnatural stillness. The crystal pulses with a cold, eerie light, and you feel a sharp, searing pain in your palm. Looking down, you see the crystal embedding itself into your skin, its tendrils of light spreading like veins up your arm. The masked figure reappears, his laughter echoing through the cathedral. "Foolish mortal," he sneers. "The Chrono Crystal does not belong to you—it belongs to time itself. And now, you are its prisoner." The walls of the cathedral begin to collapse, but instead of rubble, they dissolve into a swirling void of darkness. You try to run, but your feet are rooted to the ground, the crystal's energy binding you in place. The masked figure's voice fades as the void consumes everything around you. When you open your eyes, you are no longer in the cathedral. You are trapped in a timeless void, surrounded by endless gears and ticking clocks. The Chrono Crystal has fused with your body, and you realize with horror that you have become the new guardian of time—doomed to watch the ages pass, unable to interact with the world, forever alone in the endless machinery of eternity.</p>
                   <img src="./imgs/crystalcoffin.jpg" alt="dark crystal">`;
        break;

    case '2':
        content = `<p>You chose option 2: The Crystal Glows Golden</p>
                   <p>As your fingers close around the Chrono Crystal, a warm, golden light floods the cathedral. The gears around you hum with newfound energy, and the air fills with the sound of joyous chimes. The crystal pulses in your hand, and you feel a surge of power and clarity, as if the very essence of time is flowing through you. The masked figure reappears, but this time, his mask is gone, revealing a kind, smiling face. "You have done it," he says, his voice filled with pride. "The Chrono Crystal has chosen you as its guardian. With its power, you can restore balance to the city and usher in a new era of prosperity." The cathedral doors swing open, and you step outside to find the city transformed. The streets are alive with celebration, as steam-powered carriages and airships glide effortlessly through the air. The automatons dance in the streets, their gears whirring in perfect harmony. The people of the city cheer as you raise the Chrono Crystal high, its light bathing everything in a warm, golden glow. In the days that follow, you use the crystal's power to heal the city, repairing its broken machinery and bringing hope to its people. The masked figure, now revealed as the city's former guardian, guides you in your new role. Together, you build a future where technology and humanity coexist in perfect harmony, and the city becomes a beacon of progress and joy for the entire world. As the sun rises on a new day, you stand atop the Clockwork Cathedral, the Chrono Crystal glowing brightly in your hand. You know that your journey has only just begun, but for the first time in a long time, you feel truly alive—ready to embrace the endless possibilities of this extraordinary new era.</p>
                   <img src="./imgs/golden.jpg" alt="golden crystal">`;
        break;

    default:
        content = "<p>Invalid choice. Please enter 1 or 2.</p>";
}

// Update the story content
document.getElementById('story').innerHTML = content;

// Clear the input after submission
document.getElementById('user-input').value = '';
}

function restart() {
document.getElementById('story').innerHTML = `
    <p>You awaken in a dimly lit workshop, gears whirring around you. On the desk, an ancient alchemical tome and a brass time device hum with energy.</p>
    <p>What do you do?</p>
    <p>1. Read the Alchemical Tome</p>
    <p>2. Activate the Time Device</p>
    <input type="text" id="user-input" placeholder="Enter your choice (1 or 2)">
    <button onclick="handleInput()">Submit</button>
`;
}