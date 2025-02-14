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
        setTimeout(() => {
            console.log("Removing intro animation from the DOM...");
            introAnimation.remove(); // This removes the element entirely
        }, 1000); // Wait for the fade-out to complete
    }

    if (zoomImage) {
        // Listen for the end of the animation
        zoomImage.addEventListener("animationend", hideIntro);

        // Fallback in case the animationend event doesn't fire
        setTimeout(hideIntro, 4000); // Fallback after 4 seconds
    } else {
        // If zoomImage doesn't exist, call hideIntro immediately
        hideIntro();
    }
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
}
   // Handle initial and subsequent choices
   if (option === 'book') {
    content = `
        <p>As you open the tome, glowing symbols appear. A potion recipe catches your eye. Will you brew it or seek a different path?</p>
        <p>1. Brew the Potion</p>
        <p>2. Explore the Workshop</p>
        <input type="text" id="user-input" placeholder="Enter your choice (1 or 2)">
        <button onclick="handleInput()">Submit</button>
        <img src="./imgs/corpushermetic.jpg" alt="Alchemy book">
    `;

} else if (option === 'Brew the Potion') {
    content = `
        <p>You brew a shimmering elixir. Drinking it, you gain the ability to see into the future! What will you do with this power?</p>
        <p>1. Use your vision to predict events</p>
        <p>2. Attempt to alter fate</p>
        <input type="text" id="user-input" placeholder="Enter your choice (1 or 2)">
        <button onclick="handleInput()">Submit</button>
        <img src="./imgs/potion.png" alt="Magic potion">
    `;

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




        } else if (option === 'Explore the Workshop') {
            content = `
                <p>Exploring the workshop, you discover a hidden compartment with blueprints for an airship. Adventure awaits!</p>
                <p>1. Build the airship</p>
                <p>2. Sell the blueprints for gold</p>
                <input type="text" id="user-input" placeholder="Enter your choice (1 or 2)">
                <button onclick="handleInput()">Submit</button>
                <img src="./imgs/airship.jpg" alt="Steampunk airship">
            `;
        } else if (option === 'Build the airship') {
            score += 20;
            content = `
               <p>You build the airship and sell it.
            <br><br>On the day of its maiden flight, you stand proudly on the deck of the ship, looking down at the city.
            <br><br>All of a sudden you hear an explosion. You look around. Part of the ship is missing and the part you are standing on is in flames. You are in shock, as more explosions rip through the air.
            <br><br>You make your peace.</p>
                   <img src="./imgs/airshipflames.jpg" alt="airship in flames">
                   <button class="choice-btn restart-btn" onclick="restart()">Restart Adventure</button>`;
  `;  

} else if (option === 'Sell the blueprints for gold') {
            score += 20;
            content = <p>You look at the blueprints. For as old as they are, you can see the ship that could be made will be more advanced than anything you have ever seen. <br><br>
            You decide to sell them. As you reach for your pile of gold, you feel a pain in your back.
            <br><br>The buyer looks at you and says "It's not personal mate. But I'm not going to risk competition." He smiles. Everything begins to fade.</p>
                   <img src="./imgs/gold.jpg" alt="gold">
                   <button class="choice-btn restart-btn" onclick="restart()">Restart Adventure</button>`;
                   <img src="./imgs/antikythera.png" alt="time device"></img>

        





        } else if (option === '2') {
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




// final-level choice after choosing 'device
} else if (option === 'wait') {
    content = `<p>In the dimly lit alchemical laboratory, the air is thick with the scent of ancient herbs and the faint hum of arcane machinery. Beakers and flasks bubble with mysterious concoctions, their contents glowing with an otherworldly light. The walls are lined with shelves, each crammed with ancient tomes and strange artifacts, their secrets long forgotten by the world outside.<br><br>
In the center of the room, a cauldron simmers, emitting a swirling mist that dances and twirls in the flickering candlelight. As you watch, the mist begins to coalesce, its ethereal tendrils weaving together to form a shape. Slowly, the outline of a woman emerges, her form becoming more defined with each passing moment.<br><br>
Her presence is both regal and otherworldly, her features sharp and commanding. She is adorned in flowing robes that shimmer like liquid gold, and her eyes, dark and piercing, hold the wisdom of ages. This is Cleopatra, not the queen of ancient Egypt, but Cleopatra the Alchemist, a master of the mystical arts.<br><br>
She steps forward, her movements graceful and deliberate, as if she is both part of the mist and separate from it. Her voice, when she speaks, is a melodic whisper that seems to resonate with the very essence of the laboratory.<br><br>
"Welcome, seeker of knowledge," she intones, her gaze locking onto yours. "You have ventured far to uncover the secrets of the ancients. I am Cleopatra, guardian of the alchemical mysteries. What is it that you seek?"<br><br>
As she speaks, the room seems to come alive, the symbols on the ancient tomes glowing faintly, and the bubbling concoctions in the flasks responding to her presence. The air is charged with a palpable energy, and you can feel the weight of centuries of knowledge pressing in around you.<br><br>
Cleopatra extends a hand, and a small vial materializes in her palm, its contents swirling with a vibrant, iridescent liquid. "This elixir," she explains, "holds the key to transformation, the power to unlock the hidden potential within. But be warned, the path of the alchemist is fraught with peril and requires great wisdom and courage."<br><br>
You stand at the threshold of a journey that promises to reveal the deepest secrets of the universe, guided by one of history's most enigmatic figures. The choice is yours: to embrace the unknown and follow Cleopatra into the mysteries of alchemy, or to turn back and leave these ancient secrets undisturbed.<br><br>
</p>
               <button class="choice-btn" onclick="choose('join her')">You reach out your hand to join her</button>
               <button class="choice-btn" onclick="choose('dreaming')">You close your eyes and shake your head</button>
               <img src="./imgs/cleothealchemist.jpg" alt="Cleo">`;


} else if (option === 'join her') {
    content = `<p>"This," Cleopatra explains, "is the Philosopher's Engine, a device capable of transmuting base materials into pure gold and unlocking the secrets of immortality. But it requires a catalyst, a spark of life to set it in motion."<br><br>
She turns to you, her eyes filled with a mixture of hope and determination. "You have the potential to be that catalyst, to unlock the true power of the Philosopher's Engine. But the path is not without its dangers. Are you prepared to face the trials that lie ahead?"<br><br>
</p>
               <img src="./imgs/philospopherengine.jpg" alt="engine">
               <button class="choice-btn" onclick="choose('catalyst')">You enthusiastically agree!</button>
               <button class="choice-btn" onclick="choose('scary')">Wait, this sounds scary </button>`;
} else if (option === 'catalyst') {
    content = `<p>She turns to you, her eyes filled with a mixture of hope and determination. "You have the potential to be that catalyst, to unlock the true power of the Philosopher's Engine. But the path is not without its dangers. Are you prepared to face the trials that lie ahead?"<br><br>
You nod, your resolve firm. Cleopatra smiles, a look of pride and anticipation crossing her features. "Very well," she says. "Let us begin."<br><br>
With a series of precise movements, Cleopatra activates the Philosopher's Engine, the gears and pistons whirring to life. The crystalline sphere begins to glow brighter, casting a warm, golden light throughout the chamber. You can feel the energy building, a palpable force that seems to resonate with your very soul.<br><br>
As the process unfolds, Cleopatra guides you through the intricate steps of the alchemical transformation, her voice a constant source of reassurance and wisdom. You work together, your hands moving in perfect harmony as you manipulate the arcane machinery and channel the mystical energies.<br><br>
Hours pass in a blur of light and sound, the chamber filled with the hum of the Philosopher's Engine and the glow of the crystalline sphere. Finally, with a triumphant cry, Cleopatra completes the final step, the apparatus shuddering to a halt as the transformation is complete.<br><br>
Before you, where once there was only base material, now lies a gleaming ingot of pure gold, its surface shimmering with an otherworldly light. Cleopatra turns to you, her eyes filled with pride and gratitude.<br><br>
"You have done well," she says, her voice filled with warmth. "Together, we have unlocked the secrets of the ancients and harnessed the true power of alchemy. The journey is far from over, but you have proven yourself worthy of the path that lies ahead."<br><br>
As you stand together in the golden light of the Philosopher's Engine, you feel a sense of accomplishment and wonder, knowing that you have taken the first steps on a journey that will change your life forever.<br><br>
</p>
               <img src="./imgs/duo.jpg" alt="duo">
                <button class="choice-btn restart-btn" onclick="restart()">Restart Adventure</button>`;
} else if (option === 'scary') {
    content = `<p>You feel a chill run down your spine as Cleopatra's words sink in. The grandeur of the alchemical laboratory, the shimmering elixirs, and the ancient machinery all seem to take on a more sinister tone. The flickering candlelight casts eerie shadows on the walls, and the hum of the arcane devices grows louder, more menacing.<br><br>
Cleopatra's eyes, once filled with wisdom and warmth, now seem to bore into your soul with an unsettling intensity. "The path of the alchemist is fraught with peril," she repeats, her voice echoing in the chamber. "But you, my dear, have the potential to unlock the true power of the Philosopher's Stone." She glances down at a book, you can barely see the title, it looks like “Chrysopoeia of Cleopatra”<br><br>
A sense of dread washes over you. The Philosopher's Stone, the legendary artifact said to grant immortality and turn base metals into gold, suddenly feels like a curse rather than a blessing. You take a step back, your heart pounding in your chest.<br><br>
Cleopatra's smile fades, replaced by a look of cold determination. "There is no turning back now," she says, her voice a whisper of menace. "You will be the catalyst, the spark that ignites the transformation."<br><br>
</p>
               <img src="./imgs/thechrysopoeiaofcleopatr.jpg" alt="Chrysopoeia of Cleopatra">
               <button class="choice-btn" onclick="choose('death')">Continue</button>
            <button class="choice-btn" onclick="choose('desperate')">A Desperate Plan Forms...</button>`;


            } else if (option === 'desperate') {
    content = `<p>Your mind races, searching for a way out. The room feels smaller, the air thicker. Desperation claws at your thoughts. In a moment of sheer panic, you draw your dagger, the blade glinting ominously in the dim light.<br><br>
Cleopatra's eyes widen in surprise, but she doesn't move. "You don't have the courage," she taunts, her voice steady.<br><br>
But you do. With a swift, decisive motion, you plunge the dagger into her chest. Her eyes lock onto yours, a mixture of shock and betrayal. She gasps, a sound that will haunt you forever, and collapses to the ground.<br><br>
You stand there, trembling, the dagger still in your hand. The reality of what you've done crashes over you like a tidal wave. Cleopatra, the powerful alchemist, lies lifeless at your feet. The room is eerily silent, save for the sound of your ragged breathing.<br><br>
You drop the dagger, your hands shaking uncontrollably. Tears blur your vision as you stumble backward, your mind reeling. The Philosopher's Stone feels heavier in your pocket, a constant reminder of the irreversible act you've committed.<br><br>
You sink to the floor, overwhelmed by a crushing sense of sorrow and guilt. The weight of your actions presses down on you, and you can't help but wonder if you will ever find peace again.<br><br>
</p>
               <img src="./imgs/blood.jpg" alt="Death of Cleopatra">
             <button class="choice-btn restart-btn" onclick="restart()">Restart Adventure</button>`;




} else if (option === 'death') {
    content = `<p>Before you can react, the room begins to shift and change. The walls close in, the gears and pistons of the Philosopher's Engine whirring to life with a deafening roar. The crystalline sphere at the heart of the apparatus glows brighter, casting an eerie light that fills the chamber.<br><br>
You try to move, to escape, but your body feels heavy, rooted to the spot. Cleopatra steps forward, her hands weaving intricate patterns in the air. You feel a strange energy envelop you, pulling you towards the center of the room.<br><br>
"The Philosopher's Stone requires a sacrifice," Cleopatra intones, her voice cold and unyielding. "Your essence, your very being, will fuel its creation."<br><br>
Panic sets in as you realize the horrifying truth. Your body, your life, is to be consumed by the alchemical process. The crystalline sphere pulses with a hungry light, and you feel your strength ebbing away, drawn into the heart of the machine.<br><br>
The pain is excruciating, a searing agony that tears through your very soul. Your vision blurs, and the world around you fades into darkness. The last thing you see is Cleopatra's face, her expression one of grim satisfaction.<br><br>
As your consciousness slips away, you become aware of a strange transformation. Your body dissolves into pure energy, merging with the glowing sphere. The Philosopher's Engine shudders and groans, the gears grinding as the alchemical process reaches its climax.<br><br>
In a blinding flash of light, the transformation is complete. The Philosopher's Stone, a perfect, gleaming gem, lies at the heart of the apparatus. Cleopatra steps forward, her eyes gleaming with triumph.<br><br>
"You have served your purpose," she whispers, her voice filled with a dark satisfaction. "The Philosopher's Stone is mine."<br><br>
The chamber falls silent, the hum of the machinery fading into nothingness. The alchemical laboratory, once a place of wonder and discovery, now feels like a tomb. And you, the catalyst, are forever bound to the stone, your essence trapped in its cold, unyielding heart.
</p>
               <img src="./imgs/triumph.jpg" alt="triumph of Cleopatra">
               <button class="choice-btn restart-btn" onclick="restart()">Restart Adventure</button>`;
} else if (option === 'dreaming') {
    content = `<p>But the doubt is too strong, the line between dream and reality too blurred. The golden light dims, the hum of the Philosopher's Engine fades, and the chamber begins to dissolve into darkness. You close your eyes, willing yourself to wake up, to escape this strange, dreamlike state.<br><br>
When you open your eyes again, you find yourself back in the dimly lit workshop, the ancient alchemical tome and brass time device still humming with energy on the desk. The mist has dissipated, and Cleopatra is nowhere to be seen. The room is silent, save for the faint ticking of a clock in the corner.<br><br>
You take a deep breath, trying to steady your racing heart. Was it all a dream? A figment of your imagination? The memory of Cleopatra's presence lingers, her words echoing in your mind. You can't shake the feeling that something profound has happened, that you have glimpsed a world beyond the ordinary.<br><br>
As you gather your thoughts, you notice a small vial on the desk, filled with a vibrant, iridescent liquid. A note lies beside it, written in an elegant, flowing script: "For the seeker of knowledge. Remember, the journey is never truly over."<br><br>
You pick up the vial, the liquid inside swirling with an otherworldly light. Perhaps it was a dream, or perhaps it was something more. Either way, the path of the alchemist is now yours to follow, and the mysteries of the ancients await.<br><br>
</p>
               <img src="./imgs/vialtheend.jpg" alt="vial">
                 <button class="choice-btn restart-btn" onclick="restart()">Restart Adventure</button>`;
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