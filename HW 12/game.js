// Game Constants
const CANVAS_WIDTH = 1600;
const CANVAS_HEIGHT = 1200;
const PLAYER_SIZE = 60;
const SCORE_INCREMENT = 10;

// Game Variables
let canvas, ctx;
let obstacles = [];
let collectibles = [];
let player;
let keys = {};
let score = 0;

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
        debugElement.innerHTML = `
            Player: (${Math.floor(player.x)}, ${Math.floor(player.y)})<br>
            Collision: ${obstacles.some(o => player.collidesWith(o)) ? 'Yes' : 'No'}<br>
            Collectibles left: ${collectibles.filter(c => !c.collected).length}
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

window.onload = initGame;