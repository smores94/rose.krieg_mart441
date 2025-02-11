
// Interactive Story Function
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
                <input type="text" id="user-input" placeholder="Enter your choice (1 or 2)">
                <button onclick="handleInput()">Submit</button>
                <img src="./imgs/corpushermetic.jpg" alt="Alchemy book">
            `;
        } else if (option === 'device') {
            // Handle the 'device' option
            content = `
                <p>You activate the time device...</p>
                <!-- Add more content for this path -->
            `;
        } else if (option === 'wait') {
            // Handle the 'wait' option
            content = `
                <p>You notice something strange...</p>
                <!-- Add more content for this path -->
            `;
        }
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
            // Handle the 'Explore the Workshop' option
            content = `
                <p>You explore the workshop...</p>
                <!-- Add more content for this path -->
            `;
        }
    } else if (storyDiv.innerHTML.includes("Use your vision to predict events")) {
        // Final outcome for predicting events
        content = `
            <p>You predict the future, becoming wealthy beyond all your dreams.
            You are famous, loved, but always a feeling of fear surrounds you.</p>
            <img src="./imgs/family.png" alt="Family">
            <img src="./imgs/potion.png" alt="Magic potion">
        `;
    } else if (storyDiv.innerHTML.includes("Attempt to alter fate")) {
        // Final outcome for altering fate
        content = `
            <p>Your Great-Grandparents were immigrants to Quebec, and always talked about the glory of France. You decide to try and stop the French Revolution. <br><br>
            But oh no...Without the revolution, King Louis XVI, Marie Antoinette, their descendants and the French Monarchy continue to the present day. The French Monarchy helped England instead of the fledgling United States. The Louisiana Purchase never happened. Your Great-grandparents never immigrated.
            <br><br>You see your hand fading in front of you.....as you cease to exist.</p>
            <img src="./imgs/fadinghands.png" alt="hands in workshop">
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
    } else if (option === 'wait') {
        content = `
            <p>In the dimly lit alchemical laboratory, the air is thick with the scent of ancient herbs and the faint hum of arcane machinery. Beakers and flasks bubble with mysterious concoctions, their contents glowing with an otherworldly light. The walls are lined with shelves, each crammed with ancient tomes and strange artifacts, their secrets long forgotten by the world outside.</p>
            <p>1. Reach out your hand to join her</p>
            <p>2. Close your eyes and shake your head</p>
            <input type="text" id="user-input" placeholder="Enter your choice (1 or 2)">
            <button onclick="handleInput()">Submit</button>
            <img src="./imgs/cleothealchemist.jpg" alt="Cleo">
        `;
    } else if (option === '2' && document.getElementById('story').innerHTML.includes("Explore the Workshop")) {
        content = `
            <p>Exploring the workshop, you discover a hidden compartment with blueprints for an airship. Adventure awaits!</p>
            <p>1. Build the airship</p>
            <p>2. Sell the blueprints for gold</p>
            <input type="text" id="user-input" placeholder="Enter your choice (1 or 2)">
            <button onclick="handleInput()">Submit</button>
            <img src="./imgs/airship.jpg" alt="Steampunk airship">
        `;
    } else if (option === '1' && document.getElementById('story').innerHTML.includes("Travel to Victorian London")) {
        content = `
            <p>You arrive in Victorian London, where secret societies seek alchemical knowledge. Will you join them or oppose them?</p>
            <p>1. Join the secret society</p>
            <p>2. Oppose them and uncover their secrets</p>
            <input type="text" id="user-input" placeholder="Enter your choice (1 or 2)">
            <button onclick="handleInput()">Submit</button>
            <img src="./imgs/victlondstmpnk.jpg" alt="Victorian London">
        `;
    } else if (option === '2' && document.getElementById('story').innerHTML.includes("Enter the Steampunk Metropolis")) {
        content = `
            <p>The metropolis is alive with steam-powered automatons and airships. A masked figure offers you a mission. Do you accept?</p>
            <p>1. Accept the mission</p>
            <p>2. Decline and explore the city</p>
            <input type="text" id="user-input" placeholder="Enter your choice (1 or 2)">
            <button onclick="handleInput()">Submit</button>
            <img src="./imgs/maskedman.jpg" alt="Steampunk city">
        `;
    } else {
        content = `<p>Invalid choice. Please try again.</p>`;
    }
    
    // Update the story content
    updateDOM(content);
}

// Function to update the DOM
function updateDOM(content) {
    const storyDiv = document.getElementById('story');
    storyDiv.innerHTML = content;
}

// Restart Function
function restart() {
    score = 0; // Reset score
    startStory();
}

// Function to handle user input
function handleInput() {
    const userInput = document.getElementById('user-input').value;
    choose(userInput);
}

// Function to start the story
function startStory() {
    const storyDiv = document.getElementById('story');
    storyDiv.innerHTML = `
        <p>Welcome to the interactive story! What do you do?</p>
        <p>1. Open the ancient book</p>
        <p>2. Activate the mysterious device</p>
        <p>3. Wait and observe</p>
        <input type="text" id="user-input" placeholder="Enter your choice (1, 2, or 3)">
        <button onclick="handleInput()">Submit</button>
    `;
}