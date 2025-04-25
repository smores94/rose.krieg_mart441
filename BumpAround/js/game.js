// Game Constants
const GAME_WIDTH = 1200;
const GAME_HEIGHT = 800;

function initTitleScreen() {
    const titleCanvas = document.getElementById('title-canvas');
    const startButton = document.getElementById('start-button');
    
    // Set reasonable title screen size
    titleCanvas.width = 800;
    titleCanvas.height = 450;
    
    // Chromata initialization with proper error handling
    const img = new Image();
    img.src = './img/bumparound.jpg'; // Make sure this path is correct
    
    img.onerror = () => {
        console.error("Title image failed to load!");
        const ctx = titleCanvas.getContext('2d');
        ctx.fillStyle = '#222';
        ctx.fillRect(0, 0, titleCanvas.width, titleCanvas.height);
        ctx.fillStyle = '#fff';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('BUMP AROUND', titleCanvas.width/2, titleCanvas.height/2);
        startButton.style.opacity = 1;
    };
    
    img.onload = () => {
        try {
            const chromata = new Chromata(titleCanvas, img);
            chromata.start({
                particleSize: 2,
                particleGap: 1,
                animationDuration: 3000,
                animationType: 'random'
            });
            
            // Fallback check in case Chromata silently fails
            setTimeout(() => {
                if (!document.querySelector('.chromata-particle')) {
                    throw new Error("Chromata particles not detected");
                }
            }, 500);
        } catch (e) {
            console.warn("Chromata failed, using fallback:", e);
            const ctx = titleCanvas.getContext('2d');
            ctx.drawImage(img, 0, 0, titleCanvas.width, titleCanvas.height);
        }
        
        // Show start button after delay
        setTimeout(() => {
            startButton.style.opacity = '1';
            startButton.style.cursor = 'pointer';
        }, 1500);
    };
    
    startButton.addEventListener('click', startGame);
}

function startGame() {
    console.log("Starting game...");
    document.getElementById('title-screen').style.display = 'none';
    const gameContainer = document.getElementById('game-container');
    gameContainer.style.display = 'block';
    
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    
    // Set up responsive canvas
    function resize() {
        const scale = Math.min(
            window.innerWidth / GAME_WIDTH,
            window.innerHeight / GAME_HEIGHT
        );
        canvas.style.width = (GAME_WIDTH * scale) + 'px';
        canvas.style.height = (GAME_HEIGHT * scale) + 'px';
    }
    
    canvas.width = GAME_WIDTH;
    canvas.height = GAME_HEIGHT;
    window.addEventListener('resize', resize);
    resize();
    
    // Test rendering - should see a red square if working
    ctx.fillStyle = 'red';
    ctx.fillRect(100, 100, 50, 50);
    
    // Add debug output
    console.log("Canvas dimensions:", canvas.width, canvas.height);
    console.log("Display dimensions:", canvas.style.width, canvas.style.height);
}

document.addEventListener('DOMContentLoaded', initTitleScreen);
        // Show start button after delay
        setTimeout(() => {
            startButton.style.opacity = '1';
            startButton.style.cursor = 'pointer';
        }, 1500);
    
    
    startButton.addEventListener('click', startGame);


function startGame() {
    console.log("Starting game...");
    document.getElementById('title-screen').style.display = 'none';
    const gameContainer = document.getElementById('game-container');
    gameContainer.style.display = 'block';
    
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    
    // Set up responsive canvas
    function resize() {
        const scale = Math.min(
            window.innerWidth / GAME_WIDTH,
            window.innerHeight / GAME_HEIGHT
        );
        canvas.style.width = (GAME_WIDTH * scale) + 'px';
        canvas.style.height = (GAME_HEIGHT * scale) + 'px';
    }
    
    canvas.width = GAME_WIDTH;
    canvas.height = GAME_HEIGHT;
    window.addEventListener('resize', resize);
    resize();
    
    // Test rendering - should see a red square if working
    ctx.fillStyle = 'red';
    ctx.fillRect(100, 100, 50, 50);
    
    // Add debug output
    console.log("Canvas dimensions:", canvas.width, canvas.height);
    console.log("Display dimensions:", canvas.style.width, canvas.style.height);
}

document.addEventListener('DOMContentLoaded', initTitleScreen);
        
        // Show start button after animation
        setTimeout(() => {
            startButton.style.opacity = '1';
            startButton.style.cursor = 'pointer';
        }, 3500);
    
    
    // Start game button
    startButton.addEventListener('click', function() {
        // Hide title screen
        document.getElementById('title-screen').style.display = 'none';
        
        // Show game container
        gameContainer.style.display = 'block';
        
        // Initialize your game
        initGame();
    });


// Initialize title screen when DOM is loaded
document.addEventListener('DOMContentLoaded', initTitleScreen);


// Game Constants
const CANVAS_WIDTH = 1600;
const CANVAS_HEIGHT = 1200;
const PLAYER_SIZE = 60;
const SCORE_INCREMENT = 10;
const OBSTACLE_PENALTY = 5;
const COLLECTIBLE_BASE_SPEED = 0.4;
const KNOCKBACK_FORCE = 0.5;
const FLASH_DURATION = 200;

const LEVELS = {
    1: { collectiblesRequired: 5, timeLimit: 60000 },
    2: { collectiblesRequired: 5, timeLimit: 45000 },
    3: { collectiblesRequired: 8, timeLimit: 40000 },
    4: { collectiblesRequired: 10, timeLimit: 35000 },
    5: { collectiblesRequired: 15, timeLimit: 30000 }
};

// Game Variables
let canvas, ctx;
let obstacles = [];
let collectibles = [];
let player, mirrorPlayer, boss;
let keys = {};
let score = 0;
let currentPhase = 1;
let phaseCollected = 0;
let phaseStartTime;
let timeLeft;
let timeWarningPlayed = false;
let scale = 1;
let canvasOffsetX = 0;
let canvasOffsetY = 0;

// Sound objects
const sounds = {
    collect: null,
    phase: null,
    warning: null,
    obstacle: null
};

// Base Game Object Class
class GameObject {
    constructor(x, y, width, height, type) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type;
    }

    collidesWith(other) {
        return this.x < other.x + other.width &&
               this.x + this.width > other.x &&
               this.y < other.y + other.height &&
               this.y + this.height > other.y;
    }
}

// Obstacle Class
class Obstacle extends GameObject {
    constructor(x, y, width, height, type) {
        super(x, y, width, height, type);
        this.color = this.getRandomVariantColor(type);
        this.moveY = type === 'lava' ? -0.3 : 0;
    }

    getRandomVariantColor(type) {
        const colorVariations = {
            'tree': ['#2E8B57', '#3CB371', '#228B22', '#008000', '#006400'],
            'rock': ['#696969', '#808080', '#A9A9A9', '#778899', '#708090'],
            'pond': ['#1E90FF', '#00BFFF', '#87CEFA', '#4682B4', '#5F9EA0'],
            'fence': ['#8B4513', '#A0522D', '#D2691E', '#CD853F', '#B8860B'],
            'house': ['#CD5C5C', '#DC143C', '#B22222', '#8B0000', '#FF0000'],
            'lava': ['#FF4500']
        };
        return colorVariations[type]?.[Math.floor(Math.random() * colorVariations[type].length)] || '#A9A9A9';
    }

    createLavaPattern() {
        const patternCanvas = document.createElement('canvas');
        const pctx = patternCanvas.getContext('2d');
        patternCanvas.width = 50;
        patternCanvas.height = 50;
        
        pctx.fillStyle = '#FF4500';
        pctx.fillRect(0, 0, 50, 50);
        pctx.fillStyle = '#FF8C00';
        pctx.beginPath();
        pctx.arc(25, 25, 15, 0, Math.PI * 2);
        pctx.fill();
        
        return ctx.createPattern(patternCanvas, 'repeat');
    }

    update() {
        if (this.type === 'lava') {
            this.y += this.moveY;
            if (this.y < CANVAS_HEIGHT * 0.6) this.moveY *= -1;
        }
    }

    draw() {
        if (this.type === 'lava') {
            ctx.fillStyle = this.createLavaPattern();
            ctx.fillRect(this.x, this.y, this.width, this.height);
        } else {
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
    }

    addObstacleDetails() {
        switch(this.type) {
            case 'tree':
                ctx.fillStyle = '#5D4037';
                ctx.fillRect(this.x + this.width/2 - 5, this.y + this.height - 20, 10, 20);
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
                ctx.fillRect(this.x + this.width/2 - 15, this.y + this.height - 40, 30, 40);
                break;
            case 'fence':
                ctx.fillStyle = '#5D4037';
                const postCount = Math.floor(this.width / 30);
                for (let i = 0; i < postCount; i++) {
                    ctx.fillRect(this.x + (i * (this.width/postCount)) + 5, this.y, 5, this.height);
                }
                break;
        }
    }
}

// Collectible Class
class Collectible extends GameObject {
    constructor(x, y, width, height, type, value, phase = 1) {
        super(x, y, width, height, type);
        this.value = value;
        this.collected = false;
        this.phase = phase;
        this.direction = Math.random() * Math.PI * 2;
        this.speed = COLLECTIBLE_BASE_SPEED + (value / 40);
        this.bounceCount = 0;
    }

    update() {
        if (this.collected) return;
        
        if (Math.random() < (this.bounceCount > 0 ? 0.1 : 0.05)) {
            this.direction += (Math.random() - 0.5) * Math.PI/2;
        }
        
        this.x += Math.cos(this.direction) * this.speed;
        this.y += Math.sin(this.direction) * this.speed;
        
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
        
        if (bounced) this.bounceCount = 5;
        else if (this.bounceCount > 0) this.bounceCount--;
    }

    draw() {
        this.update();
        if (this.collected || this.phase > currentPhase) return;
        
        const colors = {
            'coin': '#FFD700',
            'gem': '#FF1493',
            'star': '#00BFFF',
            'diamond': '#00FF7F',
            'crown': '#9370DB',
            'fireboots': '#FF4500' 
        };
        
        ctx.fillStyle = colors[this.type] || '#FFFF00';
        
        switch(this.type) {
            case 'coin':
                ctx.beginPath();
                ctx.arc(this.x + this.width/2, this.y + this.height/2, this.width/2, 0, Math.PI * 2);
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
                this.drawStar();
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
            case 'fireboots':
                ctx.beginPath();
                ctx.roundRect(this.x, this.y + this.height/2, this.width, this.height/2, 5);
                ctx.arc(this.x + this.width/2, this.y + this.height/2, this.width/2.5, Math.PI, 0);
                ctx.fill();
                break;
            default:
                ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    drawStar() {
        const spikes = 5;
        const outerRadius = this.width/2;
        const innerRadius = this.width/4;
        const cx = this.x + this.width/2;
        const cy = this.y + this.height/2;
        
        let rot = Math.PI/2 * 3;
        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius);
        
        for(let i = 0; i < spikes; i++) {
            const x = cx + Math.cos(rot) * outerRadius;
            const y = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += Math.PI / spikes;
            
            ctx.lineTo(
                cx + Math.cos(rot) * innerRadius,
                cy + Math.sin(rot) * innerRadius
            );
            rot += Math.PI / spikes;
        }
        
        ctx.closePath();
        ctx.fill();
    }

    applyEffect() {
        switch(this.type) {
            case 'fireboots':
                player.speed *= 1.5;
                setTimeout(() => player.speed /= 1.5, 10000);
                break;
            case 'mirror':
                // Mirror dimension activation
                break;
        }
    }
}


function generateObstacles() {
    console.log("Generating obstacles..."); // Debug line
    const obstacleTypes = ['tree', 'rock', 'pond', 'fence', 'house', 'lava'];
    obstacles = [];
    
    for (let i = 0; i < 20; i++) {
        const type = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
        obstacles.push(new Obstacle(
            Math.random() * (CANVAS_WIDTH - 100),
            Math.random() * (CANVAS_HEIGHT - 100),
            40 + Math.random() * 60,
            40 + Math.random() * 60,
            type
        ));
    }
    console.log(`Generated ${obstacles.length} obstacles`); // Debug line
}

function generateCollectibles() {
    console.log("Generating collectibles..."); // Debug line
    const collectibleTypes = ['coin', 'gem', 'star', 'diamond', 'crown', 'fireboots'];
    collectibles = [];
    
    for (let i = 0; i < 15; i++) {
        const type = collectibleTypes[Math.floor(Math.random() * collectibleTypes.length)];
        collectibles.push(new Collectible(
            Math.random() * (CANVAS_WIDTH - 30),
            Math.random() * (CANVAS_HEIGHT - 30),
            20,
            20,
            type,
            SCORE_INCREMENT
        ));
    }
    console.log(`Generated ${collectibles.length} collectibles`); // Debug line
}

  
  function generateCollectibles() {
    const collectibleTypes = ['coin', 'gem', 'star', 'diamond', 'crown', 'fireboots'];
    collectibles = [];
    
    for (let i = 0; i < 15; i++) {
      const type = collectibleTypes[Math.floor(Math.random() * collectibleTypes.length)];
      collectibles.push(new Collectible(
        Math.random() * (CANVAS_WIDTH - 30),
        Math.random() * (CANVAS_HEIGHT - 30),
        20,
        20,
        type,
        SCORE_INCREMENT
      ));
    }
  }
  
  function updateScore() {
    document.getElementById('score-display').textContent = `Score: ${score}`;
  }
  
  function updateTimer() {
    const elapsed = Date.now() - phaseStartTime;
    timeLeft = LEVELS[currentPhase].timeLimit - elapsed;
    
    if (timeLeft <= 10000 && !timeWarningPlayed) {
      if (sounds.warning) sounds.warning.play();
      timeWarningPlayed = true;
    }
    
    document.getElementById('timer').textContent = `Time: ${Math.ceil(timeLeft/1000)}s`;
  }
  
  function advanceLevel() {
    currentPhase++;
    phaseCollected = 0;
    phaseStartTime = Date.now();
    timeWarningPlayed = false;
    
    if (currentPhase > Object.keys(LEVELS).length) {
      // Game win condition
      endGame(true);
      return;
    }
    
    if (sounds.phase) sounds.phase.play();
    generateCollectibles();
  }





// Star Drawing Utility Function
function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
    let rot = Math.PI/2 * 3;
    const step = Math.PI / spikes;
    
    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    
    for(let i = 0; i < spikes; i++) {
        rot += step;
        ctx.lineTo(
            cx + Math.cos(rot) * outerRadius,
            cy + Math.sin(rot) * outerRadius
        );
        rot += step;
        ctx.lineTo(
            cx + Math.cos(rot) * innerRadius,
            cy + Math.sin(rot) * innerRadius
        );
    }
    
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
    }

    draw() {
        // Draw player body
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(
            this.x + this.width/2,
            this.y + this.height/2,
            this.width/2,
            0,
            Math.PI * 2
        );
        ctx.fill();
        
        // Draw player eye
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(
            this.x + this.width/2 + (this.width/4),
            this.y + this.height/2 - (this.height/4),
            this.width/8,
            0,
            Math.PI * 2
        );
        ctx.fill();
    }

    update() {
        // Movement calculations
        let dx = 0, dy = 0;
        if (keys.ArrowUp || keys.w) dy -= this.speed;
        if (keys.ArrowDown || keys.s) dy += this.speed;
        if (keys.ArrowLeft || keys.a) dx -= this.speed;
        if (keys.ArrowRight || keys.d) dx += this.speed;

        // Normalize diagonal movement
        if (dx !== 0 && dy !== 0) {
            dx *= 0.7071;
            dy *= 0.7071;
        }

        // Update position
        this.x += dx;
        this.y += dy;

        // Boundary checking
        this.x = Math.max(0, Math.min(CANVAS_WIDTH - this.width, this.x));
        this.y = Math.max(0, Math.min(CANVAS_HEIGHT - this.height, this.y));

        // Check for collisions
        this.checkCollectibles();
    }

     
    flash() {
        this.color = this.hitColor;
        if (this.flashTimeout) clearTimeout(this.flashTimeout);
        this.flashTimeout = setTimeout(() => {
            this.color = this.defaultColor;
        }, FLASH_DURATION);
    }

    update() {
        // Handle movement input
        let dx = 0, dy = 0;
        if (keys.ArrowUp) dy -= this.speed;
        if (keys.ArrowDown) dy += this.speed;
        if (keys.ArrowLeft) dx -= this.speed;
        if (keys.ArrowRight) dx += this.speed;
        
        // Diagonal movement normalization
        if (dx !== 0 && dy !== 0) {
            dx *= 0.7071; // 1/sqrt(2)
            dy *= 0.7071;
        }
        
        // Calculate new position
        const newX = this.x + dx;
        const newY = this.y + dy;
        
        // Check boundaries and collisions
        const withinBounds = 
            newX >= 0 && 
            newX <= CANVAS_WIDTH - this.width &&
            newY >= 0 && 
            newY <= CANVAS_HEIGHT - this.height;
        
        let canMove = withinBounds;
        let hitObstacle = false;
        
        if (canMove) {
            const tempPlayer = new Player(newX, newY);
            for (const obstacle of obstacles) {
                if (tempPlayer.collidesWith(obstacle)) {
                    canMove = false;
                    hitObstacle = true;
                    break;
                }
            }
        }
        
        // Apply movement or collision response
        if (canMove) {
            this.x = newX;
            this.y = newY;
            this.checkCollectibles();
            
            // Mirror player logic for phase 4
            if (currentPhase === 4) {
                if (!mirrorPlayer) {
                    mirrorPlayer = new Player(0, 0);
                    mirrorPlayer.color = 'rgba(255, 0, 0, 0.5)';
                }
                mirrorPlayer.x = CANVAS_WIDTH - this.x;
                mirrorPlayer.y = CANVAS_HEIGHT - this.y;
                mirrorPlayer.draw();
            }
        } else if (hitObstacle) {
            this.handleObstacleCollision(dx, dy);
        }
    }
    
    handleObstacleCollision(dx, dy) {
        // Apply score penalty
        score = Math.max(0, score - OBSTACLE_PENALTY);
        updateScore();
        
        // Knockback effect
        this.x -= dx * KNOCKBACK_FORCE;
        this.y -= dy * KNOCKBACK_FORCE;
        
        // Visual feedback
        this.flash();
        if (sounds.obstacle) sounds.obstacle.play();
    }
    
    checkCollectibles() {
        for (let i = collectibles.length - 1; i >= 0; i--) {
            const collectible = collectibles[i];
            if (!collectible.collected && 
                collectible.phase <= currentPhase && 
                this.collidesWith(collectible)) {
                
                this.collectItem(collectible, i);
            }
        }
    }
    
    collectItem(collectible, index) {
        collectible.collected = true;
        score += collectible.value;
        
        // Phase progression
        if (collectible.phase === currentPhase) {
            phaseCollected++;
            if (phaseCollected >= LEVELS[currentPhase].collectiblesRequired) {
                advanceLevel();
            }
        }
        
        // Play sound and remove
        if (sounds.collect) sounds.collect.play();
        collectibles.splice(index, 1);
        updateScore();
    }
}

// Boss Class
class Boss {
    constructor() {
        this.size = 120;
        this.health = 10;
        this.position = { x: CANVAS_WIDTH/2, y: 100 };
        this.speed = 2;
    }

    update() {
        // Simple chase AI
        const dx = player.x - this.position.x;
        const dy = player.y - this.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
            this.position.x += (dx / distance) * this.speed;
            this.position.y += (dy / distance) * this.speed;
        }
    }

    draw() {
        // Draw boss body
        ctx.fillStyle = '#8B0000';
        ctx.beginPath();
        ctx.arc(
            this.position.x, 
            this.position.y, 
            this.size/2, 
            0, 
            Math.PI * 2
        );
        ctx.fill();
        
        // Draw health bar
        const healthWidth = this.size;
        const healthHeight = 10;
        ctx.fillStyle = 'red';
        ctx.fillRect(
            this.position.x - healthWidth/2,
            this.position.y - this.size/2 - 15,
            healthWidth,
            healthHeight
        );
        
        ctx.fillStyle = 'green';
        ctx.fillRect(
            this.position.x - healthWidth/2,
            this.position.y - this.size/2 - 15,
            healthWidth * (this.health/10),
            healthHeight
        );
    }
}
function initGame() {
    canvas = document.getElementById('game-canvas');
    ctx = canvas.getContext('2d');
  window.addEventListener('keydown', (e) => keys[e.key] = true);
window.addEventListener('keyup', (e) => keys[e.key] = false);
    // Set canvas size
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    
    // Initialize game objects
    player = new Player(CANVAS_WIDTH/2, CANVAS_HEIGHT/2);
    generateObstacles();
    generateCollectibles();
    phaseStartTime = Date.now();
    console.log("Initializing game..."); // Debug line
    
    canvas = document.getElementById('game-canvas');
    ctx = canvas.getContext('2d');
    
    // Debug: Test if canvas is working
    ctx.fillStyle = 'red';
    ctx.fillRect(50, 50, 100, 100);
    console.log("Canvas test drawn"); // Debug line
    
    // Set canvas size
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    
    // Initialize game objects
    player = new Player(CANVAS_WIDTH/2, CANVAS_HEIGHT/2);
    generateObstacles();
    generateCollectibles();
    
    console.log(`Objects generated - Player: ${player}, Obstacles: ${obstacles.length}, Collectibles: ${collectibles.length}`); // Debug line
    
    // Set up controls
    window.addEventListener('keydown', (e) => {
        keys[e.key] = true;
        console.log(`Key pressed: ${e.key}`); // Debug line
    });
    
    window.addEventListener('keyup', (e) => {
        keys[e.key] = false;
    });
    
    phaseStartTime = Date.now();
    gameLoop();
}
  
function gameLoop() {
    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Draw background
    ctx.fillStyle = '#87CEEB'; // Sky blue
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Draw all objects
    obstacles.forEach(obstacle => {
        obstacle.update();
        obstacle.draw();
    });
    
    collectibles.forEach(collectible => {
        collectible.draw();
    });
    
    player.update();
    player.draw();
    
    // Update UI
    updateTimer();
    
    // Continue loop
    requestAnimationFrame(gameLoop);
}