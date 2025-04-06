// Game Constants
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const PLAYER_SIZE = 40;

// Game Variables
let canvas, ctx;
let obstacles = [];
let player;
let keys = {};

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
        // Base draw method (override in child classes)
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
        // Different colors for different obstacle types
        const colors = {
            'tree': '#2E8B57',
            'rock': '#696969',
            'pond': '#1E90FF',
            'fence': '#8B4513',
            'house': '#CD5C5C'
        };
        
        ctx.fillStyle = colors[this.type] || '#A9A9A9';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Add some simple details
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
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
        
        // Simple eyes to show direction
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

    update(obstacles) {
        let dx = 0, dy = 0;
        
        // Movement based on key presses
        if (keys.ArrowUp) dy -= this.speed;
        if (keys.ArrowDown) dy += this.speed;
        if (keys.ArrowLeft) dx -= this.speed;
        if (keys.ArrowRight) dx += this.speed;
        
        // Normalize diagonal movement
        if (dx !== 0 && dy !== 0) {
            dx *= 0.7071;
            dy *= 0.7071;
        }
        
        // Check potential new position
        const newX = this.x + dx;
        const newY = this.y + dy;
        
        // Create temporary player to check collisions
        const tempPlayer = new Player(newX, newY);
        
        // Check boundaries
        const withinBounds = 
            newX >= 0 && 
            newX <= CANVAS_WIDTH - this.width &&
            newY >= 0 && 
            newY <= CANVAS_HEIGHT - this.height;
        
        // Check collisions with obstacles
        let canMove = withinBounds;
        if (canMove) {
            for (const obstacle of obstacles) {
                if (tempPlayer.collidesWith(obstacle)) {
                    canMove = false;
                    break;
                }
            }
        }
        
        // Update position if no collision
        if (canMove) {
            this.x = newX;
            this.y = newY;
        }
    }
}

// Initialize Game
async function initGame() {
    // Set up canvas
    canvas = document.getElementById('game-canvas');
    ctx = canvas.getContext('2d');
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    
    // Load obstacles
    await loadObstacles();
    
    // Create player
    player = new Player(50, 50);
    
    // Set up keyboard controls
    setupControls();
    
    // Start game loop
    gameLoop();
}

// Load obstacles from JSON
async function loadObstacles() {
    try {
        const response = await fetch('obstacles.json');
        const data = await response.json();
        
        obstacles = data.map(item => new Obstacle(
            item.x,
            item.y,
            item.width,
            item.height,
            item.type
        ));
        
        console.log('Loaded obstacles:', obstacles);
    } catch (error) {
        console.error('Error loading obstacles:', error);
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

// Set up keyboard controls
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

// Main game loop
function gameLoop() {
    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Update player
    player.update(obstacles);
    
    // Draw all objects
    obstacles.forEach(obstacle => obstacle.draw());
    player.draw();
    
    // Show debug info
    updateDebugInfo();
    
    // Continue loop
    requestAnimationFrame(gameLoop);
}

// Update debug information
function updateDebugInfo() {
    const debugElement = document.getElementById('debug-info');
    debugElement.innerHTML = `
        Player: (${Math.floor(player.x)}, ${Math.floor(player.y)})<br>
        Collision: ${checkCollisions() ? 'Yes' : 'No'}
    `;
}

// Check if player is colliding with any obstacles
function checkCollisions() {
    return obstacles.some(obstacle => player.collidesWith(obstacle));
}

// Start the game
window.onload = initGame;