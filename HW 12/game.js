// Game Constants
const CANVAS_WIDTH = 1600;
const CANVAS_HEIGHT = 1200;
const PLAYER_SIZE = 60;
const SCORE_INCREMENT = 10;

// Game Variables
let canvas, ctx;
let scale = 1;
let canvasOffsetX = 0;
let canvasOffsetY = 0;

async function initGame() {
    // Set up canvas
    canvas = document.getElementById('game-canvas');
    ctx = canvas.getContext('2d');
    
    // Set internal game size
    canvas.width = GAME_WIDTH;
    canvas.height = GAME_HEIGHT;
    
    // Scale canvas to fit window
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // ... rest of your initialization code ...
}

function resizeCanvas() {
    const windowRatio = window.innerWidth / window.innerHeight;
    const gameRatio = GAME_WIDTH / GAME_HEIGHT;
    
    if (windowRatio > gameRatio) {
        // Window is wider than game - fit to height
        scale = window.innerHeight / GAME_HEIGHT;
    } else {
        // Window is taller than game - fit to width
        scale = window.innerWidth / GAME_WIDTH;
    }
    
    // Apply scaling
    canvas.style.width = `${GAME_WIDTH * scale}px`;
    canvas.style.height = `${GAME_HEIGHT * scale}px`;
    
    // Center canvas
    canvasOffsetX = (window.innerWidth - GAME_WIDTH * scale) / 2;
    canvasOffsetY = (window.innerHeight - GAME_HEIGHT * scale) / 2;
    canvas.style.position = 'absolute';
    canvas.style.left = `${canvasOffsetX}px`;
    canvas.style.top = `${canvasOffsetY}px`;
}

// Add to Game Variables
let currentPhase = 1;
let phase1Collected = 0;
const PHASE1_COUNT = 5;
const PHASE_TIME_LIMIT = 60000; // 60 seconds per phase in milliseconds
let phaseStartTime;
let timeLeft;
let timeWarningPlayed = false;

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
    }

    draw() {
        const colors = {
            'tree': '#2E8B57',
            'rock': '#696969',
            'pond': '#1E90FF',
            'fence': '#8B4513',
            'house': '#CD5C5C'
        };
        
        ctx.fillStyle = colors[this.type] || '#A9A9A9';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
}

class Collectible extends GameObject {
    constructor(x, y, width, height, type, value) {
        super(x, y, width, height, type);
        this.value = value;
        this.collected = false;
    }

    draw() {
        if (this.collected) return;
        
        const colors = {
            'coin': '#FFD700',
            'gem': '#FF1493',
            'star': '#00BFFF'
        };
        
        ctx.fillStyle = colors[this.type] || '#FFFF00';
        ctx.beginPath();
        ctx.arc(
            this.x + this.width/2,
            this.y + this.height/2,
            this.width/2,
            0,
            Math.PI * 2
        );
        ctx.fill();
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.beginPath();
        ctx.arc(
            this.x + this.width/2 + this.width/4,
            this.y + this.height/2 - this.height/4,
            this.width/4,
            0,
            Math.PI * 2
        );
        ctx.fill();
    }
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
            if (!collectible.collected && this.collidesWith(collectible)) {
                collectible.collected = true;
                score += collectible.value;
                updateScore();
                collectibles.splice(i, 1);
                console.log(`Collected ${collectible.type}! New score: ${score}`);
            }
        }
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
            item.x, item.y, item.width, item.height, item.type, item.value
        ));
    } catch (error) {
        console.error('Error loading collectibles:', error);
        collectibles = [
            new Collectible(150, 350, 20, 20, 'coin', 10),
            new Collectible(400, 250, 25, 25, 'gem', 50),
            new Collectible(650, 400, 30, 30, 'star', 100)
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
    canvas = document.getElementById('game-canvas');
    ctx = canvas.getContext('2d');
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    async function initGame() {
        await loadObstacles();
        await loadCollectibles();
        
        // Initialize sounds
        sounds.collect = document.getElementById('collect-sound');
        sounds.phase = document.getElementById('phase-sound');
        sounds.warning = document.getElementById('time-warning');
        
        // Start phase timer
        phaseStartTime = Date.now();
        timeLeft = PHASE_TIME_LIMIT;
        
     
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
    
    await loadObstacles();
    await loadCollectibles();
    player = new Player(50, 50);
    setupControls();
    gameLoop();
}
class Collectible extends GameObject {
    constructor(x, y, width, height, type, value = 10, phase = 1) {
        // Validate parameters
        if (isNaN(x) || isNaN(y) || isNaN(width) || isNaN(height)) {
            console.error("Invalid collectible coordinates/size:", {x, y, width, height});
            throw new Error("Collectible parameters must be numbers");
        }

        super(x, y, width, height, type);
        this.value = value;
        this.collected = false;
        this.phase = phase;
        this.pulse = 0;
        this.pulseDirection = 1;
        
        // Validate type
        this.validTypes = ['coin', 'gem', 'star', 'diamond', 'crown'];
        if (!this.validTypes.includes(type)) {
            console.warn(`Unknown collectible type: ${type}. Defaulting to 'coin'`);
            this.type = 'coin';
        }
    }

    draw() {
        try {
            if (this.collected || this.phase > currentPhase) return;
            
            const colors = {
                'coin': '#FFD700',
                'gem': '#FF1493',
                'star': '#00BFFF',
                'diamond': '#00FF7F',
                'crown': '#9370DB'
            };
            
            ctx.save();
            
            // Pulsing effect for phase 2
            if (this.phase === 2) {
                this.pulse += 0.05 * this.pulseDirection;
                if (this.pulse > 0.5 || this.pulse < 0) this.pulseDirection *= -1;
                ctx.shadowColor = colors[this.type] || '#FFFF00';
                ctx.shadowBlur = 15 + 15 * this.pulse;
            }
            
            // Main shape
            ctx.fillStyle = colors[this.type] || '#FFFF00';
            ctx.beginPath();
            
            switch(this.type) {
                case 'coin':
                    ctx.arc(this.x + this.width/2, this.y + this.height/2, this.width/2, 0, Math.PI * 2);
                    break;
                case 'gem':
                    this.drawGemShape();
                    break;
                case 'star':
                    this.drawStarShape();
                    break;
                default:
                    ctx.arc(this.x + this.width/2, this.y + this.height/2, this.width/2, 0, Math.PI * 2);
            }
            
            ctx.fill();
            
            // Shine effect
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.beginPath();
            ctx.arc(
                this.x + this.width/2 + this.width/6,
                this.y + this.height/2 - this.height/6,
                this.width/5,
                0,
                Math.PI * 2
            );
            ctx.fill();
            
            ctx.restore();
        } catch (error) {
            console.error("Error drawing collectible:", error);
            // Fallback drawing
            ctx.fillStyle = 'red';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    drawGemShape() {
        const centerX = this.x + this.width/2;
        const centerY = this.y + this.height/2;
        ctx.moveTo(centerX, centerY - this.height/2);
        ctx.lineTo(centerX + this.width/2, centerY);
        ctx.lineTo(centerX, centerY + this.height/2);
        ctx.lineTo(centerX - this.width/2, centerY);
        ctx.closePath();
    }

    drawStarShape() {
        const spikes = 5;
        const outerRadius = this.width/2;
        const innerRadius = outerRadius * 0.4;
        const centerX = this.x + this.width/2;
        const centerY = this.y + this.height/2;
        
        ctx.moveTo(centerX, centerY - outerRadius);
        
        for (let i = 0; i < spikes; i++) {
            const angle = Math.PI * 2 / spikes * i - Math.PI/2;
            const nextAngle = Math.PI * 2 / spikes * (i + 0.5) - Math.PI/2;
            
            ctx.lineTo(
                centerX + Math.cos(angle) * innerRadius,
                centerY + Math.sin(angle) * innerRadius
            );
            ctx.lineTo(
                centerX + Math.cos(nextAngle) * outerRadius,
                centerY + Math.sin(nextAngle) * outerRadius
            );
        }
        
        ctx.closePath();
    }
}

async function loadCollectibles() {
    try {
        const response = await fetch('collectibles.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        
        // Validate loaded data
        if (!Array.isArray(data)) {
            throw new Error("Loaded collectibles data is not an array");
        }

        collectibles = data.map(item => {
            try {
                // Ensure required properties exist
                if (!item.type || isNaN(item.x) || isNaN(item.y)) {
                    throw new Error("Missing required collectible properties");
                }
                
                return new Collectible(
                    Number(item.x),
                    Number(item.y),
                    Number(item.width || 20),  // Default width
                    Number(item.height || item.width || 20), // Default height
                    item.type,
                    Number(item.value || 10),  // Default value
                    Number(item.phase || 1)    // Default phase
                );
            } catch (error) {
                console.error("Error creating collectible:", error, item);
                return null;
            }
        }).filter(collectible => collectible !== null); // Remove any null entries

        console.log("Successfully loaded collectibles:", collectibles);
    } catch (error) {
        console.error("Error loading collectibles:", error);
        
        // Create default collectibles if loading fails
        collectibles = [
            new Collectible(150, 350, 20, 20, 'coin', 10, 1),
            new Collectible(400, 250, 25, 25, 'gem', 50, 1),
            new Collectible(650, 400, 30, 30, 'star', 100, 1)
        ];
        
        console.log("Using default collectibles due to loading error");
    }
}
class Obstacle extends GameObject {
    constructor(x, y, width, height, type, color) {
        super(x, y, width, height, type);
        this.color = color || this.getDefaultColor(type);
    }

    getDefaultColor(type) {
        const colors = {
            'tree': '#2E8B57',
            'rock': '#696969',
            'pond': '#1E90FF',
            'fence': '#8B4513',
            'house': '#CD5C5C'
        };
        return colors[type] || '#A9A9A9'; // Default gray
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Add outline for better visibility
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        
        // Add simple details based on type
        this.addDetails();
    }

    addDetails() {
        switch(this.type) {
            case 'tree':
                // Draw tree trunk
                ctx.fillStyle = '#8B4513';
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
                break;
        }
    }
}
async function loadObstacles() {
    try {
        const response = await fetch('obstacles.json');
        const data = await response.json();
        
        obstacles = data.map(item => new Obstacle(
            item.x,
            item.y,
            item.width,
            item.height,
            item.type,
            item.color // Optional - will use default if missing
        ));
        
    } catch (error) {
        console.error("Error loading obstacles:", error);
        // Create default obstacles if loading fails
        obstacles = [
            new Obstacle(300, 150, 60, 90, 'tree'),
            new Obstacle(500, 300, 50, 40, 'rock'),
            new Obstacle(200, 400, 150, 100, 'pond'),
            new Obstacle(100, 200, 250, 30, 'fence'),
            new Obstacle(600, 100, 120, 140, 'house')
        ];
    }
}
class Player extends GameObject {
    draw() {
        // Use normal coordinates - no need to adjust for scale
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
    }
}
window.onload = initGame;