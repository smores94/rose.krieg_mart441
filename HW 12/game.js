// Game Constants
const CANVAS_WIDTH = 1600;
const CANVAS_HEIGHT = 1200;
const PLAYER_SIZE = 60;
const SCORE_INCREMENT = 10;
function resizeCanvas() {
    // Get the container dimensions
    const container = document.getElementById('game-container');
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    // Calculate the scale to fit while maintaining aspect ratio
    const scaleX = containerWidth / CANVAS_WIDTH;
    const scaleY = containerHeight / CANVAS_HEIGHT;
    scale = Math.min(scaleX, scaleY);
    
    // Apply the scale
    canvas.style.width = `${CANVAS_WIDTH * scale}px`;
    canvas.style.height = `${CANVAS_HEIGHT * scale}px`;
    
    // Center the canvas
    canvas.style.position = 'absolute';
    canvas.style.left = `${(containerWidth - CANVAS_WIDTH * scale) / 2}px`;
    canvas.style.top = `${(containerHeight - CANVAS_HEIGHT * scale) / 2}px`;
    
    // Update the offset values for input calculations
    canvasOffsetX = parseFloat(canvas.style.left);
    canvasOffsetY = parseFloat(canvas.style.top);
    
    // For high DPI displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = CANVAS_WIDTH * dpr;
    canvas.height = CANVAS_HEIGHT * dpr;
    ctx.scale(dpr, dpr);
}
// Game Variables
let canvas, ctx;
let obstacles = [];
let collectibles = [];
let player;
let keys = {};
let score = 0;
let currentPhase = 1;
let phase1Collected = 0;
const PHASE1_COUNT = 5;
const PHASE_TIME_LIMIT = 60000;
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
    warning: null
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
        this.color = this.getRandomVariantColor(type); // Set random color on creation
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
        
        // Add outline with shadow effect
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.lineWidth = 2;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
        ctx.shadowBlur = 5;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        ctx.shadowBlur = 0; // Reset shadow
        
        // Add special details based on type
        this.addObstacleDetails();
    }

    addObstacleDetails() {
        switch(this.type) {
            case 'tree':
                // Draw tree trunk
                ctx.fillStyle = '#5D4037';
                ctx.fillRect(
                    this.x + this.width/2 - 5, 
                    this.y + this.height - 20, 
                    10, 
                    20
                );
                break;
                
            case 'house':
                // Draw roof
                ctx.fillStyle = '#8B0000';
                ctx.beginPath();
                ctx.moveTo(this.x, this.y + 30);
                ctx.lineTo(this.x + this.width/2, this.y);
                ctx.lineTo(this.x + this.width, this.y + 30);
                ctx.closePath();
                ctx.fill();
                
                // Draw door
                ctx.fillStyle = '#5D4037';
                ctx.fillRect(
                    this.x + this.width/2 - 15,
                    this.y + this.height - 40,
                    30,
                    40
                );
                break;
                
            case 'fence':
                // Draw fence posts
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
    }

    draw() {
        if (this.collected) return;
        
        // Only draw collectibles for current phase or earlier
        if (this.phase > currentPhase) return;
        
        const colors = {
            'coin': '#FFD700',
            'gem': '#FF1493',
            'star': '#00BFFF',
            'diamond': '#00FF7F',
            'crown': '#9370DB'
        };
        
        ctx.fillStyle = colors[this.type] || '#FFFF00';
        
        // Draw different shapes based on type
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
                // Base
                ctx.moveTo(this.x + 10, this.y + this.height - 10);
                ctx.lineTo(this.x + this.width - 10, this.y + this.height - 10);
                // Left side
                ctx.lineTo(this.x + this.width/2, this.y + 10);
                // Right side
                ctx.lineTo(this.x + 10, this.y + this.height - 10);
                ctx.fill();
                break;
                
            default:
                ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}

// Helper function to draw a star
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
        if (canMove) {
            for (const obstacle of obstacles) {
                if (tempPlayer.collidesWith(obstacle)) {
                    canMove = false;
                    break;
                }
            }
        }
        
        if (canMove) {
            this.x = newX;
            this.y = newY;
            this.checkCollectibles();
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
                
                // Phase transition check
                if (collectible.phase === 1) {
                    phase1Collected++;
                    if (phase1Collected >= PHASE1_COUNT) {
                        currentPhase = 2;
                        console.log("Phase 2 unlocked!");
                        if (sounds.phase) sounds.phase.play();
                    }
                }
                
                updateScore();
                if (sounds.collect) sounds.collect.play();
                collectibles.splice(i, 1);
            }
        }
    
                
                // Phase transition check
                if (collectible.phase === 1) {
                    phase1Collected++;
                    if (phase1Collected >= PHASE1_COUNT) {
                        currentPhase = 2;
                        console.log("Phase 2 unlocked!");
                    }
                }
                
                updateScore();
                collectibles.splice(i, 1);
            }
        }
    


// Game Functions
async function loadObstacles() {
    try {
        const response = await fetch('obstacles.json');
        const data = await response.json();
        obstacles = data.map(item => new Obstacle(
            item.x, item.y, item.width, item.height, item.type
        ));
    } catch (error) {
        console.error('Error loading obstacles:', error);
        obstacles = [
            new Obstacle(300, 150, 60, 90, 'tree'),
            new Obstacle(500, 300, 50, 40, 'rock'),
            new Obstacle(200, 400, 150, 100, 'pond'),
            new Obstacle(100, 200, 250, 30, 'fence'),
            new Obstacle(600, 100, 120, 140, 'house')
        ];
    }

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
            new Collectible(150, 350, 20, 20, 'coin', 10, 1),
            new Collectible(400, 250, 25, 25, 'gem', 50, 1),
            new Collectible(650, 400, 30, 30, 'star', 100, 1),
            new Collectible(800, 150, 20, 20, 'coin', 10, 1),
            new Collectible(1000, 300, 25, 25, 'gem', 50, 1),
            new Collectible(200, 600, 35, 35, 'diamond', 200, 2),
            new Collectible(500, 700, 40, 40, 'crown', 500, 2),
            new Collectible(1200, 500, 35, 35, 'diamond', 200, 2),
            new Collectible(900, 800, 40, 40, 'crown', 500, 2),
            new Collectible(1300, 200, 30, 30, 'star', 100, 2)
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
        const minutes = Math.floor(timeLeft / 60000);
        const seconds = Math.floor((timeLeft % 60000) / 1000);
        
        debugElement.innerHTML = `
            Phase: ${currentPhase}<br>
            Phase 1: ${phase1Collected}/${PHASE1_COUNT}<br>
            Time: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}<br>
            Score: ${score}
        `;
    }
}

function resizeCanvas() {
    const windowRatio = window.innerWidth / window.innerHeight;
    const gameRatio = CANVAS_WIDTH / CANVAS_HEIGHT;
    
    if (windowRatio > gameRatio) {
        scale = window.innerHeight / CANVAS_HEIGHT;
    } else {
        scale = window.innerWidth / CANVAS_WIDTH;
    }
    
    canvas.style.width = `${CANVAS_WIDTH * scale}px`;
    canvas.style.height = `${CANVAS_HEIGHT * scale}px`;
    
    canvasOffsetX = (window.innerWidth - CANVAS_WIDTH * scale) / 2;
    canvasOffsetY = (window.innerHeight - CANVAS_HEIGHT * scale) / 2;
    canvas.style.position = 'absolute';
    canvas.style.left = `${canvasOffsetX}px`;
    canvas.style.top = `${canvasOffsetY}px`;
}

function gameLoop() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    player.update();
    obstacles.forEach(o => o.draw());
    collectibles.forEach(c => c.draw());
    player.draw();
    updateDebugInfo();
    requestAnimationFrame(gameLoop);
}

// Initialize Game
async function initGame() {
    async function initGame() {
        // Set up canvas
        canvas = document.getElementById('game-canvas');
        ctx = canvas.getContext('2d');
        
        // Initial resize
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        // Create UI elements if they don't exist
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
        
        // Load game assets
        await Promise.all([loadObstacles(), loadCollectibles()]);
        
        // Initialize player
        player = new Player(50, 50);
        
        // Set up controls
        setupControls();
        
        // Start game loop
        gameLoop();
    }
    
    // Create UI elements if they don't exist
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
    
    // Initialize sounds
    sounds.collect = document.getElementById('collect-sound');
    sounds.phase = document.getElementById('phase-sound');
    sounds.warning = document.getElementById('time-warning');
    
    // Start phase timer
    phaseStartTime = Date.now();
    timeLeft = PHASE_TIME_LIMIT;
    
    // Load game data
    await loadObstacles();
    await loadCollectibles();
    
    // Create player
    player = new Player(50, 50);
    
    // Set up keyboard controls
    setupControls();
    
    // Start game loop
    gameLoop();
}

window.onload = initGame;