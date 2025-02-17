// Variables
let score = 0;

// Function to handle user input
function handleInput() {
    const userInput = document.getElementById('user-input').value.trim().toLowerCase();
    let option = userInput; // Use the raw input for nested choices

    // Map initial choices to options
    switch (userInput) {
        case '1':
            option = 'dive';
            break;
        case '2':
            option = 'jungle';
            break;
        case '3':
            option = 'map';
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
    if (option === 'dive') {
        content += `
            <p>You dive into the ocean and discover the ruins of Atlantis. A glowing artifact catches your eye. What will you do?</p>
            <p>1. Take the artifact.</p>
            <p>2. Leave it and explore further.</p>
            <input type="text" id="user-input" placeholder="Enter your choice (1 or 2)">
            <button onclick="handleInput()">Submit</button>
            <img src="./imgs/atlantis-ruins.jpg" alt="Atlantis Ruins">
        `;
    } else if (option === 'jungle') {
        content += `
            <p>You venture into the jungle and find an ancient temple. Inside, you see a mysterious door. What will you do?</p>
            <p>1. Open the door.</p>
            <p>2. Ignore it and search for other clues.</p>
            <input type="text" id="user-input" placeholder="Enter your choice (1 or 2)">
            <button onclick="handleInput()">Submit</button>
            <img src="./imgs/jungle-temple.jpg" alt="Jungle Temple">
        `;
    } else if (option === 'map') {
        content += `
            <p>You consult the ancient map and discover a hidden cave. Inside, you find a chest. What will you do?</p>
            <p>1. Open the chest.</p>
            <p>2. Leave it and search for more clues.</p>
            <input type="text" id="user-input" placeholder="Enter your choice (1 or 2)">
            <button onclick="handleInput()">Submit</button>
            <img src="./imgs/hidden-cave.jpg" alt="Hidden Cave">
        `;
    } else if (option === 'Take the artifact') {
        content += `
            <p>You take the artifact, and it begins to glow brightly. Suddenly, the ruins start to collapse! You barely escape with your life.</p>
            <img src="./imgs/collapsing-ruins.jpg" alt="Collapsing Ruins">
            <button onclick="restart()">Restart Adventure</button>
        `;
    } else if (option === 'Leave it and explore further') {
        content += `
            <p>You leave the artifact and explore further. You find a hidden chamber filled with gold and jewels. You've found the treasure of Atlantis!</p>
            <img src="./imgs/treasure-chamber.jpg" alt="Treasure Chamber">
            <button onclick="restart()">Restart Adventure</button>
        `;
    } else if (option === 'Open the door') {
        content += `
            <p>You open the door and are greeted by a trap! The floor collapses, and you fall into a pit. Game over.</p>
            <img src="./imgs/trap-door.jpg" alt="Trap Door">
            <button onclick="restart()">Restart Adventure</button>
        `;
    } else if (option === 'Ignore it and search for other clues') {
        content += `
            <p>You ignore the door and find a hidden passage. It leads to a room filled with ancient artifacts. You've found the treasure of Atlantis!</p>
            <img src="./imgs/hidden-passage.jpg" alt="Hidden Passage">
            <button onclick="restart()">Restart Adventure</button>
        `;
    } else if (option === 'Open the chest') {
        content += `
            <p>You open the chest and find a map to the treasure of Atlantis. You follow the map and discover the treasure!</p>
            <img src="./imgs/treasure-map.jpg" alt="Treasure Map">
            <button onclick="restart()">Restart Adventure</button>
        `;
    } else if (option === 'Leave it and search for more clues') {
        content += `
            <p>You leave the chest and search for more clues. You find nothing and are forced to return empty-handed.</p>
            <img src="./imgs/empty-handed.jpg" alt="Empty Handed">
            <button onclick="restart()">Restart Adventure</button>
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

// Start Story Function
function startStory() {
    const storyDiv = document.getElementById('story');
    storyDiv.innerHTML = `
        <p>Welcome to the adventure! You are an explorer searching for the lost treasure of Atlantis. Choose your path wisely.</p>
        <p>1. Dive into the ocean to search for the ruins.</p>
        <p>2. Explore the nearby jungle for clues.</p>
        <p>3. Consult the ancient map in your possession.</p>
        <input type="text" id="user-input" placeholder="Enter your choice (1, 2, or 3)">
        <button onclick="handleInput()">Submit</button>
    `;
}

// Initialize the story
startStory();