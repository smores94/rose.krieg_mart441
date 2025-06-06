// Game Constants
const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 800;
const PLAYER_SIZE = 40;
const SCORE_INCREMENT = 10;
const PHASE1_COUNT = 5;
const PHASE_TIME_LIMIT = 60000;
const OBSTACLE_PENALTY = 5;
const COLLECTIBLE_BASE_SPEED = .4;
const KNOCKBACK_FORCE = 0.5;
const FLASH_DURATION = 200;
const PHASE2_COUNT = 15; // Number of phase 2 collectibles needed to win

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
        this.update(); // Update position before drawing
        if (this.collected || this.phase > currentPhase) return;
        
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
    }

    draw() {
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
        const tempPlayer = new Player(newX, newY);
        
        const withinBounds = 
            newX >= 0 && 
            newX <= CANVAS_WIDTH - this.width &&
            newY >= 0 && 
            newY <= CANVAS_HEIGHT - this.height;
        
        let canMove = withinBounds;
        let hitObstacle = false;
        
        if (canMove) {
            for (const obstacle of obstacles) {
                if (tempPlayer.collidesWith(obstacle)) {
                    canMove = false;
                    hitObstacle = true;
                    break;
                }
            }
        }
        
        if (canMove) {
            this.x = newX;
            this.y = newY;
            this.checkCollectibles();
        } else if (hitObstacle) {
            // Apply penalty and effects
            score = Math.max(0, score - OBSTACLE_PENALTY);
            updateScore();
            
            // Knockback effect
            this.x -= dx * KNOCKBACK_FORCE;
            this.y -= dy * KNOCKBACK_FORCE;
            
            // Visual feedback
            this.flash();
            if (sounds.obstacle) sounds.obstacle.play();
        }
    }
    
    checkCollectibles() {
        for (let i = collectibles.length - 1; i >= 0; i--) {
            const collectible = collectibles[i];
            if (!collectible.collected && 
                collectible.phase <= currentPhase && 
                this.collidesWith(collectible)) {
                
                collectible.collected = true;
                score += collectible.value;
                
                if (collectible.phase === 1) {
                    phase1Collected++;
                    if (phase1Collected >= PHASE1_COUNT) {
                        currentPhase = 2;
                        console.log("Phase 2 unlocked!");
                        if (sounds.phase) sounds.phase.play();
                    }
                } else if (collectible.phase === 2) {
                    phase2Collected++; // Track phase 2 collectibles
                    if (phase2Collected >= PHASE2_COUNT) {
                        console.log("You win!"); // Add your win condition here
                        // You might want to add a win screen or celebration
                    }
                }
                
                updateScore();
                if (sounds.collect) sounds.collect.play();
                collectibles.splice(i, 1);
            }
        }
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
            // Phase 1 items
            new Collectible(150, 350, 20, 20, 'coin', 10, 1),
            new Collectible(400, 250, 25, 25, 'gem', 50, 1),
            new Collectible(650, 400, 30, 30, 'star', 100, 1),
            new Collectible(800, 150, 20, 20, 'coin', 10, 1),
            new Collectible(1000, 300, 25, 25, 'gem', 50, 1),
            new Collectible(150, 350, 20, 20, 'coin', 10, 1),
            new Collectible(400, 250, 25, 25, 'gem', 50, 1),
            new Collectible(650, 400, 30, 30, 'star', 100, 1),
            new Collectible(800, 150, 20, 20, 'coin', 10, 1),
            new Collectible(1000, 300, 25, 25, 'gem', 50, 1),
            
            // Phase 2 items (now at least 15)
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
            new Collectible(800, 200, 40, 40, 'crown', 500, 2)
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
        timeLeft = PHASE_TIME_LIMIT - (Date.now() - phaseStartTime);
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
            ${currentPhase === 2 ? `Phase 2: ${phase2Collected}/${PHASE2_COUNT}<br>` : ''}
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
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    obstacles.forEach(o => o.draw());
    collectibles.forEach(c => c.draw());
    player.update();
    player.draw();
    
    updateDebugInfo();
    requestAnimationFrame(gameLoop);
}

async function initGame() {
    canvas = document.getElementById('game-canvas');
    if (!canvas) {
        console.error('Canvas element not found!');
        return;
    }
    ctx = canvas.getContext('2d');
    
    // Initialize sounds properly
    sounds.collect = document.getElementById('collect-sound');
    sounds.phase = document.getElementById('phase-sound');
    sounds.warning = document.getElementById('warning-sound');
    sounds.obstacle = document.getElementById('obstacle-sound');
    
    // Try to preload sounds 
    try {
        await Promise.all([
            sounds.collect.load(),
            sounds.phase.load(),
            sounds.warning.load(),
            sounds.obstacle.load()
        ]);
    } catch (error) {
        console.warn("Sound preload error:", error);
    }
    function playSound(sound) {
        if (!sound) return;
        
        try {
            sound.currentTime = 0; // Rewind to start
            sound.play().catch(e => {
                console.warn("Sound play failed:", e);
                // Fallback - create new audio element
                const newAudio = new Audio(sound.src);
                newAudio.play().catch(e => console.warn("Fallback sound failed:", e));
            });
        } catch (e) {
            console.warn("Sound error:", e);
        }
    }
    // Replace all sound.play() calls with:
playSound(sounds.collect); // For collection
playSound(sounds.phase);   // For phase change
playSound(sounds.warning); // For time warning
playSound(sounds.obstacle); // For collisions
    
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
    timeLeft = PHASE_TIME_LIMIT;
    
    setupControls();
    gameLoop();
}

window.onload = initGame;