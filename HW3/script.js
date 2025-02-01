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
// Interactive Story Function
function choose(option) {
    const storyDiv = document.getElementById('story');
    let content = "";

    // Example of concatenation and addition
    let introText = "You chose: " + option + ". ";
    content += `<p>${introText}</p>`;

    if (option === 'book') {
        score += 10;
        content = `<p>As you open the tome, glowing symbols appear. A potion recipe catches your eye. Will you brew it or seek a different path?</p>
                   <button class="choice-btn" onclick="choose('brew')">Brew the Potion</button>
                   <button class="choice-btn" onclick="choose('explore')">Explore the Workshop</button>
                   <img src="./imgs/corpushermetic.jpg" alt="Alchemy book">`;
    } else if (option === 'device') {
        score += 20;
        content = `<p>You activate the time device! A vortex opens, offering two choices: Victorian London or a futuristic steampunk city.</p>
                   <button class="choice-btn" onclick="choose('victorian')">Travel to Victorian London</button>
                   <button class="choice-btn" onclick="choose('steampunk')">Enter the Steampunk Metropolis</button>
                   <img src="./imgs/antikythera.png" alt="time device">`;
                   
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
You stand there, trembling, the dagger still in your hand. The reality of what you've done crashes over you like a tidal wave. Cleopatra, the powerful queen, lies lifeless at your feet. The room is eerily silent, save for the sound of your ragged breathing.<br><br>
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
    } else if (option === 'brew') {
        content = `<p>You brew a shimmering elixir. Drinking it, you gain the ability to see into the future! What will you do with this power?</p>
                   <img src="./imgs/potion.png" alt="Magic potion">
                   <button class="choice-btn" onclick="choose('predict')">Use your vision to predict events</button>
                   <button class="choice-btn" onclick="choose('alter')">Attempt to alter fate</button>`;
    } else if (option === 'explore') {
        content = `<p>Exploring the workshop, you discover a hidden compartment with blueprints for an airship. Adventure awaits!</p>
                   <img src="./imgs/airship.jpg" alt="Steampunk airship">
                   <button class="choice-btn" onclick="choose('build')">Build the airship</button>
                   <button class="choice-btn" onclick="choose('sell')">Sell the blueprints for gold</button>`;
    } else if (option === 'victorian') {
        content = `<p>You arrive in Victorian London, where secret societies seek alchemical knowledge. Will you join them or oppose them?</p>
                   <img src="./imgs/victlondstmpnk.jpg" alt="Victorian London">
                   <button class="choice-btn" onclick="choose('join')">Join the secret society</button>
                   <button class="choice-btn" onclick="choose('oppose')">Oppose them and uncover their secrets</button>`;
    } else if (option === 'steampunk') {
        content = `<p>The metropolis is alive with steam-powered automatons and airships. A masked figure offers you a mission. Do you accept?</p>
                   <img src="./imgs/maskedman.jpg" alt="Steampunk city">
                   <button class="choice-btn" onclick="choose('accept')">Accept the mission</button>
                   <button class="choice-btn" onclick="choose('decline')">Decline and explore the city</button>`;
    } else if (option === 'accept') {
        content = `<p>You nod, curiosity and excitement bubbling within you. 
            The masked figure's eyes gleam with approval as he hands you a brass 
            key, intricately designed with gears and cogs. "This key," 
            he whispers, "unlocks the heart of the city. You must find 
            the Clockwork Cathedral and retrieve the Chrono Crystal before 
            the clock strikes midnight."<br><br>

With a flourish of his cloak, he vanishes into the steam-filled night.
You set off, navigating the bustling streets filled with steam-powered 
carriages and towering airships. Automatons tip their hats as you pass,
their gears whirring in polite acknowledgment. The city pulses with life,
a symphony of hissing steam and clanking metal.<br><br>

Reaching the Clockwork Cathedral, you insert the key into a hidden lock. The massive doors creak open, revealing a labyrinth of gears and pistons. You race against time, dodging mechanical guardians and solving intricate puzzles. Finally, you reach the altar, where the Chrono Crystal glows with an ethereal light. As you grasp it, the city seems to hold its breath, waiting for the dawn of a new era.</p>
                   <img src="./imgs/clockworkcrystal.jpg" alt="clockwork crystal">
                   <button class="choice-btn restart-btn" onclick="restart()">Restart Adventure</button>`;
    } else if (option === 'decline') {
        content = `<p>You shake your head, the weight of the unknown too great to bear. The masked figure's eyes narrow, but he nods in understanding. <br><br>"Very well," he says, his voice a blend of disappointment and respect. "But know this: the city will remember your choice."<br><br>

As he disappears into the mist, you turn away, the bustling metropolis still alive with its mechanical wonders. You wander the streets, watching airships soar above and automatons go about their duties. The city is a marvel, but you can't shake the feeling that you've missed out on something extraordinary.<br><br>

Suddenly, a small automaton scurries up to you, its eyes glowing with a soft blue light. It hands you a tiny, intricately crafted music box. As you wind it up, a haunting melody fills the air, and you realize that even in your refusal, the city has gifted you a piece of its magic. The music box's tune lingers in your mind, a reminder of the adventure that could have been.</p>
                   <img src="./imgs/notoadventure.jpg" alt="no to adventure">
                   <button class="choice-btn restart-btn" onclick="restart()">Restart Adventure</button>`;
    } else if (option === 'predict') {
        content = `<p>You predict the future, becoming wealthy beyond all your dreams. 
            You are famous, loved, but always a feeling of fear surrounds you.</p>
                   <img src="./imgs/family.png" alt="Family">
               <button class="choice-btn restart-btn" onclick="restart()">Restart Adventure</button>`;
    } else if (option === 'alter') {
        content = `<p>Your Great-Grandparents were immigrants to Quebec, and always talked about the glory of France. You decide to try and stop the French Revolution. <br><br>
            But oh no...Without the revolution, King Louis XVI, Marie Antoinette, their descendants and the French Monarchy continue to the present day. The French Monarchy helped England instead of the fledgling United States. The Louisiana Purchase never happened. Your Great-grandparents never immigrated. 
            <br><br>You see your hand fading in front of you.....as you cease to exist.</p>
                   <img src="./imgs/fadinghands.png" alt="hands in workshop">
                 <button class="choice-btn restart-btn" onclick="restart()">Restart Adventure</button>`;
    } else if (option === 'build') {
        content = `<p>You build the airship and sell it. 
            <br><br>On the day of its maiden flight, you stand proudly on the deck of the ship, looking down at the city. 
            <br><br>All of a sudden you hear an explosion. You look around. Part of the ship is missing and the part you are standing on is in flames. You are in shock, as more explosions rip through the air. 
            <br><br>You make your peace.</p>
                   <img src="./imgs/airshipflames.jpg" alt="airship in flames">
                   <button class="choice-btn restart-btn" onclick="restart()">Restart Adventure</button>`;
    } else if (option === 'sell') {
        content = `<p>You look at the blueprints. For as old as they are, you can see the ship that could be made will be more advanced than anything you have ever seen. <br><br>
            You decide to sell them. As you reach for your pile of gold, you feel a pain in your back. 
            <br><br>The buyer looks at you and says "It's not personal mate. But I'm not going to risk competition." He smiles. Everything begins to fade.</p>
                   <img src="./imgs/gold.jpg" alt="gold">
                   <button class="choice-btn restart-btn" onclick="restart()">Restart Adventure</button>`;
    } else if (option === 'join') {
        content = `<p>The Invitation<br>
London, 1887. <br><br>
The air is thick with soot and secrecy, the gas lamps flickering in defiance of the smog. You tread carefully through the damp alleyways, your boots echoing against cobblestone streets slick with evening mist. The letter in your coat pocket is sealed with black wax, stamped with an insignia you do not recognize—a serpent entwined with a dagger. 
It had arrived without explanation, slipped under your door as if by ghostly hands.<br><br>
You reach the unmarked door as instructed. A single knock. A pause. 
<br><br>Then, it creaks open just enough to reveal the glint of watchful eyes. No words are spoken. You step inside.<br><br>
The room beyond is dimly lit by candelabras dripping wax like blood. Hooded figures stand in a circle, their faces obscured, their eyes burning through the shadows. The scent of old books, ink, and something metallic—like rust or dried blood—lingers in the air.<br><br>
A man steps forward. His voice is velvet over steel.<br><br>
"You stand at the threshold of something far greater than yourself. The world outside is blind, shackled by ignorance. But we... we see beyond the veil. We unearth truths long buried. We shape the fate of nations from the darkness in which we dwell."<br><br>
He gestures to a table draped in crimson cloth. Upon it, a quill and a ledger, its pages aged and yellowed. Names fill its lines—some crossed out, others stained, perhaps with ink… or something else.<br><br>
"One mark, and you are bound to us. No king, no parliament, no god shall own you. Only the pursuit of power, knowledge, and the unseen forces that weave the fabric of this world. But beware—once the ink dries, there is no turning back."<br><br>
The candlelight wavers. The air grows heavy. Behind you, the door has closed.</p>
                   <img src="./imgs/letter.jpg" alt="letter">
                   <button class="choice-btn" onclick="choose('yes')">Lift the veil</button>
                   <button class="choice-btn" onclick="choose('no')">You change your mind. You are a person of reason. This makes no sense you realize.</button>`;
    } else if (option === 'oppose') {
        content = `<p>The Invitation<br>London, 1887. <br><br>
You take a step back, defiance burning in your eyes. "I will not join you," you declare, your voice steady despite the fear gnawing at your insides. The man's smile vanishes, replaced by a cold, calculating stare.<br><br>
"Very well," he says, his voice a whisper of menace. "But know this: those who oppose us do not leave unscathed."<br><br>
The hooded figures close in, their shadows stretching like dark tendrils. The room grows colder, the air thick with an oppressive silence. Suddenly, the candles flicker and extinguish, plunging you into darkness. You hear the hiss of steam and the clank of metal as hidden mechanisms spring to life.<br><br>
A chilling voice echoes through the void. "You have chosen poorly. Now, face the consequences."<br><br>
The floor beneath you shifts, and you plummet into a hidden chamber below. The walls are lined with gears and pistons, all moving in a sinister, synchronized dance. The only light comes from the eerie glow of luminescent tubes filled with a strange, bubbling liquid.
You scramble to your feet, but the walls begin to close in, the gears grinding ominously. Panic sets in as you realize there's no escape. The air grows thin, and the sound of your own heartbeat drowns out everything else.
<br><br>Just as you think all hope is lost, a hidden door creaks open, revealing a narrow passage. You dash through it, the walls scraping your shoulders. The passage twists and turns, leading you deeper into the bowels of the city.
Finally, you emerge into a forgotten alley, the night air biting at your skin. You look back, but the passage has vanished, leaving only a solid brick wall. The city looms around you, its steam-powered heart beating with a relentless rhythm.
<br><br>You know now that the secret society will stop at nothing to hunt you down. The shadows seem to whisper your name, and every corner holds a new threat. The game has begun, and you are the prey.</p>
                   <img src="./imgs/wallsclose.jpg" alt="walls">
                   <button class="choice-btn restart-btn" onclick="restart()">Restart Adventure</button>`;
    } else if (option === 'yes') {
        content = `<p>You take a deep breath, feeling the weight of the moment. With a steady hand, you dip the quill into the ink and sign your name in the ledger. 
            <br><br>The hooded figures murmur in approval, their voices a low, harmonious chant. The man smiles, a glint of satisfaction in his eyes.
<br><br>"Welcome," he says, "to the Order of the Serpent. Your journey into the arcane begins now."<br><br>
As the ink dries, you feel a strange warmth spread through your body, as if ancient knowledge is being etched into your very soul. The room seems to shift, the shadows deepening, and you realize that you have crossed a threshold into a world hidden from ordinary sight.</p>
                   <img src="./imgs/cult.jpg" alt="cult">
                   <button class="choice-btn restart-btn" onclick="restart()">Restart Adventure</button>`;
    } else if (option === 'no') {
        content = `<p>You step back, shaking your head. "I cannot," you say, your voice firm despite the tremor in your heart. The man's smile fades, replaced by a look of cold disappointment.<br><br>
"Very well," he replies, his tone icy. "But know this: once you leave, you can never return."
The hooded figures part, creating a path to the door. As you turn to leave, the air grows colder, and the shadows seem to reach out, as if reluctant to let you go. 
<br><br>You step outside, the door closing behind you with a final, echoing thud. The alleyway feels darker, the mist thicker, and you can't shake the feeling that you have just walked away from a destiny that will forever remain a mystery.<br><br>Aghhhh! Your stomach cramps, your heart pounds, your vision begins to go black...</p>
                   <img src="./imgs/walkingaway.jpg" alt="walking away">
                   <button class="choice-btn restart-btn" onclick="restart()">Restart Adventure</button>`;
    }

    // Update the DOM
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
    document.getElementById('story').innerHTML = `
        <p>You awaken in a dimly lit workshop, gears whirring around you. On the desk, an ancient alchemical tome and a brass time device hum with energy.</p>
        <button class="choice-btn" onclick="choose('book')">Read the Alchemical Tome</button>
        <button class="choice-btn" onclick="choose('device')">Activate the Time Device</button>
        <button class="choice-btn" onclick="choose('wait')">Wait, what is that?</button>
    `;
}
