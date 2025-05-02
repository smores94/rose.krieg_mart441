// Game Constants
const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 800;
const PLAYER_SIZE = 40;
const SCORE_INCREMENT = 10;
const PHASE1_COUNT = 5;
const OBSTACLE_PENALTY = 5;
const COLLECTIBLE_BASE_SPEED = .4;
const KNOCKBACK_FORCE = 0.5;
const FLASH_DURATION = 200;
const PHASE2_COUNT = 15; // Number of phase 2 collectibles needed to win
const PHASE3_COUNT = 20; // Number of phase 3 collectibles needed to win
const PHASE4_COUNT = 25; // Number of phase 4 collectibles needed to win
const PHASE5_COUNT = 30; // Number of phase 5 collectibles needed to win
const PHASE1_TIME_LIMIT = 40000;
const PHASE2_TIME_LIMIT = 70000;
const PHASE3_TIME_LIMIT = 90000;
const PHASE4_TIME_LIMIT = 130000;
const PHASE5_TIME_LIMIT = 180000;
const PHASE1_SCORE_REQUIRED = 150; 
const PHASE2_SCORE_REQUIRED = 450;
const PHASE3_SCORE_REQUIRED = 800;
const PHASE4_SCORE_REQUIRED = 1500;
const PHASE5_SCORE_REQUIRED = 2000;  // Final win condition



// Game Variables
let canvas, ctx;
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
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.lineWidth = 2;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
        ctx.shadowBlur = 5;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        ctx.shadowBlur = 0;
        
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
        this.color = '#FF0000'; // Bright red danger
        this.speedX = (Math.random() - 0.5) * 4;
        this.speedY = (Math.random() - 0.5) * 4;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Bounce off walls
        if (this.x < 0 || this.x > CANVAS_WIDTH - this.width) {
            this.speedX *= -1;
        }
        if (this.y < 0 || this.y > CANVAS_HEIGHT - this.height) {
            this.speedY *= -1;
        }
    }

    draw() {
        ctx.fillStyle = '#8B0000'; // dark red background for danger
        ctx.fillRect(this.x, this.y, this.width, this.height);

        ctx.fillStyle = 'white';
        ctx.font = `${this.width * 0.6}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Draw skull emoji ☠️ or just "!"
        ctx.fillText('☠️', this.x + this.width/2, this.y + this.height/2);
    }
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
        if (this.collected || this.phase > currentPhase) return;  // FIRST: skip if collected or wrong phase
    
        this.update();  // THEN: update position (bounce, move)
    
        const colors = {
            'coin': '#FFD700',
            'gem': '#FF1493',
            'star': '#00BFFF',
            'diamond': '#00FF7F',
            'crown': '#9370DB'
        };
    
        ctx.fillStyle = colors[this.type] || '#FFFF00';
    
        switch(this.type) {
            case 'coin':
                ctx.beginPath();
                ctx.arc(
                    this.x + this.width/2,
                    this.y + this.height/2,
                    this.width/2,
                    0,
                    Math.PI * 2
                );
                ctx.fill();
                break;
    
            case 'gem':
                ctx.beginPath();
                ctx.moveTo(this.x + this.width/2, this.y);
                ctx.lineTo(this.x + this.width, this.y + this.height/2);
                ctx.lineTo(this.x + this.width/2, this.y + this.height);
                ctx.lineTo(this.x, this.y + this.height/2);
                ctx.closePath();
                ctx.fill();
                break;
    
            case 'star':
                drawStar(
                    ctx,
                    this.x + this.width/2,
                    this.y + this.height/2,
                    5,
                    this.width/2,
                    this.width/4
                );
                break;
    
            case 'diamond':
                ctx.beginPath();
                ctx.moveTo(this.x + this.width/2, this.y);
                ctx.lineTo(this.x + this.width, this.y + this.height/2);
                ctx.lineTo(this.x + this.width/2, this.y + this.height);
                ctx.lineTo(this.x, this.y + this.height/2);
                ctx.closePath();
                ctx.fill();
                break;
    
            case 'crown':
                ctx.beginPath();
                ctx.moveTo(this.x + 10, this.y + this.height - 10);
                ctx.lineTo(this.x + this.width - 10, this.y + this.height - 10);
                ctx.lineTo(this.x + this.width/2, this.y + 10);
                ctx.lineTo(this.x + 10, this.y + this.height - 10);
                ctx.fill();
                break;
    
            default:
                ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}
    

function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
    let rot = Math.PI/2 * 3;
    let x = cx;
    let y = cy;
    let step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    
    for(let i = 0; i < spikes; i++) {
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
        score = Math.max(0, score - 50);  // Danger penalty
        updateScore();

        if (score <= 0 && !gameOver) {
            triggerGameOver();
            return;
        }

        this.flash();
        if (sounds.lose) sounds.lose.play();
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
if (collectible.phase === 1) {
    phase1Collected++;
    if (currentPhase === 1 && phase1Collected >= PHASE1_COUNT && score >= 150) {
        currentPhase = 2;
        phaseStartTime = Date.now(); // 🔧 Reset timer
        timeWarningPlayed = false;
        phaseUnlockMessage = 'Phase 2 Unlocked!';
        phaseUnlockTimer = Date.now();
        console.log("Phase 2 unlocked!");
        spawnCollectibles(2, 10);
        if (sounds.level) sounds.level.play();
    }
} 
else if (collectible.phase === 2) {
    phase2Collected++;
    if (currentPhase === 2 && phase2Collected >= PHASE2_COUNT && score >= 450) {
        if (!gameOver) spawnDangerObstacles(2); // ✅ 2 dangers for Level 3
        currentPhase = 3;
        phaseStartTime = Date.now(); // 🔧 Reset timer
        timeWarningPlayed = false;
        phaseUnlockMessage = 'Phase 3 Unlocked!';
        phaseUnlockTimer = Date.now();
        console.log("Phase 3 unlocked!");
        spawnCollectibles(3, 20);
        if (sounds.level) sounds.level.play();
    }
} 
else if (collectible.phase === 3) {
    phase3Collected++;
    if (currentPhase === 3 && phase3Collected >= PHASE3_COUNT && score >= 800) {
        if (!gameOver) spawnDangerObstacles(2); // ✅ 4 dangers for Level 4
        currentPhase = 4;
        phaseStartTime = Date.now(); // 🔧 Reset timer
        timeWarningPlayed = false;
        phaseUnlockMessage = 'Phase 4 Unlocked!';
        phaseUnlockTimer = Date.now();
        console.log("Phase 4 unlocked!");
        spawnCollectibles(4, 25);
        if (sounds.level) sounds.level.play();
    }
} 
else if (collectible.phase === 4) {
    phase4Collected++;
    if (currentPhase === 4 && phase4Collected >= PHASE4_COUNT && score >= 1500) {
        if (!gameOver) spawnDangerObstacles(2); // ✅ 6 dangers for Level 5
        currentPhase = 5;
        phaseStartTime = Date.now(); // 🔧 Reset timer
        timeWarningPlayed = false;
        phaseUnlockMessage = 'Phase 5 Unlocked!';
        phaseUnlockTimer = Date.now();
        console.log("Phase 5 unlocked!");
        spawnCollectibles(5, 30);
        if (sounds.level) sounds.level.play();
    }
} 
else if (collectible.phase === 5) {
    phase5Collected++;
    if (currentPhase === 5 && phase5Collected >= PHASE5_COUNT && score >= 2000) {
        phaseStartTime = Date.now(); // 🔧 Reset timer
        timeWarningPlayed = false;
        phaseUnlockMessage = 'Winner Winner Chicken Dinner!';
        phaseUnlockTimer = Date.now();
        console.log("You win! 🎉");
        if (sounds.win) sounds.win.play();
        gameOver = true; // ✅ Prevent further spawning
    }
}

    
                updateScore();
    
                // Play random collect sound
                const rand = Math.random();
                if (rand < 0.33 && sounds.collect) {
                    sounds.collect.currentTime = 0;
                    sounds.collect.play();
                } else if (rand < 0.66 && sounds.collect2) {
                    sounds.collect2.currentTime = 0;
                    sounds.collect2.play();
                } else if (sounds.treasure) {
                    sounds.treasure.currentTime = 0;
                    sounds.treasure.play();
                }
            }
        }
    }
}
    
function spawnCollectibles(phase, count) {
    const types = ['coin', 'gem', 'star', 'diamond', 'crown'];
    for (let i = 0; i < count; i++) {
        const type = types[Math.floor(Math.random() * types.length)];
        const value = (type === 'coin') ? 10 :
                      (type === 'gem') ? 50 :
                      (type === 'star') ? 100 :
                      (type === 'diamond') ? 200 :
                      500; // crown

        const size = (type === 'crown') ? 40 : 25;
        const x = Math.random() * (CANVAS_WIDTH - size);
        const y = Math.random() * (CANVAS_HEIGHT - size);

        collectibles.push(new Collectible(x, y, size, size, type, value, phase));
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
            new Collectible(150, 350, 20, 20, 'coin', 10, 1),
            new Collectible(400, 250, 25, 25, 'gem', 50, 1),
            new Collectible(650, 400, 30, 30, 'star', 100, 1),
            new Collectible(800, 150, 20, 20, 'coin', 10, 1),
            new Collectible(1000, 300, 25, 25, 'gem', 50, 1),

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

            // --- Phase 3 Items ---
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
            new Collectible(300, 300, 30, 30, 'diamond', 250, 3),
    new Collectible(600, 400, 30, 30, 'star', 150, 3),
    new Collectible(900, 500, 40, 40, 'crown', 600, 3),
    new Collectible(500, 200, 30, 30, 'diamond', 250, 3),
    new Collectible(1100, 300, 30, 30, 'star', 150, 3),
    new Collectible(800, 600, 40, 40, 'crown', 600, 3),
    new Collectible(200, 400, 30, 30, 'diamond', 250, 3),
    new Collectible(700, 700, 30, 30, 'star', 150, 3),
    new Collectible(1000, 600, 40, 40, 'crown', 600, 3),
    new Collectible(400, 500, 30, 30, 'diamond', 250, 3),
    new Collectible(750, 300, 30, 30, 'star', 150, 3),
    new Collectible(1050, 400, 40, 40, 'crown', 600, 3),
    new Collectible(250, 600, 30, 30, 'diamond', 250, 3),
    new Collectible(650, 200, 30, 30, 'star', 150, 3),
    new Collectible(950, 700, 40, 40, 'crown', 600, 3),
    new Collectible(450, 150, 30, 30, 'diamond', 250, 3),
    new Collectible(850, 350, 30, 30, 'star', 150, 3),
    new Collectible(1150, 650, 40, 40, 'crown', 600, 3),
    new Collectible(350, 250, 30, 30, 'diamond', 250, 3),
    new Collectible(650, 450, 30, 30, 'star', 150, 3),
    new Collectible(950, 250, 40, 40, 'crown', 600, 3),
    new Collectible(150, 550, 30, 30, 'diamond', 250, 3),
    new Collectible(550, 350, 30, 30, 'star', 150, 3),
    new Collectible(850, 150, 40, 40, 'crown', 600, 3),
    new Collectible(1050, 550, 30, 30, 'diamond', 250, 3),

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
            new Collectible(200, 200, 40, 40, 'crown', 650, 4),
    new Collectible(600, 300, 35, 35, 'diamond', 300, 4),
    new Collectible(1000, 400, 30, 30, 'star', 200, 4),
    new Collectible(400, 500, 40, 40, 'crown', 650, 4),
    new Collectible(800, 600, 35, 35, 'diamond', 300, 4),
    new Collectible(1200, 200, 30, 30, 'star', 200, 4),
    new Collectible(300, 400, 40, 40, 'crown', 650, 4),
    new Collectible(700, 200, 35, 35, 'diamond', 300, 4),
    new Collectible(1100, 500, 30, 30, 'star', 200, 4),
    new Collectible(500, 700, 40, 40, 'crown', 650, 4),
    new Collectible(900, 300, 35, 35, 'diamond', 300, 4),
    new Collectible(100, 500, 30, 30, 'star', 200, 4),
    new Collectible(600, 800, 40, 40, 'crown', 650, 4),
    new Collectible(400, 700, 35, 35, 'diamond', 300, 4),
    new Collectible(800, 400, 30, 30, 'star', 200, 4),
    new Collectible(200, 600, 40, 40, 'crown', 650, 4),
    new Collectible(500, 200, 35, 35, 'diamond', 300, 4),
    new Collectible(700, 600, 30, 30, 'star', 200, 4),
    new Collectible(900, 700, 40, 40, 'crown', 650, 4),
    new Collectible(300, 800, 35, 35, 'diamond', 300, 4),
    new Collectible(600, 400, 30, 30, 'star', 200, 4),
    new Collectible(800, 700, 40, 40, 'crown', 650, 4),
    new Collectible(1200, 600, 35, 35, 'diamond', 300, 4),
    new Collectible(400, 300, 30, 30, 'star', 200, 4),
    new Collectible(700, 500, 40, 40, 'crown', 650, 4),
    new Collectible(1000, 700, 35, 35, 'diamond', 300, 4),
    new Collectible(500, 400, 30, 30, 'star', 200, 4),
    new Collectible(800, 300, 40, 40, 'crown', 650, 4),
    new Collectible(1100, 400, 35, 35, 'diamond', 300, 4),
    new Collectible(300, 600, 30, 30, 'star', 200, 4),
    new Collectible(700, 400, 40, 40, 'crown', 650, 4),
    new Collectible(900, 500, 35, 35, 'diamond', 300, 4),
    new Collectible(200, 500, 30, 30, 'star', 200, 4),
    new Collectible(600, 600, 40, 40, 'crown', 650, 4),
    new Collectible(100, 300, 35, 35, 'diamond', 300, 4),

            // --- Phase 5 Items ---
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

function updateDebugInfo() {
    const debugElement = document.getElementById('debug-info');
    if (debugElement) {
        let phaseTimeLimit;
        if (currentPhase === 1) phaseTimeLimit = PHASE1_TIME_LIMIT;
        else if (currentPhase === 2) phaseTimeLimit = PHASE2_TIME_LIMIT;
        else if (currentPhase === 3) phaseTimeLimit = PHASE3_TIME_LIMIT;
        else if (currentPhase === 4) phaseTimeLimit = PHASE4_TIME_LIMIT;
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

function gameLoop() {
    if (gameOver) return;  // 🛑 Stop the loop if game over!

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    obstacles.forEach(o => o.draw());
    dangerObstacles.forEach(d => d.draw());
    collectibles.forEach(c => c.draw());
    player.update();
    player.draw();
    dangerObstacles.forEach(d => {
        d.update();
        d.draw();
    });

    updateDebugInfo();

    checkPhaseTimeout();  // 🛠 Check for timeout and failure

    if (phaseUnlockMessage && (Date.now() - phaseUnlockTimer) < 3000) {
        ctx.font = 'bold 48px Arial';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 4;
        ctx.textAlign = 'center';
        ctx.strokeText(phaseUnlockMessage, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
        ctx.fillText(phaseUnlockMessage, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    
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
    else phaseTimeLimit = PHASE5_TIME_LIMIT;

    if (now - phaseStartTime > phaseTimeLimit) {
        // ✅ Correct collectible + score checks
        if (
            (currentPhase === 1 && (phase1Collected < PHASE1_COUNT || score < PHASE1_SCORE_REQUIRED)) ||
            (currentPhase === 2 && (phase2Collected < PHASE2_COUNT || score < PHASE2_SCORE_REQUIRED)) ||
            (currentPhase === 3 && (phase3Collected < PHASE3_COUNT || score < PHASE3_SCORE_REQUIRED)) ||
            (currentPhase === 4 && (phase4Collected < PHASE4_COUNT || score < PHASE4_SCORE_REQUIRED)) ||
            (currentPhase === 5 && (phase5Collected < PHASE5_COUNT || score < PHASE5_SCORE_REQUIRED))
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
        unlockAudio();  // Unlock sounds
        startGame();    // Then start the game
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

    // Link sound elements
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


    preloadSounds();

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

    await Promise.all([loadObstacles(), loadCollectibles()]);

    player = new Player(50, 50);
    phaseStartTime = Date.now();
    timeLeft = PHASE1_TIME_LIMIT; // 🛠 Start with Phase 1 time limit!

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
