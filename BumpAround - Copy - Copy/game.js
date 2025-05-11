// Game Constants
const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 800;
const PLAYER_SIZE = 40;
const SCORE_INCREMENT = 10;

const OBSTACLE_PENALTY = 5;
const COLLECTIBLE_BASE_SPEED = .4;
const KNOCKBACK_FORCE = 0.5;
const FLASH_DURATION = 200;

const PHASE1_TIME_LIMIT = 60000;
const PHASE2_TIME_LIMIT = 70000;
const PHASE3_TIME_LIMIT = 90000;
const PHASE4_TIME_LIMIT = 130000;
const PHASE5_TIME_LIMIT = 180000;
const PHASE6_TIME_LIMIT = 200000;
const PHASE7_TIME_LIMIT = 220000;
const PHASE8_TIME_LIMIT = 250000;
const SHIELD_DURATION = 20000; // 20 seconds
const WARNING_COOLDOWN = 10000; // 10 seconds cooldown
const PHASE1_COUNT = 5;

const PHASE2_COUNT = 15; // Number of phase 2 collectibles needed to win
const PHASE3_COUNT = 20; // Number of phase 3 collectibles needed to win
const PHASE4_COUNT = 25; // Number of phase 4 collectibles needed to win
const PHASE5_COUNT = 30; // Number of phase 5 collectibles needed to win
const PHASE6_COUNT = 40; // Number of phase 5 collectibles needed to win
const PHASE7_COUNT = 50; // Number of phase 5 collectibles needed to win
const PHASE8_COUNT = 60; // Number of phase 5 collectibles needed to win
const PHASE1_SCORE_REQUIRED = 150;
const PHASE2_SCORE_REQUIRED = 450;
const PHASE3_SCORE_REQUIRED = 800;
const PHASE4_SCORE_REQUIRED = 1500;
const PHASE5_SCORE_REQUIRED = 2000;
const PHASE6_SCORE_REQUIRED = 3000;
const PHASE7_SCORE_REQUIRED = 4000;
const PHASE8_SCORE_REQUIRED = 5500;  // Final win condition
const unlockedPhases = new Set();





// Game Variables

let gameInitialized = false;
let gameStarted = false;
//let unlockedPhases = new Set();
let lastWarningTime = 0;
let canvas;
let ctx;
let obstacles = [];
let collectibles = [];
let player;
let keys = {};
let score = 0;
let currentPhase = 1;
let phase1Collected = 0;
let phase2Collected = 0; 
let phase3Collected = 0; 
let phase4Collected = 0; 
let phase5Collected = 0; 
let phaseStartTime;
let timeLeft;
let timeWarningPlayed = false;
let scale = 1;
let canvasOffsetX = 0;
let canvasOffsetY = 0;
let phaseUnlockMessage = '';
let phaseUnlockTimer = 0;
let dangerObstacles = [];
let gameOver = false;
let ghostPlayer = null;
let phase6Collected = 0;
let phase7Collected = 0;
let phase8Collected = 0;
let fairyParticles = [];
let shieldEndTime = 0;
let shieldActive = false;
let shieldStartTime = 0;
let darkOverlayActive = false;



// Sound objects
const sounds = {
    collect: null,
    collect2: null,
    treasure: null,
    phase: null,
    warning: null,
    obstacle: null,
    level: null,
    lose: null,
    win: null
};


function enterPhase(phaseNum, spawnCount) {
  // 1) guard so it only ever runs once
  if (unlockedPhases.has(phaseNum)) return;
  unlockedPhases.add(phaseNum);

  // 2) update global phase state
  currentPhase = phaseNum;
  phaseStartTime = Date.now();
  console.log(`🚀 Phase ${phaseNum} start — spawning ${spawnCount}`);

  // 3) clear previous collectibles if you want a fresh field
  collectibles = [];

  // 4) spawn exactly spawnCount items
  spawnCollectibles(phaseNum, spawnCount);

  // 5) play level-up sound
  if (sounds.level) sounds.level.play();
}



let emberParticles = [];
const MAX_PARTICLES = 40;

function createEmberParticle() {
    return {
        x: Math.random() * CANVAS_WIDTH,
        y: CANVAS_HEIGHT + 10,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: 0.5 + Math.random() * 1.5,
        radius: 2 + Math.random() * 2,
        life: 60 + Math.floor(Math.random() * 60),
        opacity: 0.3 + Math.random() * 0.7
    };
}

function activateShieldBonus() {
    shieldActive = true;
    shieldEndTime = Date.now() + 20000; // 20 seconds
    console.log("🛡️ Shield activated!");

    // Optional sound or effect
    if (sounds.shieldhit) {
        sounds.shieldhit.currentTime = 0;
        sounds.shieldhit.play();
    }
}


// Fairy twinkle particles
function updateAndDrawFairyParticles() {
    if (currentPhase === 7) {
        if (fairyParticles.length < 30 && Math.random() < 0.3) {
            fairyParticles.push({
                x: Math.random() * CANVAS_WIDTH,
                y: Math.random() * CANVAS_HEIGHT,
                size: 16 + Math.random() * 8,
                life: 100 + Math.random() * 50,
                symbol: Math.random() < 0.5 ? '✨' : '🧚'
            });
        }

        ctx.save();
        ctx.font = '18px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        for (let i = fairyParticles.length - 1; i >= 0; i--) {
            const p = fairyParticles[i];
            ctx.globalAlpha = Math.max(0, p.life / 150);
            ctx.fillText(p.symbol, p.x, p.y);
            p.y -= 0.3;
            p.life--;
            if (p.life <= 0) fairyParticles.splice(i, 1);
        }

        ctx.restore();
        ctx.globalAlpha = 1;
    }
}

function unlockAudio() {
    for (const key in sounds) {
        const sound = sounds[key];
        if (sound) {
            sound.muted = true;
            sound.play().then(() => {
                sound.pause();
                sound.currentTime = 0;
                sound.muted = false;
            }).catch((err) => {
                console.warn(`Unlock failed: ${key}`, err);
            });
        }
    }
}


// Game Classes
class GameObject {
    constructor(x, y, width, height, type) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type;
    }

    draw() {
        ctx.fillStyle = 'gray';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    collidesWith(other) {
        return this.x < other.x + other.width &&
               this.x + this.width > other.x &&
               this.y < other.y + other.height &&
               this.y + this.height > other.y;
    }
}

class Obstacle extends GameObject {
    constructor(x, y, width, height, type) {
        super(x, y, width, height, type);
        this.color = this.getRandomVariantColor(type);
    }

    getRandomVariantColor(type) {
        const colorVariations = {
            'tree': ['#2E8B57', '#3CB371', '#228B22', '#008000', '#006400'],
            'rock': ['#696969', '#808080', '#A9A9A9', '#778899', '#708090'],
            'pond': ['#1E90FF', '#00BFFF', '#87CEFA', '#4682B4', '#5F9EA0'],
            'fence': ['#8B4513', '#A0522D', '#D2691E', '#CD853F', '#B8860B'],
            'house': ['#CD5C5C', '#DC143C', '#B22222', '#8B0000', '#FF0000']
        };

        const variants = colorVariations[type] || ['#A9A9A9'];
        return variants[Math.floor(Math.random() * variants.length)];
    }

    draw() {
        if (currentPhase === 6 && this.type !== 'danger') {
            const grays = ['#111', '#333', '#666', '#aaa', '#ddd', '#fff'];
            ctx.fillStyle = grays[Math.floor(Math.random() * grays.length)];
        } else {
            ctx.fillStyle = this.color;
        }

        ctx.fillRect(this.x, this.y, this.width, this.height);

        ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.lineWidth = 2;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
        ctx.shadowBlur = 5;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        ctx.shadowBlur = 0;

        if (currentPhase !== 6) {
            this.addObstacleDetails();
        }
        
    }

    addObstacleDetails() {
        switch (this.type) {
            case 'tree':
                ctx.fillStyle = '#5D4037';
                ctx.fillRect(
                    this.x + this.width / 2 - 5,
                    this.y + this.height - 20,
                    10,
                    20
                );
                break;

            case 'house':
                ctx.fillStyle = '#8B0000';
                ctx.beginPath();
                ctx.moveTo(this.x, this.y + 30);
                ctx.lineTo(this.x + this.width / 2, this.y);
                ctx.lineTo(this.x + this.width, this.y + 30);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#5D4037';
                ctx.fillRect(
                    this.x + this.width / 2 - 15,
                    this.y + this.height - 40,
                    30,
                    40
                );
                break;

            case 'fence':
                ctx.fillStyle = '#5D4037';
                const postCount = Math.floor(this.width / 30);
                for (let i = 0; i < postCount; i++) {
                    ctx.fillRect(
                        this.x + (i * (this.width / postCount)) + 5,
                        this.y,
                        5,
                        this.height
                    );
                }
                break;
        }
    }
}


class DangerObstacle extends Obstacle {
    constructor(x, y, width, height) {
        super(x, y, width, height, 'danger');
        this.speedX = (Math.random() - 0.5) * 4;
        this.speedY = (Math.random() - 0.5) * 4;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Bounce off canvas edges
        if (this.x < 0 || this.x > CANVAS_WIDTH - this.width) {
            this.speedX *= -1;
        }
        if (this.y < 0 || this.y > CANVAS_HEIGHT - this.height) {
            this.speedY *= -1;
        }
    }

    draw() {
        let symbol = '☠️'; // Default
        let fillColor = '#8B0000'; // Default red

        // 🎭 Phase-specific styling
        if (currentPhase === 6) {
            const grays = ['#111', '#333', '#666', '#aaa', '#fff'];
            fillColor = grays[Math.floor(Math.random() * grays.length)];
            symbol = '🪞'; // Mirror shard
        } else if (currentPhase === 7) {
            fillColor = '#d6b3ff'; // Light purple
            symbol = '🪽'; // Fairy wing
        } else if (currentPhase === 8) {
            const apocalypseColors = ['#4a4a4a', '#556b2f', '#f0e68c', '#2f4f4f', '#696969'];
            fillColor = apocalypseColors[Math.floor(Math.random() * apocalypseColors.length)];
            symbol = '🪦'; // Tombstone
        }

        // Draw obstacle body
        ctx.fillStyle = fillColor;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Draw emoji symbol
        ctx.fillStyle = 'white';
        ctx.font = `${this.width * 0.6}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(symbol, this.x + this.width / 2, this.y + this.height / 2);
    }
}

function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
}



class Collectible extends GameObject {
    constructor(x, y, width, height, type, value, phase = 1) {
        super(x, y, width, height, type);
        this.value = value;
        this.collected = false;
        this.phase = phase;
        this.direction = Math.random() * Math.PI * 2;
        this.speed = COLLECTIBLE_BASE_SPEED + (value / 40); // Higher value = faster
        this.bounceCount = 0;
    }

    

    update() {
        if (this.collected) return;
        
        // Random direction changes (more frequent when bouncing)
        if (Math.random() < (this.bounceCount > 0 ? 0.1 : 0.05)) {
            this.direction += (Math.random() - 0.5) * Math.PI/2;
        }
        
        // Move in current direction
        this.x += Math.cos(this.direction) * this.speed;
        this.y += Math.sin(this.direction) * this.speed;
        
        // Bounce off walls with direction change
        let bounced = false;
        if (this.x < 0) {
            this.x = 0;
            this.direction = Math.PI - this.direction;
            bounced = true;
        }
        if (this.x > CANVAS_WIDTH - this.width) {
            this.x = CANVAS_WIDTH - this.width;
            this.direction = Math.PI - this.direction;
            bounced = true;
        }
        if (this.y < 0) {
            this.y = 0;
            this.direction = -this.direction;
            bounced = true;
        }
        if (this.y > CANVAS_HEIGHT - this.height) {
            this.y = CANVAS_HEIGHT - this.height;
            this.direction = -this.direction;
            bounced = true;
        }
        
        if (bounced) {
            this.bounceCount = 5; // Temporary speed boost after bouncing
        } else if (this.bounceCount > 0) {
            this.bounceCount--;
        }
    }

    draw() {
        if (this.collected || this.phase > currentPhase) return;
    
   
    
        // Set color theme for collectibles
        const colors = {
            'coin': '#FFD700',
            'gem': '#FF1493',
            'star': '#00BFFF',
            'diamond': '#00FF7F',
            'crown': '#9370DB'
        };
    
        let drawSize = this.width;
    
        // Phase 6 mirror world visual behavior: shrink when close to player
        if (currentPhase === 6 && player) {
            const dx = (this.x + this.width / 2) - (player.x + player.width / 2);
            const dy = (this.y + this.height / 2) - (player.y + player.height / 2);
            const dist = Math.sqrt(dx * dx + dy * dy);
    
            if (dist < 150) {
                drawSize *= 0.5 + (dist / 300); // Shrink smoothly
            }
            drawSize = Math.max(drawSize, 8); // Avoid disappearing
        }
    
     // Override color in Mirror World
if (currentPhase === 6) {
    const grayscale = ['#111', '#333', '#666', '#aaa', '#ddd', '#fff'];
    ctx.fillStyle = grayscale[Math.floor(Math.random() * grayscale.length)];
} else {
    ctx.fillStyle = colors[this.type] || '#FFFF00';
}

    
        switch(this.type) {
            case 'coin':
                ctx.beginPath();
                ctx.arc(
                    this.x + this.width / 2,
                    this.y + this.height / 2,
                    drawSize / 2,
                    0,
                    Math.PI * 2
                );
                ctx.fill();
                break;
    
            case 'gem':
                ctx.beginPath();
                ctx.moveTo(this.x + this.width / 2, this.y);
                ctx.lineTo(this.x + this.width, this.y + this.height / 2);
                ctx.lineTo(this.x + this.width / 2, this.y + this.height);
                ctx.lineTo(this.x, this.y + this.height / 2);
                ctx.closePath();
                ctx.fill();
                break;
    
            case 'star':
                drawStar(
                    ctx,
                    this.x + this.width / 2,
                    this.y + this.height / 2,
                    5,
                    drawSize / 2,
                    drawSize / 4
                );
                break;
    
            case 'diamond':
                ctx.beginPath();
                ctx.moveTo(this.x + this.width / 2, this.y);
                ctx.lineTo(this.x + this.width, this.y + this.height / 2);
                ctx.lineTo(this.x + this.width / 2, this.y + this.height);
                ctx.lineTo(this.x, this.y + this.height / 2);
                ctx.closePath();
                ctx.fill();
                break;
    
            case 'crown':
                ctx.beginPath();
                ctx.moveTo(this.x + 10, this.y + this.height - 10);
                ctx.lineTo(this.x + this.width - 10, this.y + this.height - 10);
                ctx.lineTo(this.x + this.width / 2, this.y + 10);
                ctx.lineTo(this.x + 10, this.y + this.height - 10);
                ctx.fill();
                break;
    
            default:
                ctx.fillRect(this.x, this.y, drawSize, drawSize);
        }
    }
}    

function unlockAudio() {
    for (const key in sounds) {
        const sound = sounds[key];
        if (sound) {
            sound.muted = true;
            sound.play().then(() => {
                sound.pause();
                sound.currentTime = 0;
                sound.muted = false;
            }).catch((err) => {
                console.warn(`Unlock failed: ${key}`, err);
            });
        }
    }
}


function playCollectSound() {
    console.log("Trying to play a collect sound");

    if (currentPhase === 6 && sounds.mirrorCollect) {
        const clone = sounds.mirrorCollect.cloneNode();
        clone.play().catch(e => console.warn('Mirror collect failed:', e));
        return;
    }

    const options = [sounds.collect, sounds.collect2, sounds.treasure].filter(Boolean);
    if (options.length > 0) {
        const original = options[Math.floor(Math.random() * options.length)];
        const clone = original.cloneNode();
        clone.play().catch(e => console.warn('Collect sound failed:', e));
    }
}

function playMirrorCollectSound() {
    const options = [sounds.coin1, sounds.coin2, sounds.coin3].filter(Boolean);
    if (options.length > 0) {
        const original = options[Math.floor(Math.random() * options.length)];
        const clone = original.cloneNode();
        clone.play().catch(e => console.warn('Mirror collect sound failed:', e));
    }
}

function playFairyCollectSound() {
    const options = [sounds.magic1, sounds.magic2, sounds.magic3].filter(Boolean);
    if (options.length > 0) {
        const original = options[Math.floor(Math.random() * options.length)];
        const clone = original.cloneNode();
        clone.play().catch(e => console.warn('Fairy collect sound failed:', e));
    }
}

function playMemoryCollectSound() {
    const options = [sounds.shard1, sounds.shard2, sounds.shard3].filter(Boolean);
    if (options.length > 0) {
        const original = options[Math.floor(Math.random() * options.length)];
        const clone = original.cloneNode();
        clone.play().catch(e => console.warn("Memory Shard sound failed:", e));
    }
}



   
class Player extends GameObject {
    constructor(x, y) {
        super(x, y, PLAYER_SIZE, PLAYER_SIZE, 'player');
        this.speed = 5;
        this.color = '#FF0000';
        this.defaultColor = '#FF0000';
        this.hitColor = '#FF3333';
        this.flashTimeout = null;
        this.lastCollisionTime = 0;
        this.collisionCooldown = 300;
        this.mirrorShieldHits = 0;
        this.lastDangerCollisionTime = 0;
    }

    draw() {
        // Draw the player body
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2);
        ctx.fill();

        // Draw the eye
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(
            this.x + this.width / 2 + this.width / 4,
            this.y + this.height / 2 - this.height / 4,
            this.width / 8,
            0, Math.PI * 2
        );
        ctx.fill();

        // Optional shield visual cue
        if (shieldActive) {
            ctx.save();
            ctx.strokeStyle = 'rgba(0, 255, 255, 0.6)';
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }
    }
    flash() {
        this.color = this.hitColor;
        if (this.flashTimeout) clearTimeout(this.flashTimeout);
        this.flashTimeout = setTimeout(() => {
            this.color = this.defaultColor;
        }, FLASH_DURATION);
    }

    update() {
        let dx = 0, dy = 0;

        if (keys.ArrowUp) dy -= this.speed;
        if (keys.ArrowDown) dy += this.speed;
        if (keys.ArrowLeft) dx -= this.speed;
        if (keys.ArrowRight) dx += this.speed;

        if (dx !== 0 && dy !== 0) {
            dx *= 0.7071;
            dy *= 0.7071;
        }

        const newX = this.x + dx;
        const newY = this.y + dy;

        if (newX < 0 || newX > CANVAS_WIDTH - this.width || newY < 0 || newY > CANVAS_HEIGHT - this.height) return;

        const now = Date.now();
        if (now - this.lastCollisionTime < this.collisionCooldown) return;

        let canMove = true;
        const tempBox = { x: newX, y: newY, width: this.width, height: this.height };

        for (const obstacle of obstacles) {
            if (this.collidesWith.call(tempBox, obstacle)) {
                this.handleCollision();
                canMove = false;
                break;
            }
        }

        for (const danger of dangerObstacles) {
            if (this.collidesWith.call(tempBox, danger)) {
                this.handleDangerCollision();
            }
        }

        if (canMove) {
            this.x = newX;
            this.y = newY;
            this.checkCollectibles();
        }
    }

    handleCollision() {
        const now = Date.now();
        this.lastCollisionTime = now;

        if (shieldActive) {
            this.flash(); // optional visual cue when shield absorbs
            return;
        }

        score = Math.max(0, score - OBSTACLE_PENALTY);
        updateScore();

        if (score <= 0 && !gameOver) {
            triggerGameOver();
            return;
        }

        this.flash();
        if (sounds.obstacle) sounds.obstacle.play();
    }


    handleDangerCollision() {
        const now = Date.now();

        if (shieldActive) {
            this.flash(); 
            return;
        }
    

        // Normal damage logic
        score = Math.max(0, score - 50);
        updateScore();

        if (score <= 0 && !gameOver) {
            triggerGameOver();
            return;
        }

        // Collision sound cooldown
        if (now - this.lastDangerCollisionTime > 1000) {
            this.lastDangerCollisionTime = now;

            if (currentPhase === 6 && sounds.mirrorSpawn) {
                sounds.mirrorSpawn.currentTime = 0;
                sounds.mirrorSpawn.play().catch(e => console.warn("Mirror spawn collision sound failed:", e));
            } else if (currentPhase === 7 && sounds.laugh) {
                sounds.laugh.currentTime = 0;
                sounds.laugh.play().catch(e => console.warn("Laugh collision sound failed:", e));
            } else if (currentPhase === 8 && sounds.whisper) {
                sounds.whisper.currentTime = 0;
                sounds.whisper.play().catch(e => console.warn("Whisper sound failed:", e));
            } else if ((currentPhase >= 1 && currentPhase <= 5) && sounds.lose) {
                sounds.lose.currentTime = 0;
                sounds.lose.play().catch(e => console.warn("Lose sound failed:", e));
            }
        }

        this.flash();
    }
        
    isNear(other) {
        const buffer = 10;
        const dx = (this.x + this.width / 2) - (other.x + other.width / 2);
        const dy = (this.y + this.height / 2) - (other.y + other.height / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);
        const requiredDistance = (this.width / 2) + (other.width / 2) - buffer;
        return distance < requiredDistance;
    }


checkCollectibles() {
    if (gameOver) return;

       for (let i = collectibles.length - 1; i >= 0; i--) {
        const collectible = collectibles[i];

        // Skip if already collected or wrong phase
        if (collectible.collected || collectible.phase > currentPhase) continue;

        // Only collect if the player is near it
        if (this.isNear(collectible)) {
            // ...all collection logic...
            break; // Stop after one item this frame
        }
    

            if (collectible.type === 'shield') {
                if (!shieldActive) {
                    activateShieldBonus();  // Activate once
                }
                console.log("Shield collected!");
                if (sounds.shieldhit) {
                    sounds.shieldhit.currentTime = 0;
                    sounds.shieldhit.play();
                }
                // Shield gives no score
            } else {
                score += collectible.value;
                updateScore();
            }

            console.log(`Score: ${score}, Collectible: ${collectible.type}, Collected: true`);

            // Play correct sound
            if (currentPhase === 7) {
                playFairyCollectSound();
            } else if (currentPhase === 6) {
                playMirrorCollectSound();
            } else if (currentPhase === 8) {
                playMemoryCollectSound();
            } else {
                playCollectSound();
            }

            // Update collected counters
            if (collectible.phase === 1) phase1Collected++;
            if (collectible.phase === 2) phase2Collected++;
            if (collectible.phase === 3) phase3Collected++;
            if (collectible.phase === 4) phase4Collected++;
            if (collectible.phase === 5) phase5Collected++;
            if (collectible.phase === 6) phase6Collected++;
            if (collectible.phase === 7) phase7Collected++;
            if (collectible.phase === 8) phase8Collected++;  
                      
            if (currentPhase === 1 && phase1Collected >= PHASE1_COUNT && score >= PHASE1_SCORE_REQUIRED) {
                console.log('👉 Entering phase 2');
                enterPhase(2, 10);
              }
              
                             
            // === PHASE UNLOCK CONDITIONS ===
            if (currentPhase === 1 && !unlockedPhases.has(2) &&
                phase1Collected >= PHASE1_COUNT && score >= PHASE1_SCORE_REQUIRED) {
                unlockedPhases.add(2);
                currentPhase = 2;
                phaseStartTime = Date.now();
                timeWarningPlayed = false;
                phaseUnlockMessage = 'Phase 2 Unlocked!';
                phaseUnlockTimer = Date.now();
                console.log("Phase 2 unlocked!");
                spawnCollectibles(2, 10);
                if (sounds.level) sounds.level.play();
            }

            else if (currentPhase === 2 && !unlockedPhases.has(3) &&
                phase2Collected >= PHASE2_COUNT && score >= PHASE2_SCORE_REQUIRED) {
                unlockedPhases.add(3);
                spawnDangerObstacles(2);
                currentPhase = 3;
                phaseStartTime = Date.now();
                timeWarningPlayed = false;
                phaseUnlockMessage = 'Phase 3 Unlocked!';
                phaseUnlockTimer = Date.now();
                console.log("Phase 3 unlocked!");
                spawnCollectibles(3, 15);
                if (sounds.level) sounds.level.play();
            }

            else if (currentPhase === 3 && !unlockedPhases.has(4) &&
                phase3Collected >= PHASE3_COUNT && score >= PHASE3_SCORE_REQUIRED) {
                unlockedPhases.add(4);
                spawnDangerObstacles(2);
                currentPhase = 4;
                phaseStartTime = Date.now();
                timeWarningPlayed = false;
                phaseUnlockMessage = 'Phase 4 Unlocked!';
                phaseUnlockTimer = Date.now();
                console.log("Phase 4 unlocked!");
                spawnCollectibles(4, 20);
                if (sounds.level) sounds.level.play();
            }

            else if (currentPhase === 4 && !unlockedPhases.has(5) &&
                phase4Collected >= PHASE4_COUNT && score >= PHASE4_SCORE_REQUIRED) {
                unlockedPhases.add(5);
                currentPhase = 5;
                phaseStartTime = Date.now();
                timeWarningPlayed = false;
                phaseUnlockMessage = 'Phase 5 Unlocked!';
                phaseUnlockTimer = Date.now();
                console.log("Phase 5 unlocked!");
                spawnCollectibles(5, 25);
                spawnDangerObstacles(2);
                if (sounds.level) sounds.level.play();
            }

            else if (currentPhase === 5 && !unlockedPhases.has(6) &&
                phase5Collected >= PHASE5_COUNT && score >= PHASE5_SCORE_REQUIRED) {
                unlockedPhases.add(6);
                ghostPlayer = new GhostPlayer(player.x, player.y);
                currentPhase = 6;
                phaseStartTime = Date.now();
                timeWarningPlayed = false;
                phaseUnlockMessage = 'Mirror World Unlocked!';
                phaseUnlockTimer = Date.now();
                console.log("Phase 6 unlocked!");
                player.mirrorShieldHits = 7;
                document.body.style.backgroundColor = '#ccc';
                canvas.style.backgroundColor = '#aaa';
                spawnCollectibles(6, PHASE6_COUNT);
                spawnDangerObstacles(2);
                if (sounds.level) sounds.level.play();
                if (sounds.mirrorAmbience) {
                    sounds.mirrorAmbience.currentTime = 0;
                    sounds.mirrorAmbience.play();
                }
            }

            else if (currentPhase === 6 && !unlockedPhases.has(7) &&
                phase6Collected >= PHASE6_COUNT && score >= PHASE6_SCORE_REQUIRED) {
                unlockedPhases.add(7);
                currentPhase = 7;
                phaseStartTime = Date.now();
                timeWarningPlayed = false;
                phaseUnlockMessage = 'Candyland Fairyland Unlocked!';
                phaseUnlockTimer = Date.now();
                console.log("Phase 7 unlocked!");
                if (sounds.mirrorAmbience && !sounds.mirrorAmbience.paused) {
                    sounds.mirrorAmbience.pause();
                    sounds.mirrorAmbience.currentTime = 0;
                }
                document.body.style.backgroundColor = '#FFE4E1';
                canvas.style.backgroundColor = '#FFF0F5';
                spawnCollectibles(7, PHASE7_COUNT);
                spawnDangerObstacles(2);
                if (sounds.level) sounds.level.play();
            }

            else if (currentPhase === 7 && !unlockedPhases.has(8) &&
                phase7Collected >= PHASE7_COUNT && score >= PHASE7_SCORE_REQUIRED) {
                unlockedPhases.add(8);
                currentPhase = 8;
                phaseStartTime = Date.now();
                timeWarningPlayed = false;
                phaseUnlockMessage = 'Final Eclipse Unlocked!'
                phaseUnlockTimer = Date.now();
                console.log("Phase 8 unlocked!");
                document.body.style.backgroundColor = '#1a1a1a';
                canvas.style.backgroundColor = '#2b2b2b';
                spawnCollectibles(8, PHASE8_COUNT);
                spawnDangerObstacles(4);
                if (sounds.fairydance) {
                    sounds.fairydance.currentTime = 0;
                    sounds.fairydance.loop = true;
                    sounds.fairydance.play();
                }
            }

            else if (currentPhase === 8 &&
                phase8Collected >= PHASE8_COUNT && score >= PHASE8_SCORE_REQUIRED && !gameOver) {
                gameOver = true;
                phaseUnlockTimer = Date.now();
                console.log("Final Eclipse (Phase 8) complete — Game Over!");
                if (sounds.finale_hymn) {
                    sounds.finale_hymn.currentTime = 0;
                    sounds.finale_hymn.loop = true;
                    sounds.finale_hymn.play();
                }
                }
       }
    }
}
        class GhostPlayer extends Player {
            constructor(x, y) {
                super(x, y);
                this.color = 'rgba(200, 200, 200, 0.3)';
                this.trail = [];
                this.maxTrail = 30;
            }
        
            updateTrail(playerX, playerY) {
                this.trail.push({ x: playerX, y: playerY });
                if (this.trail.length > this.maxTrail) {
                    this.trail.shift();
                }
                const ghostPos = this.trail[0];
                if (ghostPos) {
                    this.x = ghostPos.x;
                    this.y = ghostPos.y;
                }
            }
        
            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }
   




function spawnDangerObstacles(count) {
    console.log(`Spawning ${count} danger obstacles at phase ${currentPhase}`);

    for (let i = 0; i < count; i++) {
        const size = 30;
        const x = Math.random() * (CANVAS_WIDTH - size);
        const y = Math.random() * (CANVAS_HEIGHT - size);
        dangerObstacles.push(new DangerObstacle(x, y, size, size));
    }

    // Play only one appropriate sound
    if (currentPhase === 6 && sounds.mirrorSpawn) {
        console.log('Playing mirrorSpawn sound!');
        sounds.mirrorSpawn.volume = 1.0;
        sounds.mirrorSpawn.currentTime = 0;
        sounds.mirrorSpawn.play().catch(e => console.warn('Mirror spawn sound failed:', e));
    } else if (sounds.obstacle) {
        sounds.obstacle.currentTime = 0;
        sounds.obstacle.play();
    }

 // Play only one appropriate sound
 if (currentPhase === 7 && sounds.laugh) {
    console.log('Playing laugh sound!');
    sounds.laugh.volume = 1.0;
    sounds.laugh.currentTime = 0;
    sounds.laugh.play().catch(e => console.warn('Laugh sound failed:', e));
} else if (sounds.obstacle) {
    sounds.obstacle.currentTime = 0;
    sounds.obstacle.play();
}

// Play only one appropriate sound
if (currentPhase === 8 && sounds.whisper) {
    console.log('Playing whisper sound!');
    sounds.whisper.volume = 1.0;
    sounds.whisper.currentTime = 0;
    sounds.whisper.play().catch(e => console.warn('whisper sound failed:', e));
} else if (sounds.obstacle) {
    sounds.obstacle.currentTime = 0;
    sounds.obstacle.play();
}

}


    
    function handlePhaseTransition(phase, bgColor = null, collectibleCount = 0, dangerCount = 0, unlockMsg = '') {
        currentPhase = phase;
        phaseStartTime = Date.now();
        timeWarningPlayed = false;
        phaseUnlockMessage = unlockMsg;
        phaseUnlockTimer = Date.now();
        console.log(`Phase ${phase} unlocked!`);
    
        if (bgColor) {
            document.body.style.backgroundColor = bgColor;
            canvas.style.backgroundColor = bgColor;
        }
    
        if (collectibleCount > 0) spawnCollectibles(phase, collectibleCount);
        if (dangerCount > 0) spawnDangerObstacles(dangerCount);
        if (sounds.level) sounds.level.play();
    }
    



async function loadObstacles() {
    // Helper function for generating random obstacles
    function generateRandomObstacles(count) {
        const types = ['tree', 'rock', 'pond', 'fence', 'house'];
        const newObstacles = [];
        
        // Size presets for each obstacle type
        const sizePresets = {
            'tree': { minW: 30, maxW: 50, minH: 50, maxH: 70 },
            'rock': { minW: 20, maxW: 40, minH: 20, maxH: 40 },
            'pond': { minW: 80, maxW: 160, minH: 60, maxH: 120 },
            'fence': { minW: 150, maxW: 300, minH: 15, maxH: 25 },
            'house': { minW: 80, maxW: 120, minH: 100, maxH: 140 }
        };

        // Generate requested number of obstacles
        for (let i = 0; i < count; i++) {
            const type = types[Math.floor(Math.random() * types.length)];
            const preset = sizePresets[type];
            
            const width = preset.minW + Math.random() * (preset.maxW - preset.minW);
            const height = preset.minH + Math.random() * (preset.maxH - preset.minH);
            
            // Ensure obstacles don't spawn too close to edges
            const maxX = CANVAS_WIDTH - width - 20;
            const maxY = CANVAS_HEIGHT - height - 20;
            
            newObstacles.push(new Obstacle(
                20 + Math.random() * maxX,
                20 + Math.random() * maxY,
                width,
                height,
                type
            ));
        }
        
        return newObstacles;
    }

    try {
        // Try to load from JSON first
        const response = await fetch('obstacles.json');
        const data = await response.json();
        
        // Process loaded obstacles
        obstacles = data.map(item => new Obstacle(
            item.x, 
            item.y, 
            item.width || 40,  // Default size if not specified
            item.height || 40, // Default size if not specified
            item.type || 'rock' // Default type if not specified
        ));
        
        // Add 10 random obstacles to the loaded ones
        obstacles = obstacles.concat(generateRandomObstacles(10));
        
    } catch (error) {
        console.error('Error loading obstacles:', error);
        
        // Create 20 well-distributed default obstacles when JSON fails
        obstacles = [
            // Strategic trees
            new Obstacle(150, 100, 40, 60, 'tree'),
            new Obstacle(450, 300, 45, 65, 'tree'),
            new Obstacle(750, 150, 35, 55, 'tree'),
            new Obstacle(1050, 400, 40, 60, 'tree'),
            new Obstacle(150, 700, 40, 60, 'tree'),
            
            // Scattered rocks
            new Obstacle(300, 500, 30, 30, 'rock'),
            new Obstacle(600, 200, 35, 35, 'rock'),
            new Obstacle(900, 600, 25, 25, 'rock'),
            new Obstacle(200, 300, 30, 30, 'rock'),
            
            // Water features
            new Obstacle(150, 400, 100, 80, 'pond'),
            new Obstacle(700, 500, 120, 90, 'pond'),
            new Obstacle(1000, 200, 90, 70, 'pond'),
            
            // Barrier fences
            new Obstacle(100, 200, 200, 20, 'fence'),
            new Obstacle(400, 700, 250, 20, 'fence'),
            new Obstacle(800, 400, 180, 20, 'fence'),
            
            // Buildings
            new Obstacle(1100, 100, 100, 120, 'house'),
            new Obstacle(300, 650, 100, 120, 'house'),
            new Obstacle(900, 100, 90, 110, 'house'),
            
            // Additional random obstacles
            ...generateRandomObstacles(5)
        ];

        if (currentPhase === 6 && this.type !== 'danger') {
            ctx.fillStyle = '#888'; // Dull gray for mirror effect
        }
        

    }
    
    // Ensure player starting area (center) is clear
    const centerX = CANVAS_WIDTH/2;
    const centerY = CANVAS_HEIGHT/2;
    const clearance = 150; // Clear area radius
    
    obstacles = obstacles.filter(obs => {
        const obsCenterX = obs.x + obs.width/2;
        const obsCenterY = obs.y + obs.height/2;
        const distance = Math.sqrt(
            Math.pow(obsCenterX - centerX, 2) + 
            Math.pow(obsCenterY - centerY, 2)
        );
        return distance > clearance;
    });
    
    console.log(`Loaded ${obstacles.length} obstacles`);
}

async function loadCollectibles() {
    try {
        const response = await fetch('collectibles.json');
        const data = await response.json();
        collectibles = data.map(item => new Collectible(
            item.x, item.y, item.width, item.height, item.type, item.value, item.phase || 1
        ));
    } catch (error) {
        console.error('Error loading collectibles:', error);
        collectibles = [
            // --- Phase 1 Items ---
            new Collectible(150, 350, 20, 20, 'coin', 10, 1),
            new Collectible(400, 250, 25, 25, 'gem', 50, 1),
            new Collectible(650, 400, 30, 30, 'star', 100, 1),
            new Collectible(800, 150, 20, 20, 'coin', 10, 1),
            new Collectible(1000, 300, 25, 25, 'gem', 50, 1),
            new Collectible(200, 450, 20, 20, 'coin', 10, 1),
            new Collectible(300, 550, 25, 25, 'gem', 50, 1),
            new Collectible(500, 350, 30, 30, 'star', 100, 1),
            new Collectible(700, 250, 20, 20, 'coin', 10, 1),
            new Collectible(900, 150, 25, 25, 'gem', 50, 1),
            new Collectible(175, 375, 20, 20, 'coin', 10, 1),
            new Collectible(425, 275, 25, 25, 'gem', 50, 1),
            new Collectible(675, 425, 30, 30, 'star', 100, 1),
            new Collectible(825, 175, 20, 20, 'coin', 10, 1),
            new Collectible(1025, 325, 25, 25, 'gem', 50, 1),

            // --- Phase 2 Items ---
            new Collectible(200, 600, 35, 35, 'diamond', 200, 2),
            new Collectible(500, 700, 40, 40, 'crown', 500, 2),
            new Collectible(1200, 500, 35, 35, 'diamond', 200, 2),
            new Collectible(900, 800, 40, 40, 'crown', 500, 2),
            new Collectible(1300, 200, 30, 30, 'star', 100, 2),
            new Collectible(300, 200, 35, 35, 'diamond', 200, 2),
            new Collectible(700, 300, 40, 40, 'crown', 500, 2),
            new Collectible(1100, 700, 35, 35, 'diamond', 200, 2),
            new Collectible(500, 500, 40, 40, 'crown', 500, 2),
            new Collectible(100, 100, 30, 30, 'star', 100, 2),
            new Collectible(1400, 400, 35, 35, 'diamond', 200, 2),
            new Collectible(600, 600, 40, 40, 'crown', 500, 2),
            new Collectible(200, 800, 35, 35, 'diamond', 200, 2),
            new Collectible(800, 200, 40, 40, 'crown', 500, 2),
            new Collectible(400, 400, 35, 35, 'diamond', 200, 2),
            new Collectible(225, 625, 35, 35, 'diamond', 200, 2),  
            new Collectible(525, 725, 40, 40, 'crown', 500, 2),  
            new Collectible(1225, 525, 35, 35, 'diamond', 200, 2), 
            new Collectible(925, 825, 40, 40, 'crown', 500, 2),   
            new Collectible(1325, 225, 30, 30, 'star', 100, 2),   
            new Collectible(325, 225, 35, 35, 'diamond', 200, 2),  
            new Collectible(725, 325, 40, 40, 'crown', 500, 2),  
            new Collectible(1125, 725, 35, 35, 'diamond', 200, 2), 
            new Collectible(475, 475, 40, 40, 'crown', 500, 2),   
            new Collectible(125, 125, 30, 30, 'star', 100, 2),    
            new Collectible(1425, 425, 35, 35, 'diamond', 200, 2), 
            new Collectible(575, 575, 40, 40, 'crown', 500, 2),   
            new Collectible(175, 775, 35, 35, 'diamond', 200, 2),  
            new Collectible(775, 175, 40, 40, 'crown', 500, 2),   
            new Collectible(375, 375, 35, 35, 'diamond', 200, 2),  

            // --- Phase 3 Items ---
          // Tier 3 Collectibles (Unique Positions)
new Collectible(300, 300, 35, 35, 'diamond', 250, 3),
new Collectible(600, 400, 30, 30, 'star', 150, 3),
new Collectible(900, 500, 40, 40, 'crown', 600, 3),
new Collectible(500, 200, 35, 35, 'diamond', 250, 3),
new Collectible(1100, 300, 30, 30, 'star', 150, 3),
new Collectible(800, 600, 40, 40, 'crown', 600, 3),
new Collectible(200, 400, 35, 35, 'diamond', 250, 3),
new Collectible(700, 700, 30, 30, 'star', 150, 3),
new Collectible(1000, 600, 40, 40, 'crown', 600, 3),
new Collectible(400, 500, 35, 35, 'diamond', 250, 3),
new Collectible(750, 300, 30, 30, 'star', 150, 3),
new Collectible(1050, 400, 40, 40, 'crown', 600, 3),
new Collectible(250, 600, 35, 35, 'diamond', 250, 3),
new Collectible(650, 200, 30, 30, 'star', 150, 3),
new Collectible(950, 700, 40, 40, 'crown', 600, 3),
new Collectible(450, 150, 35, 35, 'diamond', 250, 3),
new Collectible(850, 350, 30, 30, 'star', 150, 3),
new Collectible(1150, 650, 40, 40, 'crown', 600, 3),
new Collectible(350, 250, 35, 35, 'diamond', 250, 3),
new Collectible(650, 450, 30, 30, 'star', 150, 3),
new Collectible(950, 250, 40, 40, 'crown', 600, 3),
new Collectible(150, 550, 35, 35, 'diamond', 250, 3),
new Collectible(550, 350, 30, 30, 'star', 150, 3),
new Collectible(850, 150, 40, 40, 'crown', 600, 3),
new Collectible(1050, 550, 35, 35, 'diamond', 250, 3),

// Adjusted duplicates (prevent overlaps)
new Collectible(320, 320, 30, 30, 'diamond', 250, 3),  
new Collectible(620, 420, 30, 30, 'star', 150, 3),     
new Collectible(920, 520, 40, 40, 'crown', 600, 3),    
new Collectible(520, 220, 30, 30, 'diamond', 250, 3),   
new Collectible(1120, 320, 30, 30, 'star', 150, 3),    
new Collectible(820, 620, 40, 40, 'crown', 600, 3),    
new Collectible(220, 420, 30, 30, 'diamond', 250, 3),   
new Collectible(720, 720, 30, 30, 'star', 150, 3),    
new Collectible(1020, 620, 40, 40, 'crown', 600, 3),   
new Collectible(420, 520, 30, 30, 'diamond', 250, 3),  
new Collectible(770, 320, 30, 30, 'star', 150, 3),    
new Collectible(1070, 420, 40, 40, 'crown', 600, 3),  
new Collectible(270, 620, 30, 30, 'diamond', 250, 3),   
new Collectible(670, 220, 30, 30, 'star', 150, 3),    
new Collectible(970, 720, 40, 40, 'crown', 600, 3),    
new Collectible(470, 170, 30, 30, 'diamond', 250, 3),  
new Collectible(870, 370, 30, 30, 'star', 150, 3),     
new Collectible(1170, 670, 40, 40, 'crown', 600, 3),   
new Collectible(370, 270, 30, 30, 'diamond', 250, 3),  
new Collectible(670, 470, 30, 30, 'star', 150, 3),     
new Collectible(970, 270, 40, 40, 'crown', 600, 3),   
new Collectible(170, 570, 30, 30, 'diamond', 250, 3),  
new Collectible(570, 370, 30, 30, 'star', 150, 3),     
new Collectible(870, 170, 40, 40, 'crown', 600, 3),    
new Collectible(1070, 570, 30, 30, 'diamond', 250, 3),

            // --- Phase 4 Items ---
new Collectible(100, 700, 40, 40, 'crown', 650, 4),
new Collectible(500, 100, 35, 35, 'diamond', 300, 4),
new Collectible(900, 200, 30, 30, 'star', 200, 4),
new Collectible(1300, 600, 35, 35, 'diamond', 300, 4),
new Collectible(300, 800, 30, 30, 'star', 200, 4),
new Collectible(700, 100, 40, 40, 'crown', 650, 4),
new Collectible(1100, 500, 35, 35, 'diamond', 300, 4),
new Collectible(200, 100, 30, 30, 'star', 200, 4),
new Collectible(400, 200, 40, 40, 'crown', 650, 4),
new Collectible(800, 300, 35, 35, 'diamond', 300, 4),
new Collectible(1000, 400, 30, 30, 'star', 200, 4),
new Collectible(600, 500, 40, 40, 'crown', 650, 4),
new Collectible(300, 600, 35, 35, 'diamond', 300, 4),
new Collectible(700, 700, 30, 30, 'star', 200, 4),
new Collectible(900, 800, 40, 40, 'crown', 650, 4),
new Collectible(220, 220, 40, 40, 'crown', 650, 4),     
new Collectible(620, 320, 35, 35, 'diamond', 300, 4),    
new Collectible(1020, 420, 30, 30, 'star', 200, 4),   
new Collectible(420, 520, 40, 40, 'crown', 650, 4),    
new Collectible(820, 620, 35, 35, 'diamond', 300, 4),  
new Collectible(1220, 220, 30, 30, 'star', 200, 4),     
new Collectible(320, 420, 40, 40, 'crown', 650, 4),    
new Collectible(720, 220, 35, 35, 'diamond', 300, 4),   
new Collectible(1120, 520, 30, 30, 'star', 200, 4),     
new Collectible(520, 720, 40, 40, 'crown', 650, 4),      
new Collectible(920, 320, 35, 35, 'diamond', 300, 4),  
new Collectible(120, 520, 30, 30, 'star', 200, 4),       
new Collectible(620, 820, 40, 40, 'crown', 650, 4),     
new Collectible(420, 720, 35, 35, 'diamond', 300, 4),   
new Collectible(820, 420, 30, 30, 'star', 200, 4),      
new Collectible(220, 620, 40, 40, 'crown', 650, 4),     
new Collectible(520, 220, 35, 35, 'diamond', 300, 4),   
new Collectible(720, 620, 30, 30, 'star', 200, 4),       
new Collectible(920, 720, 40, 40, 'crown', 650, 4),   
new Collectible(320, 820, 35, 35, 'diamond', 300, 4),    
new Collectible(620, 420, 30, 30, 'star', 200, 4),       
new Collectible(820, 720, 40, 40, 'crown', 650, 4),      
new Collectible(1220, 620, 35, 35, 'diamond', 300, 4),  
new Collectible(420, 320, 30, 30, 'star', 200, 4),       
new Collectible(720, 520, 40, 40, 'crown', 650, 4),      
new Collectible(1020, 720, 35, 35, 'diamond', 300, 4), 
new Collectible(520, 420, 30, 30, 'star', 200, 4),      
new Collectible(820, 320, 40, 40, 'crown', 650, 4),      
new Collectible(1120, 420, 35, 35, 'diamond', 300, 4),   
new Collectible(320, 620, 30, 30, 'star', 200, 4),       
new Collectible(720, 420, 40, 40, 'crown', 650, 4),      
new Collectible(920, 520, 35, 35, 'diamond', 300, 4),    
new Collectible(220, 520, 30, 30, 'star', 200, 4),      
new Collectible(620, 620, 40, 40, 'crown', 650, 4),      
new Collectible(120, 320, 35, 35, 'diamond', 300, 4),

 // ---Phase 5 c=items---
new Collectible(200, 200, 50, 50, 'crown', 700, 5),
new Collectible(600, 700, 45, 45, 'diamond', 350, 5),
new Collectible(1000, 100, 50, 50, 'star', 250, 5),
new Collectible(400, 400, 50, 50, 'crown', 700, 5),
new Collectible(800, 800, 45, 45, 'diamond', 350, 5),
new Collectible(1200, 200, 50, 50, 'star', 250, 5),
new Collectible(300, 100, 50, 50, 'crown', 700, 5),
new Collectible(700, 300, 45, 45, 'diamond', 350, 5),
new Collectible(1100, 500, 50, 50, 'star', 250, 5),
new Collectible(500, 700, 50, 50, 'crown', 700, 5),
new Collectible(250, 250, 45, 45, 'diamond', 350, 5),    
new Collectible(650, 600, 50, 50, 'star', 250, 5),      
new Collectible(950, 200, 50, 50, 'crown', 700, 5),      
new Collectible(350, 500, 45, 45, 'diamond', 350, 5),    
new Collectible(750, 750, 50, 50, 'star', 250, 5),       
new Collectible(1150, 350, 50, 50, 'crown', 700, 5),     
new Collectible(450, 250, 45, 45, 'diamond', 350, 5),    
new Collectible(850, 500, 50, 50, 'star', 250, 5),     
new Collectible(1050, 600, 50, 50, 'crown', 700, 5),     
new Collectible(150, 650, 45, 45, 'diamond', 350, 5),    
new Collectible(550, 450, 50, 50, 'star', 250, 5),     
new Collectible(900, 100, 50, 50, 'crown', 700, 5),    
new Collectible(200, 800, 45, 45, 'diamond', 350, 5),    
new Collectible(600, 500, 50, 50, 'star', 250, 5),       
new Collectible(1000, 300, 50, 50, 'crown', 700, 5),    
new Collectible(400, 100, 45, 45, 'diamond', 350, 5),   
new Collectible(800, 400, 50, 50, 'star', 250, 5),      
new Collectible(1200, 700, 50, 50, 'crown', 700, 5),    
new Collectible(350, 350, 45, 45, 'diamond', 350, 5),   
new Collectible(750, 550, 50, 50, 'star', 250, 5),      
new Collectible(1150, 250, 50, 50, 'crown', 700, 5),    
new Collectible(300, 650, 45, 45, 'diamond', 350, 5),    
new Collectible(700, 100, 50, 50, 'star', 250, 5),     
new Collectible(1100, 450, 50, 50, 'crown', 700, 5),   
new Collectible(500, 300, 45, 45, 'diamond', 350, 5),    
new Collectible(900, 600, 50, 50, 'star', 250, 5),     
new Collectible(250, 450, 50, 50, 'crown', 700, 5),     
new Collectible(650, 250, 45, 45, 'diamond', 350, 5),   
new Collectible(1050, 500, 50, 50, 'star', 250, 5),     
new Collectible(450, 650, 50, 50, 'crown', 700, 5),     
new Collectible(850, 300, 45, 45, 'diamond', 350, 5),    
new Collectible(100, 600, 50, 50, 'star', 250, 5),       
new Collectible(600, 150, 50, 50, 'crown', 700, 5),      
new Collectible(1000, 550, 45, 45, 'diamond', 350, 5),   
new Collectible(400, 750, 50, 50, 'star', 250, 5),       
new Collectible(800, 250, 50, 50, 'crown', 700, 5),     
new Collectible(1200, 600, 45, 45, 'diamond', 350, 5),   
new Collectible(300, 550, 50, 50, 'star', 250, 5),       
new Collectible(700, 400, 50, 50, 'crown', 700, 5),      
new Collectible(1100, 650, 45, 45, 'diamond', 350, 5)    
];
       
    }
}




function setupControls() {
    window.addEventListener('keydown', (e) => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            keys[e.key] = true;
        }
    });

    window.addEventListener('keyup', (e) => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            keys[e.key] = false;
        }
    });
}


function updateScore() {
    const scoreElement = document.getElementById('score-display');
    if (scoreElement) scoreElement.textContent = `Score: ${score}`;
}

function updateDebugInfo() 

{
    const debugElement = document.getElementById('debug-info');
    if (debugElement) {
        let phaseTimeLimit;
        if (currentPhase === 1) phaseTimeLimit = PHASE1_TIME_LIMIT;
        else if (currentPhase === 2) phaseTimeLimit = PHASE2_TIME_LIMIT;
        else if (currentPhase === 3) phaseTimeLimit = PHASE3_TIME_LIMIT;
        else if (currentPhase === 4) phaseTimeLimit = PHASE4_TIME_LIMIT;
        else if (currentPhase === 6) phaseTimeLimit = PHASE6_TIME_LIMIT;
        else if (currentPhase === 7) phaseTimeLimit = PHASE7_TIME_LIMIT;
        else if (currentPhase === 8) phaseTimeLimit = PHASE8_TIME_LIMIT;


        else phaseTimeLimit = PHASE5_TIME_LIMIT;

        timeLeft = phaseTimeLimit - (Date.now() - phaseStartTime);
        if (timeLeft < 0) timeLeft = 0;
        
        const now = Date.now();

        if (
            timeLeft < 10000 &&          // Only warn in final 10 seconds
            !timeWarningPlayed &&        // Only warn once per phase
            now - lastWarningTime > WARNING_COOLDOWN
        ) {
            if (sounds.warning && sounds.warning.readyState >= 2) {
                sounds.warning.currentTime = 0;
                sounds.warning.play().catch(err => {
                    console.warn("Warning sound failed to play:", err);
                });
                lastWarningTime = now;
                timeWarningPlayed = true;
                console.log("Warning played!");

                    }
                    if (currentPhase === 6) {
                        debugElement.innerHTML += `Shield Hits Left: ${player.mirrorShieldHits}<br>`;
                    }
                    

        }
        
        
        
        for (const key in sounds) {
            const sound = sounds[key];
            if (sound && !sound.paused && !sound._wasPlayingLogged) {
                console.log(`🔊 Playing: ${key}`);
                sound._wasPlayingLogged = true;
                setTimeout(() => sound._wasPlayingLogged = false, 2000);
            }
        }
        
        
        
        
        const minutes = Math.floor(timeLeft / 60000);
        const seconds = Math.floor((timeLeft % 60000) / 1000);
        
        debugElement.innerHTML = `
            Phase: ${currentPhase}<br>
            Phase 1: ${phase1Collected}/${PHASE1_COUNT}<br>
            ${currentPhase >= 2 ? `Phase 2: ${phase2Collected}/${PHASE2_COUNT}<br>` : ''}
            ${currentPhase >= 3 ? `Phase 3: ${phase3Collected}/${PHASE3_COUNT}<br>` : ''}
            ${currentPhase >= 4 ? `Phase 4: ${phase4Collected}/${PHASE4_COUNT}<br>` : ''}
            ${currentPhase >= 5 ? `Phase 5: ${phase5Collected}/${PHASE5_COUNT}<br>` : ''}
            ${currentPhase >= 6 ? `Phase 6: ${phase6Collected}/${PHASE6_COUNT}<br>` : ''}
            ${currentPhase >= 7 ? `Phase 7: ${phase7Collected}/${PHASE7_COUNT}<br>` : ''}
            ${currentPhase >= 8 ? `Phase 8: ${phase8Collected}/${PHASE8_COUNT}<br>` : ''}
            Time: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}<br>
            Score: ${score}
        `;
    }
}


function resizeCanvas() {
    const container = document.getElementById('game-container');
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    // Calculate scale to fit container while maintaining aspect ratio
    const scale = Math.min(
        containerWidth / CANVAS_WIDTH,
        containerHeight / CANVAS_HEIGHT
    );
    
    // Apply the scale
    canvas.style.width = `${CANVAS_WIDTH * scale}px`;
    canvas.style.height = `${CANVAS_HEIGHT * scale}px`;
    
    // Center the canvas
    canvas.style.position = 'absolute';
    canvas.style.left = `${(containerWidth - CANVAS_WIDTH * scale) / 2}px`;
    canvas.style.top = `${(containerHeight - CANVAS_HEIGHT * scale) / 2}px`;
    
    // Handle high DPI displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = CANVAS_WIDTH * dpr;
    canvas.height = CANVAS_HEIGHT * dpr;
    ctx.scale(dpr, dpr);
}


function drawGhostlyMist() {
    if (currentPhase !== 8) return;

    for (let i = 0; i < 5; i++) {
        const x = Math.random() * CANVAS_WIDTH;
        const y = Math.random() * CANVAS_HEIGHT;
        const width = 100 + Math.random() * 150;
        const height = 20 + Math.random() * 40;
        const alpha = 0.02 + Math.random() * 0.05;

        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fillRect(x, y, width, height);
    }
}


function drawCrackedEarthOverlay() {
    if (currentPhase === 8) {
        ctx.fillStyle = 'rgba(0,0,0,0.1)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        for (let i = 0; i < 10; i++) {
            ctx.strokeStyle = 'rgba(255,255,255,0.03)';
            ctx.beginPath();
            ctx.moveTo(Math.random()*CANVAS_WIDTH, Math.random()*CANVAS_HEIGHT);
            for (let j = 0; j < 4; j++) {
                ctx.lineTo(
                    Math.random()*CANVAS_WIDTH,
                    Math.random()*CANVAS_HEIGHT
                );
            }
            ctx.stroke();
        }
    }
}


function updateAndDrawEmbers() {
    if (currentPhase !== 8) return;

    // Add new particles if under max
    if (emberParticles.length < MAX_PARTICLES) {
        emberParticles.push(createEmberParticle());
    }

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    for (let i = emberParticles.length - 1; i >= 0; i--) {
        const p = emberParticles[i];

        p.x += p.speedX;
        p.y -= p.speedY;
        p.life--;

        if (p.life <= 0 || p.y < 0) {
            emberParticles.splice(i, 1);
            continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, ${100 + Math.floor(Math.random() * 100)}, 0, ${p.opacity})`;
        ctx.fill();
    }

    ctx.restore();
}




// Darkness & flashlight effect near end of Phase 8


function drawDarknessOverlay() {
    if (currentPhase === 8 && (PHASE8_COUNT - phase8Collected) <= 5) {
        darkOverlayActive = true;
        const grd = ctx.createRadialGradient(
            player.x + player.width / 2,
            player.y + player.height / 2,
            50,
            player.x + player.width / 2,
            player.y + player.height / 2,
            300
        );
        grd.addColorStop(0, 'rgba(0,0,0,0.0)');
        grd.addColorStop(1, 'rgba(0,0,0,0.85)');
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
}


function drawFinalEclipseGradient() {
if (currentPhase === 8) {
    const gradient = ctx.createRadialGradient(
        CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, CANVAS_WIDTH / 4,
        CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, CANVAS_WIDTH
    );
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.6)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}
}
    
function spawnCollectibles(phase, count, maxShields = 2) {
    console.log(` spawnCollectibles() for phase ${phase} — should run once`);
    let attempts = 0;
    let shieldsSpawned = 0;
    let placed = 0;

    collectibles = collectibles.filter(c => c.phase !== phase);

    while (placed < count && attempts < count * 10) {
        const size = 20 + Math.random() * 20;
        const x = Math.random() * (CANVAS_WIDTH - size);
        const y = Math.random() * (CANVAS_HEIGHT - size);
        const rand = Math.random();

        let type;

        if (rand < 0.10 && shieldsSpawned < maxShields) {
            type = 'shield';
            shieldsSpawned++;
        } else {
            const otherTypes = ['coin', 'gem', 'star', 'diamond', 'crown'];
            type = otherTypes[Math.floor(Math.random() * otherTypes.length)];
        }

        const value = {
            coin: 10,
            gem: 50,
            star: 100,
            diamond: 200,
            crown: 500,
            shield: 0
        }[type];

        const newCollectible = new Collectible(x, y, size, size, type, value, phase);

        const overlaps = collectibles.some(c => {
            const dx = (c.x + c.width / 2) - (x + size / 2);
            const dy = (c.y + c.height / 2) - (y + size / 2);
            return Math.sqrt(dx * dx + dy * dy) < (c.width + size) / 2 + 10;
        });

        if (!overlaps) {
            collectibles.push(newCollectible);
            placed++; // cap total collectibles to `count`
        }

        attempts++;
    }
}
    



    let animationFrameId;

   function gameLoop() {
    if (gameOver || !ctx) return;

    // Clear canvas before drawing
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    if (shieldActive && Date.now() - shieldStartTime > SHIELD_DURATION) {
        shieldActive = false;
        console.log('Shield expired');
    }

    // Atmospheric effects
    drawCrackedEarthOverlay();
    drawDarknessOverlay();
    drawFinalEclipseGradient();
    drawGhostlyMist();
    updateAndDrawEmbers();

    // Draw background elements
    obstacles.forEach(o => o.draw());

    // Ghost player in mirror world
    if (currentPhase === 6 && ghostPlayer) {
        ghostPlayer.updateTrail(player.x, player.y);
        ghostPlayer.draw();
    }

    // Update and draw player
    player.update();
    player.draw();

    // Update and draw collectibles
    collectibles.forEach(c => {
        if (!c.collected && c.phase <= currentPhase) {
            c.update();
        }
    });
    collectibles.forEach(c => c.draw());

    // Update and draw danger obstacles
    dangerObstacles.forEach(d => {
        d.update();
        d.draw();
    });

    // Phase and time display
    updateDebugInfo();
    checkPhaseTimeout();

    // Phase unlock message
    if (phaseUnlockMessage && (Date.now() - phaseUnlockTimer) < 3000) {
        ctx.font = 'bold 48px Arial';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 4;
        ctx.textAlign = 'center';
        ctx.strokeText(phaseUnlockMessage, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
        ctx.fillText(phaseUnlockMessage, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    }
        //Keep the loop going
        animationFrameId = requestAnimationFrame(gameLoop);
    
    }
    

function checkPhaseTimeout() {
    const now = Date.now();
    let phaseTimeLimit;

    if (currentPhase === 1) phaseTimeLimit = PHASE1_TIME_LIMIT;
    else if (currentPhase === 2) phaseTimeLimit = PHASE2_TIME_LIMIT;
    else if (currentPhase === 3) phaseTimeLimit = PHASE3_TIME_LIMIT;
    else if (currentPhase === 4) phaseTimeLimit = PHASE4_TIME_LIMIT;
    else if (currentPhase === 6) phaseTimeLimit = PHASE6_TIME_LIMIT;
    else if (currentPhase === 7) phaseTimeLimit = PHASE7_TIME_LIMIT;
    else if (currentPhase === 8) phaseTimeLimit = PHASE8_TIME_LIMIT;
    else phaseTimeLimit = PHASE5_TIME_LIMIT;

    if (now - phaseStartTime > phaseTimeLimit) {
        // Correct collectible + score checks
        if (
            (currentPhase === 1 && (phase1Collected < PHASE1_COUNT || score < PHASE1_SCORE_REQUIRED)) ||
            (currentPhase === 2 && (phase2Collected < PHASE2_COUNT || score < PHASE2_SCORE_REQUIRED)) ||
            (currentPhase === 3 && (phase3Collected < PHASE3_COUNT || score < PHASE3_SCORE_REQUIRED)) ||
            (currentPhase === 4 && (phase4Collected < PHASE4_COUNT || score < PHASE4_SCORE_REQUIRED)) ||
            (currentPhase === 5 && (phase5Collected < PHASE5_COUNT || score < PHASE5_SCORE_REQUIRED)) ||
            (currentPhase === 6 && (phase6Collected < PHASE6_COUNT || score < PHASE6_SCORE_REQUIRED)) ||
            (currentPhase === 7 && (phase7Collected < PHASE7_COUNT || score < PHASE7_SCORE_REQUIRED)) ||
            (currentPhase === 8 && (phase8Collected < PHASE8_COUNT || score < PHASE8_SCORE_REQUIRED))
        ) {
            triggerGameOver();
        }
    }
}


function triggerGameOver() {
    console.log('Game Over!');
    gameOver = true;

    ctx.font = 'bold 64px Arial';
    ctx.fillStyle = 'red';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', CANVAS_WIDTH/2, CANVAS_HEIGHT/2);

    if (sounds.gameover) {
        sounds.gameover.currentTime = 0;
        sounds.gameover.play();
    }

    showRestartButton(); 
}

function showRestartButton() {
    let restartButton = document.getElementById('restart-button');
    if (!restartButton) {
        restartButton = document.createElement('button');
        restartButton.id = 'restart-button';
        restartButton.textContent = 'Restart';
        restartButton.style.position = 'absolute';
        restartButton.style.left = '50%';
        restartButton.style.top = '60%';
        restartButton.style.transform = 'translate(-50%, -50%)';
        restartButton.style.padding = '15px 30px';
        restartButton.style.fontSize = '24px';
        restartButton.style.backgroundColor = '#D72638';
        restartButton.style.color = 'white';
        restartButton.style.border = 'none';
        restartButton.style.borderRadius = '10px';
        restartButton.style.cursor = 'pointer';
        restartButton.style.zIndex = '1000';
        collectibles = [];

        document.body.appendChild(restartButton);
    } else {
        restartButton.style.display = 'block';
    }


 


    restartButton.onclick = function() {
        restartGame();
    };
}



function restartGame() {
    // Remove restart button
    const restartButton = document.getElementById('restart-button');
    if (restartButton) {
        restartButton.remove();
    }
    if (animationFrameId) cancelAnimationFrame(animationFrameId);

    // Reset game flags and variables
    gameOver = false;
    score = 0;
    currentPhase = 1;
    phase1Collected = 0;
    phase2Collected = 0;
    phase3Collected = 0;
    phase4Collected = 0;
    phase5Collected = 0;
    phase6Collected = 0;
    phase7Collected = 0;
    phase8Collected = 0;
    phaseUnlockMessage = '';
    timeWarningPlayed = false;

    unlockedPhases.clear();

    // Clear arrays
    obstacles = [];
    collectibles = [];
    dangerObstacles = [];

    // Fully clear canvas
    if (ctx) ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Reset keys
    keys = {};

//ember particles
emberParticles = [];



    // Remove old canvas events if needed (optional)
    window.removeEventListener('resize', resizeCanvas);
    gameInitialized = false;
    initGame();
    

}

const startGame = () => {
    class GhostPlayer extends Player {
        constructor(x, y) {
            super(x, y);
            this.color = 'rgba(200, 200, 200, 0.3)';
            this.trail = [];
            this.maxTrail = 30;
        }
    
        updateTrail(playerX, playerY) {
            this.trail.push({ x: playerX, y: playerY });
            if (this.trail.length > this.maxTrail) {
                this.trail.shift();
            }
            const ghostPos = this.trail[0];
            if (ghostPos) {
                this.x = ghostPos.x;
                this.y = ghostPos.y;
            }
        }
    
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }

};


window.onload = function() {
    document.body.addEventListener('click', () => {
        if (gameStarted) return;        // prevent double-start
        gameStarted = true;

        unlockAudio();                  //unlock all audio
        startGame();                    // start the game once
    }, { once: true });
};

function resetGame() {
    console.log("🔄 Resetting game state...");

    // Clear game state
    collectibles = [];
    obstacles = [];
    dangerObstacles = [];
    unlockedPhases = new Set([1]);
    phase1Collected = phase2Collected = phase3Collected = 0;
    phase4Collected = phase5Collected = phase6Collected = 0;
    phase7Collected = phase8Collected = 0;

    score = 0;
    gameOver = false;
    currentPhase = 1;
    shieldActive = false;

    // Reset audio if needed
    for (let key in sounds) {
        if (sounds[key]) {
            sounds[key].pause();
            sounds[key].currentTime = 0;
        }
    }

    // Reset visuals
    document.body.style.backgroundColor = '';
    canvas.style.backgroundColor = '';
}



async function initGame() {
    async function initGame() {
        if (gameInitialized) {
            console.warn("Game already initialized.");
            return;
        }
    
        document.getElementById('start-button').addEventListener('click', () => {
            unlockAudio();
            startGame(); // or whatever your main init is
        });
        

        // Get canvas and context FIRST
        canvas = document.getElementById('game-canvas');
        if (!canvas) {
            console.error('Canvas element not found!');
            return;
        }
    
        ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error('Canvas context could not be initialized!');
            return;
        }
    
        gameInitialized = true;
    
      
    resetGame();

    }

    // Create player
    player = new Player(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    player.mirrorShieldHits = 0;

    // Get canvas and context
    canvas = document.getElementById('game-canvas');
    if (!canvas) {
        console.error('Canvas element not found!');
        return;
    }

    ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('Canvas context could not be initialized!');
        return;
    }

    //  Link all sound elements
    sounds.collect = document.getElementById('collect');
    sounds.collect2 = document.getElementById('collect2');
    sounds.treasure = document.getElementById('treasure');
    sounds.lose = document.getElementById('lose');
    sounds.phase = document.getElementById('phase');
    sounds.warning = document.getElementById('warning');
    sounds.obstacle = document.getElementById('obstacle');
    sounds.level = document.getElementById('level');
    sounds.win = document.getElementById('win');
    sounds.gameover = document.getElementById('gameover');

    // Phase 6 - Mirror World
    sounds.mirrorAmbience = document.getElementById('mirrorAmbience');
    sounds.mirrorCollect = document.getElementById('mirrorCollect');
    sounds.coin1 = document.getElementById('coin1');
    sounds.coin2 = document.getElementById('coin2');
    sounds.coin3 = document.getElementById('coin3');
    sounds.mirrorSpawn = document.getElementById('mirrorSpawn');
    sounds.shieldhit = document.getElementById('shieldhit');

    // Phase 7 - Candyland Fairyland
    sounds.fairyDance = document.getElementById('fairyDance');
    sounds.magic1 = document.getElementById('magic1');
    sounds.magic2 = document.getElementById('magic2');
    sounds.magic3 = document.getElementById('magic3');
    sounds.laugh = document.getElementById('laugh');

    // Phase 8 - Final Eclipse
    sounds.eclipseAmbience = document.getElementById('finale_hymn');
    sounds.shard1 = document.getElementById('shard1');
    sounds.shard2 = document.getElementById('shard2');
    sounds.shard3 = document.getElementById('shard3');
    sounds.whisper = document.getElementById('whisper');

    // Preload and log sounds
    preloadSounds();
    for (const key in sounds) {
        const sound = sounds[key];
        if (sound) {
            sound.addEventListener('play', () => console.log(`Playing: ${key}`));
            sound.addEventListener('ended', () => console.log(`Ended: ${key}`));
        }
    }

    //  Setup debug and score display
    if (!document.getElementById('debug-info')) {
        const debugInfo = document.createElement('div');
        debugInfo.id = 'debug-info';
        document.body.appendChild(debugInfo);
    }

    if (!document.getElementById('score-display')) {
        const scoreDisplay = document.createElement('div');
        scoreDisplay.id = 'score-display';
        document.body.appendChild(scoreDisplay);
    }

    //  Style & Canvas Setup
    document.body.style.backgroundColor = '#a1c8f7';
    canvas.style.backgroundColor = '#a1c8f7';
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    //  Load game assets
    await Promise.all([loadObstacles(), loadCollectibles()]);

    // Initialize game state
    player = new Player(50, 50);
    phaseStartTime = Date.now();
    timeLeft = PHASE1_TIME_LIMIT;

    setupControls();
    gameLoop();
}

    function preloadSounds() {
        for (const key in sounds) {
            const sound = sounds[key];
            if (sound) {
                sound.load();
            }
        }
    }
    
    

    document.addEventListener('DOMContentLoaded', () => {
        document.body.addEventListener('click', () => {
            if (gameStarted) return;
            gameStarted = true;
            unlockAudio();
            initGame();  // start game only after click
        }, { once: true });
    });
