
// Main function to start the story
function startStory() {
    console.log("Welcome to the Interactive Story!");
    console.log("You awaken in a dimly lit workshop, gears whirring around you. On the desk, an ancient alchemical tome and a brass time device hum with energy.");
    console.log("What do you do?");
    console.log("1. Read the Alchemical Tome");
    console.log("2. Activate the Time Device");
    console.log("3. Wait and observe");

    const choice = prompt("Enter your choice (1, 2, or 3):");

    switch (choice) {
        case "1":
            readTome();
            break;
        case "2":
            activateDevice();
            break;
        case "3":
            waitAndObserve();
            break;
        default:
            console.log("Invalid choice. Please try again.");
            startStory();
    }
}

// Path 1: Read the Alchemical Tome
function readTome() {
    console.log("\nAs you open the tome, glowing symbols appear. A potion recipe catches your eye.");
    console.log("What do you do?");
    console.log("1. Brew the Potion");
    console.log("2. Explore the Workshop");

    const choice = prompt("Enter your choice (1 or 2):");

    switch (choice) {
        case "1":
            console.log("\nYou brew a shimmering elixir. Drinking it, you gain the ability to see into the future!");
            console.log("What will you do with this power?");
            console.log("1. Use your vision to predict events");
            console.log("2. Attempt to alter fate");

            const subChoice = prompt("Enter your choice (1 or 2):");

            if (subChoice === "1") {
                console.log("\nYou predict the future, becoming wealthy beyond your dreams. However, a feeling of fear surrounds you.");
            } else if (subChoice === "2") {
                console.log("\nYou attempt to alter fate, but your actions have unintended consequences. You cease to exist.");
            } else {
                console.log("Invalid choice. Ending story.");
            }
            break;

        case "2":
            console.log("\nExploring the workshop, you discover a hidden compartment with blueprints for an airship. Adventure awaits!");
            console.log("What do you do?");
            console.log("1. Build the airship");
            console.log("2. Sell the blueprints for gold");

            const subChoice2 = prompt("Enter your choice (1 or 2):");

            if (subChoice2 === "1") {
                console.log("\nYou build the airship, but on its maiden flight, it explodes. You make your peace.");
            } else if (subChoice2 === "2") {
                console.log("\nYou sell the blueprints, but the buyer betrays you. Everything fades to black.");
            } else {
                console.log("Invalid choice. Ending story.");
            }
            break;

        default:
            console.log("Invalid choice. Ending story.");
    }

    restartStory();
}

// Path 2: Activate the Time Device
function activateDevice() {
    console.log("\nYou activate the time device! A vortex opens, offering two choices:");
    console.log("1. Travel to Victorian London");
    console.log("2. Enter the Steampunk Metropolis");

    const choice = prompt("Enter your choice (1 or 2):");

    switch (choice) {
        case "1":
            console.log("\nYou arrive in Victorian London, where secret societies seek alchemical knowledge.");
            console.log("What do you do?");
            console.log("1. Join the secret society");
            console.log("2. Oppose them and uncover their secrets");

            const subChoice = prompt("Enter your choice (1 or 2):");

            if (subChoice === "1") {
                console.log("\nYou join the secret society, unlocking ancient knowledge but losing your freedom.");
            } else if (subChoice === "2") {
                console.log("\nYou oppose the society, but they hunt you down. The walls close in, and everything goes dark.");
            } else {
                console.log("Invalid choice. Ending story.");
            }
            break;

        case "2":
            console.log("\nThe metropolis is alive with steam-powered automatons and airships. A masked figure offers you a mission.");
            console.log("What do you do?");
            console.log("1. Accept the mission");
            console.log("2. Decline and explore the city");

            const subChoice2 = prompt("Enter your choice (1 or 2):");

            if (subChoice2 === "1") {
                console.log("\nYou accept the mission and retrieve the Chrono Crystal, but it fuses with your body. You become the guardian of time.");
            } else if (subChoice2 === "2") {
                console.log("\nYou decline the mission and explore the city, but you feel a sense of missed opportunity.");
            } else {
                console.log("Invalid choice. Ending story.");
            }
            break;

        default:
            console.log("Invalid choice. Ending story.");
    }

    restartStory();
}

// Path 3: Wait and Observe
function waitAndObserve() {
    console.log("\nYou wait and observe. A mysterious figure emerges from the shadows. It's Cleopatra the Alchemist!");
    console.log("What do you do?");
    console.log("1. Join her");
    console.log("2. Shake your head and walk away");

    const choice = prompt("Enter your choice (1 or 2):");

    switch (choice) {
        case "1":
            console.log("\nCleopatra smiles. 'You have chosen wisely,' she says. Together, you unlock the secrets of the Philosopher's Stone.");
            break;
        case "2":
            console.log("\nYou shake your head and walk away. As you leave, you notice a small vial on the desk. A note reads: 'For the seeker of knowledge.'");
            break;
        default:
            console.log("Invalid choice. Ending story.");
    }

    restartStory();
}

// Function to restart the story
function restartStory() {
    const restartChoice = prompt("\nThe story has ended. Would you like to start again? (yes/no)").toLowerCase();

    if (restartChoice === "yes") {
        startStory();
    } else {
        console.log("Thank you for playing!");
    }
}

// Start the story
startStory();