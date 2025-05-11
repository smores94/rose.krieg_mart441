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

const PHASE2_COUNT = 10; // Number of phase 2 collectibles needed to win
const PHASE3_COUNT = 15; // Number of phase 3 collectibles needed to win
const PHASE4_COUNT = 20; // Number of phase 4 collectibles needed to win
const PHASE5_COUNT = 25; // Number of phase 5 collectibles needed to win
const PHASE6_COUNT = 30; // Number of phase 6 collectibles needed to win
const PHASE7_COUNT = 15; // Number of phase 7 collectibles needed to win
const PHASE8_COUNT = 40; // Number of phase 8 collectibles needed to win
const PHASE1_SCORE_REQUIRED = 150;
const PHASE2_SCORE_REQUIRED = 350;
const PHASE3_SCORE_REQUIRED = 500;
const PHASE4_SCORE_REQUIRED = 850;
const PHASE5_SCORE_REQUIRED = 1000;
const PHASE6_SCORE_REQUIRED = 2000;
const PHASE7_SCORE_REQUIRED = 3000;
const PHASE8_SCORE_REQUIRED = 4500;  // Final win condition

const unlockedPhases = new Set();
const MAX_PARTICLES = 50;   // or however many simultaneous embers
// shrink all obstacles by 20%
const OBSTACLE_SCALE = 0.8;




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
let emberParticles = [];
// track which ambience is currently playing
let currentAmbientPhase = null;






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


function playAmbientForPhase(phase) {
    // stop every ambient track
    [ sounds.mirrorAmbience, sounds.fairyDance, sounds.eclipseAmbience ].forEach(a => {
      if (a) {
        a.pause();
        a.currentTime = 0;
      }
    });
    // pick the right one
    let amb = null;
    if (phase === 6) amb = sounds.mirrorAmbience;
    else if (phase === 7) amb = sounds.fairyDance;
    else if (phase === 8) amb = sounds.eclipseAmbience;
    // play it looped
    if (amb) {
      amb.loop = true;
      amb.play().catch(() => {});
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
    // In Mirror World (phase 6), override to a flashing silver
    if (currentPhase === 6) {
      // cycle through a few silvers every 200ms
      const shades = ['#888', '#AAA', '#CCC'];
      const idx = Math.floor(Date.now() / 200) % shades.length;
      ctx.fillStyle     = shades[idx];
      ctx.shadowColor   = 'rgba(255,255,255,0.6)';
      ctx.shadowBlur    = 12;
      ctx.strokeStyle   = 'rgba(200,200,200,0.4)';
      ctx.lineWidth     = 2;
    } else {
      // your normal, colorful obstacle styling
      ctx.fillStyle     = this.color;
      ctx.strokeStyle   = 'rgba(0, 0, 0, 0.3)';
      ctx.lineWidth     = 2;
      ctx.shadowColor   = 'rgba(0, 0, 0, 0.2)';
      ctx.shadowBlur    = 5;
    }

    // draw the body
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    ctx.shadowBlur = 0;

    // still draw details (trunk/roof/posts), but in Mirror World
    // it'll appear in the silver outline above
    this.addObstacleDetails();
  }

    addObstacleDetails() {
        switch(this.type) {
            case 'tree':
                ctx.fillStyle = '#5D4037';
                ctx.fillRect(
                    this.x + this.width/2 - 5, 
                    this.y + this.height - 20, 
                    10, 
                    20
                );
                break;
                
            case 'house':
                ctx.fillStyle = '#8B0000';
                ctx.beginPath();
                ctx.moveTo(this.x, this.y + 30);
                ctx.lineTo(this.x + this.width/2, this.y);
                ctx.lineTo(this.x + this.width, this.y + 30);
                ctx.closePath();
                ctx.fill();
                
                ctx.fillStyle = '#5D4037';
                ctx.fillRect(
                    this.x + this.width/2 - 15,
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
                        this.x + (i * (this.width/postCount)) + 5,
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
        this.value       = value;
        this.collected   = false;
        this.phase       = phase;
        this.direction   = Math.random() * Math.PI * 2;
        this.speed       = COLLECTIBLE_BASE_SPEED + (value / 40);
        this.bounceCount = 0;
        this.stepCounter = 0;    // for phase-8 incremental drops
    }

    update() {
        if (this.collected) return;

        // Phase 8: slow, vertical “dropping” in steps
        if (currentPhase === 8) {
            this.stepCounter++;
            // only move every 8 frames
            if (this.stepCounter % 8 === 0) {
                this.y += this.speed;
                // wrap back to top if off-screen
                if (this.y > CANVAS_HEIGHT) {
                    this.y = -this.height;
                }
            }
            return;
        }

        // Random direction changes (more frequent when bouncing)
        if (Math.random() < (this.bounceCount > 0 ? 0.1 : 0.05)) {
            this.direction += (Math.random() - 0.5) * Math.PI / 2;
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


        switch (this.type) {
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



class Player extends GameObject {
    constructor(x, y) {
        super(x, y, PLAYER_SIZE, PLAYER_SIZE, 'player');
        this.speed = 5;
        this.color = '#FF0000';
        this.defaultColor = '#FF0000';
        this.hitColor = '#FF3333';
        this.flashTimeout = null;
        this.lastCollisionTime = 0;
        this.collisionCooldown = 300; // 300ms cooldown between collisions
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2 + (this.width / 4), this.y + this.height / 2 - (this.height / 4), this.width / 8, 0, Math.PI * 2);
        ctx.fill();
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

        if (newX < 0 || newX > CANVAS_WIDTH - this.width ||
            newY < 0 || newY > CANVAS_HEIGHT - this.height) {
            return;
        }

        const now = Date.now();
        if (now - this.lastCollisionTime < this.collisionCooldown) {
            return;
        }

        let canMove = true;
        const tempPlayer = new Player(newX, newY);

        for (const obstacle of obstacles) {
            if (tempPlayer.collidesWith(obstacle)) {
                this.handleCollision();
                canMove = false;
                break;
            }
        }

        for (const danger of dangerObstacles) {
            if (tempPlayer.collidesWith(danger)) {
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
        // Apply penalty
        score = Math.max(0, score - 50);
        updateScore();
    
        if (score <= 0 && !gameOver) {
            triggerGameOver();
            return;
        }
    
        this.flash();
    
        // pick danger sound by phase
        let s;
        if      (currentPhase === 6) s = sounds.glitch;
        else if (currentPhase === 7) s = sounds.laugh;
        else if (currentPhase === 8) s = sounds.metalscrape;
        else                          s = sounds.lose;
    
        if (s) {
            s.currentTime = 0;
            s.play().catch(() => {});
        }
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
        if (gameOver) return; // Don't collect after game ends

        for (let i = collectibles.length - 1; i >= 0; i--) {
            const collectible = collectibles[i];
            if (!collectible.collected &&
                collectible.phase <= currentPhase &&
                this.isNear(collectible)) {

                collectible.collected = true;
                score += collectible.value;

                updateScore();
    
               // Track how many collected
// Track how many collected
if (collectible.phase === 1) {
    phase1Collected++;
    if (currentPhase === 1 && phase1Collected >= PHASE1_COUNT && score >= 150) {
        currentPhase = 2;
        phaseStartTime     = Date.now();
        timeWarningPlayed  = false;
        phaseUnlockMessage = 'Phase 2 Unlocked!';
        phaseUnlockTimer   = Date.now();
        console.log("Phase 2 unlocked!");
        if (sounds.level) sounds.level.play();
    }
} 
else if (collectible.phase === 2) {
    phase2Collected++;
    if (currentPhase === 2 && phase2Collected >= PHASE2_COUNT && score >= 450) {
        if (!gameOver) spawnDangerObstacles(2);
        currentPhase = 3;
        phaseStartTime     = Date.now();
        timeWarningPlayed  = false;
        phaseUnlockMessage = 'Phase 3 Unlocked!';
        phaseUnlockTimer   = Date.now();
        console.log("Phase 3 unlocked!");
        if (sounds.level) sounds.level.play();
    }
} 
else if (collectible.phase === 3) {
    phase3Collected++;
    if (currentPhase === 3 && phase3Collected >= PHASE3_COUNT && score >= 800) {
        if (!gameOver) spawnDangerObstacles(2);
        currentPhase = 4;
        phaseStartTime     = Date.now();
        timeWarningPlayed  = false;
        phaseUnlockMessage = 'Phase 4 Unlocked!';
        phaseUnlockTimer   = Date.now();
        console.log("Phase 4 unlocked!");
        if (sounds.level) sounds.level.play();
    }
} 
else if (collectible.phase === 4) {
    phase4Collected++;
    if (currentPhase === 4 && phase4Collected >= PHASE4_COUNT && score >= 1500) {
        if (!gameOver) spawnDangerObstacles(1);
        currentPhase = 5;
        phaseStartTime     = Date.now();
        timeWarningPlayed  = false;
        phaseUnlockMessage = 'Phase 5 Unlocked!';
        phaseUnlockTimer   = Date.now();
        console.log("Phase 5 unlocked!");
        if (sounds.level) sounds.level.play();
    }
} 
else if (collectible.phase === 5) {
    phase5Collected++;
    if (currentPhase === 5 && phase5Collected >= PHASE5_COUNT && score >= PHASE5_SCORE_REQUIRED) {
        if (!gameOver) spawnDangerObstacles(3);
        currentPhase = 6;
        phaseStartTime     = Date.now();
        phaseUnlockMessage = 'Mirror World Unlocked!';
        phaseUnlockTimer   = Date.now();
        if (sounds.level) sounds.level.play();
    }
}
else if (collectible.phase === 6) {
    phase6Collected++;
    if (currentPhase === 6 && phase6Collected >= PHASE6_COUNT && score >= PHASE6_SCORE_REQUIRED) {
        if (!gameOver) spawnDangerObstacles(3);
        currentPhase = 7;
        phaseStartTime     = Date.now();
        phaseUnlockMessage = 'Glitch World Unlocked!';
        phaseUnlockTimer   = Date.now();
        if (sounds.level) sounds.level.play();
    }
}
else if (collectible.phase === 7) {
    phase7Collected++;
    if (currentPhase === 7 && phase7Collected >= PHASE7_COUNT && score >= PHASE7_SCORE_REQUIRED) {
        if (!gameOver) spawnDangerObstacles(4);
        currentPhase = 8;
        phaseStartTime     = Date.now();
        phaseUnlockMessage = 'Final Eclipse Unlocked!';
        phaseUnlockTimer   = Date.now();
        if (sounds.level) sounds.level.play();
    }
}
else if (collectible.phase === 8) {
    phase8Collected++;
    if (currentPhase === 8 && phase8Collected >= PHASE8_COUNT && score >= PHASE8_SCORE_REQUIRED) {
        phaseUnlockMessage = 'Winner Winner Chicken Dinner!';
        phaseUnlockTimer   = Date.now();
        console.log("You win! 🎉");
        if (sounds.win) sounds.win.play();
        gameOver = true;
    }
}
                
    
                updateScore();
    
                function playCollectSound() {
                    let options;
                  
                    if (currentPhase === 6) {
                      // Mirror World: use mirrorCollect + coin sounds
                      options = [
                        sounds.mirrorCollect,
                        sounds.coin1, sounds.coin2, sounds.coin3
                      ];
                    } else if (currentPhase === 7) {
                      // Fairyland: magic chimes
                      options = [sounds.magic1, sounds.magic2, sounds.magic3];
                    } else if (currentPhase === 8) {
                      // Final Eclipse: shards
                      options = [sounds.shard1, sounds.shard2, sounds.shard3];
                    } else {
                      // Phases 1–5: default coin/treasure
                      options = [sounds.collect, sounds.collect2, sounds.treasure];
                    }
                  
                    // Filter out any IDs that weren’t found, pick one at random, and play it
                    options = options.filter(s => s);
                    if (options.length) {
                      const s = options[Math.floor(Math.random() * options.length)];
                      s.currentTime = 0;
                      s.play().catch(e => console.warn('Collect sound failed:', e));
                    }
                  }
                  
                   
let opts;
if (currentPhase === 6) {
  opts = [sounds.mirrorSpawn, sounds.mirrorSpawn2, sounds.echofade];
} else if (currentPhase === 7) {
  opts = [sounds.magic1, sounds.magic2, sounds.magic3];
} else if (currentPhase === 8) {
  opts = [sounds.shard1, sounds.shard2, sounds.shard3];
} else {
  opts = [sounds.collect, sounds.collect2, sounds.treasure];
}

// pick one that actually exists and play it
opts = opts.filter(s => s);
if (opts.length) {
  const s = opts[Math.floor(Math.random() * opts.length)];
  s.currentTime = 0;
  s.play();
}

playCollectSound()

                }
            }
        }
    }



function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
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
            ctx.moveTo(Math.random() * CANVAS_WIDTH, Math.random() * CANVAS_HEIGHT);
            for (let j = 0; j < 4; j++) {
                ctx.lineTo(
                    Math.random() * CANVAS_WIDTH,
                    Math.random() * CANVAS_HEIGHT
                );
            }
            ctx.stroke();
        }
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



    function spawnDangerObstacles(count) {
        console.log(`Spawning ${count} danger obstacles at phase ${currentPhase}`);
        for (let i = 0; i < count; i++) {
            const size = 30;
            const x = Math.random() * (CANVAS_WIDTH - size);
            const y = Math.random() * (CANVAS_HEIGHT - size);
            dangerObstacles.push(new DangerObstacle(x, y, size, size));
        }
    }
    
    function createEmberParticle() {
        return {
            x: Math.random() * CANVAS_WIDTH,
            y: CANVAS_HEIGHT + 10,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: 0.5 + Math.random() * 1.5,
            radius: 2 + Math.random() * 2,
            life:   60 + Math.floor(Math.random() * 60),
            opacity: 0.3 + Math.random() * 0.7
        };
    }
    
    function updateAndDrawEmberParticles() {
        // spawn up to MAX_PARTICLES
        if (emberParticles.length < MAX_PARTICLES && Math.random() < 0.2) {
            emberParticles.push(createEmberParticle());
        }
    
        ctx.save();
        for (let i = emberParticles.length - 1; i >= 0; i--) {
            let p = emberParticles[i];
            ctx.globalAlpha = p.opacity * (p.life / 120);
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI*2);
            ctx.fillStyle = '#FF4500';
            ctx.fill();
    
            p.x += p.speedX;
            p.y -= p.speedY;   // rising ember
            p.life--;
    
            if (p.life <= 0) emberParticles.splice(i, 1);
        }
        ctx.restore();
        ctx.globalAlpha = 1;
    }
    
    function activateShieldBonus() {
        shieldActive   = true;
        shieldEndTime  = Date.now() + 20000; // 20 seconds
        console.log("🛡️ Shield activated!");
        if (sounds.shieldhit) {
            sounds.shieldhit.currentTime = 0;
            sounds.shieldhit.play();
        }
    }
    
    function updateAndDrawFairyParticles() {
        if (currentPhase !== 7) return;
    
        // spawn twinkles (bump base size up to 24–40px)
        if (fairyParticles.length < 30 && Math.random() < 0.3) {
            fairyParticles.push({
                x:      Math.random() * CANVAS_WIDTH,
                y:      Math.random() * CANVAS_HEIGHT,
                size:   24 + Math.random() * 16,   // was 16–24, now 24–40
                life:   100 + Math.random() * 50,
                symbol: Math.random() < 0.5 ? '✨' : '🧚'
            });
        }
    
        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
    
        for (let i = fairyParticles.length - 1; i >= 0; i--) {
            const p = fairyParticles[i];
            ctx.globalAlpha = p.life / 150;
    
            // use each particle’s own size for the font
            ctx.font = `${p.size}px Arial`;
            ctx.fillText(p.symbol, p.x, p.y);
    
            // float upward
            p.y    -= 0.3;
            p.life -= 1;
    
            if (p.life <= 0) fairyParticles.splice(i, 1);
        }
    
        ctx.restore();
        ctx.globalAlpha = 1;
    }
    
    



    async function loadObstacles() {
        // Only use colorful types (no gray “rock”)
        const types = ['tree','pond','fence','house'];
        const sizePresets = {
          tree:  { minW: 50, maxW: 100,  minH: 75,  maxH: 150 },
          pond:  { minW: 120, maxW: 240, minH: 90,  maxH: 180 },
          fence: { minW: 200, maxW: 400, minH: 20,  maxH: 40  },
          house: { minW: 100, maxW: 200, minH: 120, maxH: 240 }
        };
      
        // Helper: spawn N random obstacles of random colorful types & sizes
        function generateRandomObstacles(count) {
          const arr = [];
          for (let i = 0; i < count; i++) {
            const type = types[Math.floor(Math.random() * types.length)];
            const p    = sizePresets[type];
            const w = p.minW + Math.random() * (p.maxW - p.minW);
            const h = p.minH + Math.random() * (p.maxH - p.minH);
            const wScaled = w * OBSTACLE_SCALE;
            const hScaled = h * OBSTACLE_SCALE;
            const x    = 20 + Math.random() * (CANVAS_WIDTH  - w - 40);
            const y    = 20 + Math.random() * (CANVAS_HEIGHT - h - 40);
            arr.push(new Obstacle(x, y, w, h, type));
          }
          return arr;
        }
      
        try {
          const resp = await fetch('obstacles.json');
          const data = await resp.json();
          // Map JSON items into colorful, randomly sized obstacles
          obstacles = data.map(() => {
            const type = types[Math.floor(Math.random() * types.length)];
            const p    = sizePresets[type];
            const w    = p.minW + Math.random() * (p.maxW - p.minW);
            const h    = p.minH + Math.random() * (p.maxH - p.minH);
            const x    = 20 + Math.random() * (CANVAS_WIDTH  - w - 40);
            const y    = 20 + Math.random() * (CANVAS_HEIGHT - h - 40);
            return new Obstacle(x, y, w, h, type);
          });
          // only a few extras
          obstacles = obstacles.concat(generateRandomObstacles(5));
        } catch (e) {
          console.error('Obstacle JSON failed, using purely random:', e);
          // fallback: just spawn a bunch of random ones
          obstacles = generateRandomObstacles(20);
        }
      
        // Clear out a spawn‐safe zone at center
        const cx = CANVAS_WIDTH/2, cy = CANVAS_HEIGHT/2, clearR = 150;
        obstacles = obstacles.filter(o => {
          const ox = o.x + o.width/2, oy = o.y + o.height/2;
          return Math.hypot(ox - cx, oy - cy) > clearR;
        });
      
        // Trim down to about 30% so they’re not too crowded
        const keep = Math.ceil(obstacles.length * 0.1);
        obstacles = obstacles
          .sort(() => 0.5 - Math.random())
          .slice(0, keep);
      
        console.log(`Loaded ${obstacles.length} colorful obstacles`);
      }
      


      async function loadCollectibles() {
        try {
          const resp = await fetch('collectibles.json');
          const data = await resp.json();
      
          // split out the Phase-7 items
          const phase7 = data.filter(c => c.phase === 7);
          const others = data.filter(c => c.phase !== 7);
      
          // trim Phase-7 to at most MAX items
          const MAX_PHASE7 = 20;              // ← change this to taste
          const trimmed7 = shuffle(phase7).slice(0, MAX_PHASE7);
      
          // reassemble the final list
          const finalData = others.concat(trimmed7);
      
          collectibles = finalData.map(item =>
            new Collectible(
              item.x, item.y,
              item.width, item.height,
              item.type, item.value,
              item.phase
            )
          );
        } catch (err) {
          console.error('Error loading collectibles:', err);
          collectibles = [];
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

function updateDebugInfo() {
    const debugElement = document.getElementById('debug-info');
    if (debugElement) {
        let phaseTimeLimit;
        if (currentPhase === 1) phaseTimeLimit = PHASE1_TIME_LIMIT;
        else if (currentPhase === 2) phaseTimeLimit = PHASE2_TIME_LIMIT;
        else if (currentPhase === 3) phaseTimeLimit = PHASE3_TIME_LIMIT;
        else if (currentPhase === 4) phaseTimeLimit = PHASE4_TIME_LIMIT;
        else if (currentPhase === 5) phaseTimeLimit = PHASE5_TIME_LIMIT;
        else if (currentPhase === 6) phaseTimeLimit = PHASE6_TIME_LIMIT;
        else if (currentPhase === 7) phaseTimeLimit = PHASE7_TIME_LIMIT;
        else if (currentPhase === 8) phaseTimeLimit = PHASE8_TIME_LIMIT;
        else phaseTimeLimit = PHASE5_TIME_LIMIT;

        timeLeft = phaseTimeLimit - (Date.now() - phaseStartTime);
        if (timeLeft < 0) timeLeft = 0;
        
        if (timeLeft < 10000 && !timeWarningPlayed) {
            if (sounds.warning) sounds.warning.play();
            timeWarningPlayed = true;
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

// ── gameLoop ──
function gameLoop() {
    if (gameOver) return;
  
    // 1) Clear last frame
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  
    // 2) Phase-based full-canvas tint
    if (currentPhase === 6) {
      ctx.fillStyle = '#444';        // Mirror world grey
    } else if (currentPhase === 7) {
      ctx.fillStyle = '#FFB6C1';     // Glitch world pink
    } else if (currentPhase === 8) {
      ctx.fillStyle = '#8B4513';     // Final eclipse brown
    }
    if (currentPhase >= 6) {
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }

  // 3) ambient switch
  if (currentPhase >= 6 && currentPhase !== currentAmbientPhase) {
    currentAmbientPhase = currentPhase;
    playAmbientForPhase(currentPhase);
  }

      // Ghost player in mirror world
      if (currentPhase === 6 && ghostPlayer) {
        ghostPlayer.updateTrail(player.x, player.y);
        ghostPlayer.draw();
    }


    // Visual effects
    if (currentPhase === 8) {
        updateAndDrawEmberParticles();
      }
      if (currentPhase === 7) {
        updateAndDrawFairyParticles();
      }


      // Phase-8 special effects
  if (currentPhase === 8) {
    drawDarknessOverlay();           // radial “flashlight” around player
    drawCrackedEarthOverlay();       // subtle crack lines
    drawFinalEclipseGradient();      // screen-wide gradient
    drawGhostlyMist();               // drifting mist
  }

  // Draw obstacles
  obstacles.forEach(o => o.draw());

  // Update & draw collectibles so they move
  collectibles.forEach(c => c.update());
  collectibles.forEach(c => c.draw());

  // Player
  player.update();
  player.draw();

  // Danger obstacles
  dangerObstacles.forEach(d => {
    d.update();
    d.draw();
  });

  // Shield expiry
  if (shieldActive && Date.now() > shieldEndTime) {
    shieldActive = false;
    console.log("Shield expired");
  }

  checkPhaseTimeout();

  // Phase unlock banner
  if (phaseUnlockMessage && (Date.now() - phaseUnlockTimer) < 3000) {
    ctx.font = 'bold 48px Arial';
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 4;
    ctx.textAlign = 'center';
    ctx.strokeText(phaseUnlockMessage, CANVAS_WIDTH/2, CANVAS_HEIGHT/2);
    ctx.fillText(phaseUnlockMessage, CANVAS_WIDTH/2, CANVAS_HEIGHT/2);
  }

  updateDebugInfo();
  requestAnimationFrame(gameLoop);
}

function checkPhaseTimeout() {
    const now = Date.now();
    let phaseTimeLimit;

    if (currentPhase === 1) phaseTimeLimit = PHASE1_TIME_LIMIT;
    else if (currentPhase === 2) phaseTimeLimit = PHASE2_TIME_LIMIT;
    else if (currentPhase === 3) phaseTimeLimit = PHASE3_TIME_LIMIT;
    else if (currentPhase === 4) phaseTimeLimit = PHASE4_TIME_LIMIT;
    else if (currentPhase === 5) phaseTimeLimit = PHASE5_TIME_LIMIT;
    else if (currentPhase === 6) phaseTimeLimit = PHASE6_TIME_LIMIT;
    else if (currentPhase === 7) phaseTimeLimit = PHASE7_TIME_LIMIT;
    else if (currentPhase === 8) phaseTimeLimit = PHASE8_TIME_LIMIT;

    else phaseTimeLimit = PHASE5_TIME_LIMIT;

    if (now - phaseStartTime > phaseTimeLimit) {
        // ✅ Correct collectible + score checks
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

    showRestartButton(); // ⬅️ NEW!
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

    // Reset game flags and variables
    gameOver = false;
    score = 0;
    currentPhase = 1;
    phase1Collected = 0;
    phase2Collected = 0;
    phase3Collected = 0;
    phase4Collected = 0;
    phase5Collected = 0;
    phaseUnlockMessage = '';
    timeWarningPlayed = false;

    // Clear arrays
    obstacles = [];
    collectibles = [];
    dangerObstacles = [];

    // Fully clear canvas
    if (ctx) ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Reset keys
    keys = {};

    // Remove old canvas events if needed (optional)
    window.removeEventListener('resize', resizeCanvas);

    // Force reload assets from scratch
    initGame();  
}




window.onload = function() {
    document.body.addEventListener('click', () => {
      preloadSounds();   // load everything
      unlockAudio();     // then play/pause to unlock
      startGame();       // finally kick off initGame()
    }, { once: true });
  };

function startGame() {
    initGame();
}

async function initGame() {
    canvas = document.getElementById('game-canvas');
    if (!canvas) {
        console.error('Canvas element not found!');
        return;
    }
    ctx = canvas.getContext('2d');

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
     sounds.glitch = document.getElementById('glitch');
 
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
     sounds.metalscrape = document.getElementById('metalscrape');
 
     // Preload and log sounds
     preloadSounds();
     for (const key in sounds) {
         const sound = sounds[key];
         if (sound) {
             sound.addEventListener('play', () => console.log(`Playing: ${key}`));
             sound.addEventListener('ended', () => console.log(`Ended: ${key}`));
         }
     }


    // Create debug and score elements if missing
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

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    await Promise.all([
        loadObstacles(),
        loadCollectibles()
      ]);

    // spawn in the middle of the canvas, where we cleared obstacles:
     const spawnX = (CANVAS_WIDTH - PLAYER_SIZE) / 2;
  const spawnY = (CANVAS_HEIGHT - PLAYER_SIZE) / 2;
  player = new Player(spawnX, spawnY);

  phaseStartTime = Date.now();
  timeLeft       = PHASE1_TIME_LIMIT;

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

function unlockAudio() {
    for (const key in sounds) {
        const sound = sounds[key];
        if (sound) {
            sound.play().then(() => {
                sound.pause();
                sound.currentTime = 0;
            }).catch((error) => {
                console.log('Audio unlock failed:', key, error);
            });
        }
    }
}
