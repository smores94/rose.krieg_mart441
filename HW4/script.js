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
            content += "<p>1a. Brew the Potion</p><p>2a. Nevermind, let's explore the Workshop</p>";
            content += '<img src="./imgs/corpushermetic.jpg" alt="Alchemy book">'; // Add the image here
            break;
        case '2':
            content += "<p>You chose option 2: Activate the Time Device.</p>";
            content += "<p>You activate the Time Device, and the world around you starts to warp. A vortex opens, offering two choices:</p>";
            content += "<p>1d. Travel to Victorian London</p><p>2d. Enter the Steampunk Metropolis</p>";
            content += '<img src="./imgs/antikythera.png" alt="Time Device">'; // Add the image here
            break;
        case '1a': // Brew Potion (follow-up choice)
            content += "<p>You chose to brew the potion.</p>";
            content += "<p>You brew a shimmering elixir. Drinking it, you gain the ability to see into the future! What will you do with this power?</p>";
            content += "<p>1b. Use your vision to predict events</p><p>2b. Attempt to alter fate</p>";
            content += '<img src="./imgs/potion.png" alt="Magic potion">'; // Add the image here
            break;
        case '2a': // Explore Workshop (follow-up choice)
            content += "<p>You chose to explore the Workshop.</p>";
            content += "<p>Exploring the workshop, you discover a hidden compartment with blueprints for an airship. Adventure awaits!</p>";
            content += "<p>1c. Build the airship</p><p>2c. Sell the blueprints for gold</p>";
            content += '<img src="./imgs/airship.jpg" alt="Steampunk airship">'; // Add the image here
            break;
        case '1b':// use vision final (follow-up choice)
            content = "<p>You chose to Use your vision to predict events</p>";
            content += "<p>You predict the future, becoming wealthy beyond all your dreams. You are famous, loved, but always a feeling of fear surrounds you.</p>";
            content += '<img src="./imgs/family.png" alt="Family">';
            break;
        case '2b':// alter fate final (follow-up choice)
            content = "<p>You chose option 2: Attempt to alter fate</p>";
            content += "<p>You attempt to alter fate itself, but the timeline begins to unravel. A shadow looms over you as time collapses... you begin to disappear.</p>";
            content += '<img src="./imgs/fadinghands.png" alt="Fading">';
            break;
        case '1c': // air ship final choice (follow-up choice)
            content = "<p>You chose to Build the airship</p>";
            content += "<p>You build the airship and sell it. On the day of its maiden flight, you stand proudly on the deck of the ship, looking down at the city. All of a sudden you hear an explosion. You look around. Part of the ship is missing and the part you are standing on is in flames. You are in shock, as more explosions rip through the air. You make your peace.</p>";
            content += '<img src="./imgs/airshipflames.jpg" alt="Airship in flames">';
            break;
        case '2c':
            content = "<p>You chose to Sell the blueprints for gold</p>";
            content += "<p>You look at the blueprints. For as old as they are, you can see the ship that could be made will be more advanced than anything you have ever seen. You decide to sell them. As you reach for your pile of gold, you feel a pain in your back. The buyer looks at you and says, 'It's not personal, mate. But I'm not going to risk competition.' He smiles. Everything begins to fade.</p>";
            content += '<img src="./imgs/gold.jpg" alt="Gold">';
            break;
        case '1d': // Travel to London (follow-up choice)
            content = "<p>You chose to Travel to Victorian London</p>";
            content += "<p>You arrive in Victorian London, where secret societies seek alchemical knowledge. Will you join them or oppose them?</p>";
            content += "<p>1e. Join the secret society</p><p>2e. Oppose them and uncover their secrets</p>";
            content += '<img src="./imgs/victlondstmpnk.jpg" alt="Victorian London">';
            break;
        case '2d':// sTeampunk Metropolis (follow-up choice)
            content = "<p>You chose to Enter the Steampunk Metropolis</p>";
            content += "<p>The metropolis is alive with steam-powered automatons and airships. A masked figure offers you a mission. Do you accept?</p>";
            content += "<p>1h. Accept the mission</p><p>2h. Decline and explore the city.</p>";
            content += '<img src="./imgs/maskedman.jpg" alt="Steampunk city">';
            break;
        case '1e': // secret society (follow-up choice)
            content = "<p>You chose to Join the secret society</p>";
            content += "<p>The Invitation London, 1887...</p>";
            content += "<p>1f. Lift the veil</p><p>2f. Change your mind</p>";
            content += '<img src="./imgs/letter.jpg" alt="The Invitation">';
            break;
        case '2e':  // secret society (follow-up choice)
            content = "<p>You chose to Oppose them and uncover their secrets</p>";
            content += "<p>You step back, shaking your head... Your stomach cramps, your heart pounds...</p>";
            content += '<img src="./imgs/victlondstmpnk.jpg" alt="Victorian London">';
            break;
        case '1f':  // secret society (follow-up choice)
            content = "<p>You chose to Lift the veil</p>";
            content += "<p>You take a deep breath, feeling the weight of the moment...</p>";
            content += '<img src="./imgs/cult.jpg" alt="The Society">';
            break;
        case '2f':  // secret society (follow-up choice)
            content = "<p>You chose to change your mind...</p>";
            content += "<p>Your stomach cramps, your heart pounds...</p>";
            content += '<img src="./imgs/walkingaway.jpg" alt="Walkaway">';
            break;
        case '2g': // secret society (follow-up choice)
            content = "<p>You chose to Enter the Steampunk Metropolis</p>";
            content += "<p>The metropolis is alive with steam-powered automatons...</p>";
            content += "<p>1h. Accept the mission</p><p>2h. Decline and explore the city.</p>";
            content += '<img src="./imgs/maskedman.jpg" alt="Steampunk city">';
            break;
        case '1h':// secret society accept mission (follow-up choice)
            content = "<p>You chose option 1: Accept the mission</p>";
            content += "<p>You nod, curiosity and excitement bubbling within you...</p>";
            content += "<p>1i. The Crystal Glows Dark</p><p>2i. The Crystal Glows Golden</p>";
            content += '<img src="./imgs/clockworkcrystal.jpg" alt="clockwork crystal">';
            break;
        case '2h': // secret society decline mission(follow-up choice) 
            content = "<p>You chose option 2: Decline and explore the city.</p>";
            content += "<p>You shake your head, the weight of the unknown too great to bear...</p>";
            content += '<img src="./imgs/maskedman.jpg" alt="Steampunk city">';
            break;
            case '1i': // crystal glows dark (follow-up choice)
                content = "<p>1. The Crystal Glows Dark</p>";
                content += "<p>As your fingers close around the Chrono Crystal, a deafening silence falls over the cathedral. The gears grind to a halt, and the air grows heavy with an unnatural stillness. The crystal pulses with a cold, eerie light, and you feel a sharp, searing pain in your palm. Looking down, you see the crystal embedding itself into your skin, its tendrils of light spreading like veins up your arm. The masked figure reappears, his laughter echoing through the cathedral. Foolish mortal, he sneers. The Chrono Crystal does not belong to you—it belongs to time itself. And now, you are its prisoner. The walls of the cathedral begin to collapse, but instead of rubble, they dissolve into a swirling void of darkness. You try to run, but your feet are rooted to the ground, the crystal's energy binding you in place. The masked figure's voice fades as the void consumes everything around you. When you open your eyes, you are no longer in the cathedral. You are trapped in a timeless void, surrounded by endless gears and ticking clocks. The Chrono Crystal has fused with your body, and you realize with horror that you have become the new guardian of time—doomed to watch the ages pass, unable to interact with the world, forever alone in the endless machinery of eternity.</p>"
                content += '<img src="./imgs/crystalcoffin.jpg" alt="dark crystal">';
                break;
            case '2i': // crystal glows gold (follow-up choice)
                content = "<p>2. The Crystal Glows Golden</p>";
                content += "<p>As your fingers close around the Chrono Crystal, a warm, golden light floods the cathedral. The gears around you hum with newfound energy, and the air fills with the sound of joyous chimes. The crystal pulses in your hand, and you feel a surge of power and clarity, as if the very essence of time is flowing through you. The masked figure reappears, but this time, his mask is gone, revealing a kind, smiling face. You have done it, he says, his voice filled with pride. The Chrono Crystal has chosen you as its guardian. With its power, you can restore balance to the city and usher in a new era of prosperity. The cathedral doors swing open, and you step outside to find the city transformed. The streets are alive with celebration, as steam-powered carriages and airships glide effortlessly through the air. The automatons dance in the streets, their gears whirring in perfect harmony. The people of the city cheer as you raise the Chrono Crystal high, its light bathing everything in a warm, golden glow. In the days that follow, you use the crystal's power to heal the city, repairing its broken machinery and bringing hope to its people. The masked figure, now revealed as the city's former guardian, guides you in your new role. Together, you build a future where technology and humanity coexist in perfect harmony, and the city becomes a beacon of progress and joy for the entire world. As the sun rises on a new day, you stand atop the Clockwork Cathedral, the Chrono Crystal glowing brightly in your hand. You know that your journey has only just begun, but for the first time in a long time, you feel truly alive—ready to embrace the endless possibilities of this extraordinary new era.</p>";
                content += '<img src="./imgs/golden.jpg" alt="golden crystal">';
                break;     
        default:
            content += "<p>Invalid choice. Please enter a valid option.</p>";
            break;
    }

    // Display the content in the storyDiv
    storyDiv.innerHTML = content;

    // Clear input after submission
    document.getElementById('user-input').value = '';
}

// Restart function
function restart() {
    const storyDiv = document.getElementById('story');
    storyDiv.innerHTML = `
        <p>You awaken in a dimly lit workshop, gears whirring around you. On the desk, an ancient alchemical tome and a brass time device hum with energy.</p>
        <p>What do you do?</p>
        <p>1. Read the Alchemical Tome</p>
        <p>2. Activate the Time Device</p>
        <input type="text" id="user-input" placeholder="Enter your choice (1 or 2)">
        <button id="submit-button">Submit</button>
    `;

    // Reattach event listener to the new submit button
    document.getElementById('submit-button').addEventListener('click', handleInput);
}
// Attach the restart button event listener
document.getElementById("restart-button").addEventListener("click", resetGame);