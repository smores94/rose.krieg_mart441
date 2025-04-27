function startGame() {
    document.getElementById('start-screen').style.display = 'none';
    enableAudio();
    initGame();  // <--- Starts the game AFTER you click Start!
}



// Game Constants
const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 800;
const PLAYER_SIZE = 40;
const SCORE_INCREMENT = 10;
const PHASE1_COUNT = 5;
const PHASE2_COUNT = 15;
const PHASE3_COUNT = 25;
const PHASE3_TIME_BONUS = 30000;
const PHASE_TIME_LIMIT = 60000;
const OBSTACLE_PENALTY = 5;
const COLLECTIBLE_BASE_SPEED = 0.4;
const KNOCKBACK_FORCE = 0.5;
const FLASH_DURATION = 200;
const PHASE1_SCORE_REQUIRED = 300;
const PHASE2_SCORE_REQUIRED = 1500;
const PHASE3_SCORE_REQUIRED = 3000;
const PHASE4_SCORE_REQUIRED = 5000;
const PHASE5_SCORE_REQUIRED = 10000;
const sounds = {
    collect: null,
    phase: null,
    warning: null,
    obstacle: null,
    bumpWarning: null
};



// Game Variables
let canvas, ctx;
let audioEnabled = false;
let particles = [];
let collisionCount = 0;
let obstacles = [];
let collectibles = [];
let currentLevel = 1; // Start with level 1, change this when progressing
let player;
let keys = {};
let score = 0;
let currentPhase = 1;
let phase1Collected = 0;
let phase2Collected = 0;
let scale = 1;
let canvasOffsetX = 0;
let canvasOffsetY = 0;
let phase3Collected = 0;
let phase3Unlocked = false;
let phaseStartTime;
let timeLeft;

let specialItemsCollected = {
    diamonds: 0,
    crowns: 0,
    stars: 0
};

function startGame() {
    document.getElementById('start-screen').style.display = 'none';
    enableAudio();
    initGame();
}



function drawHUD() {
    // Level indicator
    // Time remaining
    // Special item counters
    // Objective markers
}

// Path configuration
const repoName = 'rose.krieg_mart441';
const basePath = window.location.host.includes('github.io')
    ? `/${repoName}/BumpAround/`
    : './';


    
    function tryCreateAudio(url) {
        try {
            return new Audio(url);
        } catch (error) {
            console.warn('Error creating audio for:', url);
            return null;
        }
    }

    function enableAudio() {
        if (!audioEnabled) {
            audioEnabled = true;
    
            // Unlock the AudioContext for mobile browsers
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const buffer = ctx.createBuffer(1, 1, 22050);
            const source = ctx.createBufferSource();
            source.buffer = buffer;
            source.connect(ctx.destination);
            source.start(0);
    
            // Now load your game sounds
            sounds.collect = new Audio('./audio/collect.wav');
            sounds.phase = new Audio('./audio/treasure.wav');
            sounds.warning = new Audio('./audio/warning.wav');
            sounds.obstacle = new Audio('./audio/tap.wav');
            sounds.bumpWarning = new Audio('./audio/bump.wav');
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


function advanceLevel() {
    if (currentLevel < 5) {
        currentLevel++;
        resetLevel();
    } else {
        showVictoryScreen();
    }
}

function resetLevel() {
    obstacles = [];
    collectibles = [];
    loadObstacles();
    loadCollectibles();
    player.x = 50;
    player.y = 50;
}

function setLevelTheme() {
    const themes = [
        '#F0E68C', // Town (khaki)
        '#87CEEB', // Water World (sky blue)
        '#228B22', // Forest (forest green)
        '#C0C0C0', // Mirror World (silver)
        '#4B0082'  // Mystical (indigo)
    ];
    document.body.style.backgroundColor = themes[currentLevel-1];
}

const GRID_SIZE = 200; // Adjust based on needs

function createSpatialGrid() {
    const grid = [];
    // Initialize grid based on canvas size
    // Sort obstacles into grid cells
    // Use grid for collision checks
}



class Obstacle extends GameObject {
    constructor(x, y, width, height, type, color) {
        super(x, y, width, height, type);
        this.color = color || this.getDefaultColor();
    }

 
    getDefaultColor() {
        // Default colors for types not specified in JSON
        const typeColors = {
            tree: '#2E8B57',
            rock: '#696969',
            pond: '#1E90FF',
            fence: '#8B4513',
            house: '#CD5C5C',
            bush: '#3d8b37',
            mirror: '#c0c0c0',
            portal: '#9400d3'
        };
        return typeColors[this.type] || '#CCCCCC';
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
        this.speed = COLLECTIBLE_BASE_SPEED + (value / 40);
        this.bounceCount = 0;
        this.specialType = ['diamond', 'crown', 'star'].includes(type) ? type : null;
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
        
        if (bounced) {
            this.bounceCount = 5;
        } else if (this.bounceCount > 0) {
            this.bounceCount--;
        }
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
            'artifact': '#8A2BE2',
            'key': '#FFD700'
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
            case 'diamond':
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
                
            case 'crown':
                ctx.beginPath();
                ctx.moveTo(this.x + 10, this.y + this.height - 10);
                ctx.lineTo(this.x + this.width - 10, this.y + this.height - 10);
                ctx.lineTo(this.x + this.width/2, this.y + 10);
                ctx.lineTo(this.x + 10, this.y + this.height - 10);
                ctx.fill();
                break;

            case 'artifact':
                ctx.beginPath();
                ctx.arc(this.x + this.width/2, this.y + this.height/2, this.width/2, 0, Math.PI * 2);
                ctx.fill();
                break;
                
            case 'key':
                ctx.fillRect(this.x + this.width/3, this.y, this.width/3, this.height);
                ctx.beginPath();
                ctx.arc(this.x + this.width/2, this.y + this.height/3, this.width/4, 0, Math.PI * 2);
                ctx.fill();
                break;
                
            default:
                ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}


function createCollectEffect(x, y, color) {
    for (let i = 0; i < 20; i++) {
        particles.push(new Particle(
            x + Math.random() * 20 - 10,
            y + Math.random() * 20 - 10,
            color
        ));
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



class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.radius = Math.random() * 4 + 2;
        this.life = 1;
        this.velocity = {
            x: (Math.random() - 0.5) * 6,
            y: (Math.random() - 0.5) * 6
        };
        this.alpha = 1;
    }

    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= 0.02;
        this.life -= 0.03;
        this.radius *= 0.97;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
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
        this.phase2Collectibles = [];
        this.phase3Collectibles = [];
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
    }

get center() {
    return {
        x: this.x + this.width/2,
        y: this.y + this.height/2
    };
}

checkCollision(obstacle) {
    // Implement circle-rectangle collision
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
            collisionCount++;
            score = Math.max(0, score - OBSTACLE_PENALTY);
            
            if (collisionCount === 2 && sounds.bumpWarning) {
                sounds.bumpWarning.play();
            }
            
            this.x -= dx * KNOCKBACK_FORCE;
            this.y -= dy * KNOCKBACK_FORCE;
            
            this.flash();
            updateScore();
            if (sounds.obstacle) sounds.obstacle.play();
        }
    }

    checkCollectibles() {
        for (let i = collectibles.length - 1; i >= 0; i--) {
            const c = collectibles[i];
            
            if (c.collected || c.phase > currentPhase) continue;
    
            if (this.collidesWith(c)) {
                createCollectEffect(
                    c.x + c.width/2, 
                    c.y + c.height/2, 
                    c.color || '#FFFF00'
                );
                
                if (c.specialType) {
                    specialItemsCollected[c.specialType + 's']++;
                }
                
                c.collected = true;
                score += c.value;
                
                // Phase handling logic
                if (c.phase === 1) {
                    phase1Collected++;
                    if (phase1Collected >= PHASE1_COUNT && score >= PHASE1_SCORE_REQUIRED) {
                        currentPhase = 2;
                        collectibles.push(...this.phase2Collectibles);
                    }
                }
                else if (c.phase === 2) {
                    phase2Collected++;
                    if ((phase2Collected >= PHASE2_COUNT || score >= PHASE2_SCORE_REQUIRED) && !phase3Unlocked) {
                        currentPhase = 3;
                        phase3Unlocked = true;
                        collectibles.push(...this.phase3Collectibles);
                        timeLeft += PHASE3_TIME_BONUS;
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
    const levelConfig = getLevelConfig();
    const config = levelConfig[currentLevel] || levelConfig[1];
    const clearance = 150;
    const centerX = CANVAS_WIDTH / 2;
    const centerY = CANVAS_HEIGHT / 2;

    try {
        console.log('Starting obstacle load...');
        const data = await fetchObstacleData('obstacles.json');

        // 1. Load and filter predefined obstacles
        const filteredObstacles = data
            .filter(item => config.types.includes(item.type))
            .map(item => createObstacleFromData(item, config));

        // 2. Generate primary random obstacles
        const randomObstacles = generateRandomObstacles(config.randomCount, config);
        
        // 3. Add dense perimeter obstacles (new)
        const perimeterObstacles = generatePerimeterObstacles(15, config);
        
        // 4. Add clustered obstacles near edges (new)
        const clusterObstacles = [
            ...generateObstacleCluster(100, 100, 5, config),
            ...generateObstacleCluster(CANVAS_WIDTH-200, 100, 5, config),
            ...generateObstacleCluster(100, CANVAS_HEIGHT-200, 5, config),
            ...generateObstacleCluster(CANVAS_WIDTH-200, CANVAS_HEIGHT-200, 5, config)
        ];

        // Combine all obstacle sources
        obstacles = [
            ...filteredObstacles,
            ...randomObstacles,
            ...perimeterObstacles,
            ...clusterObstacles
        ].filter(obs => {
            const obsCenterX = obs.x + obs.width / 2;
            const obsCenterY = obs.y + obs.height / 2;
            return getDistance(obsCenterX, obsCenterY, centerX, centerY) > clearance;
        });

        console.log(`Level ${currentLevel} loaded with ${obstacles.length} obstacles`);

    } catch (error) {
        console.error('Error loading obstacles:', error);
        obstacles = generateRandomObstacles(40, getFallbackConfig()); // Increased fallback count
    }
}

// New helper functions
function generatePerimeterObstacles(count, config) {
    const perimeterObstacles = [];
    const sides = ['top', 'right', 'bottom', 'left'];
    
    for (let i = 0; i < count; i++) {
        const side = sides[i % 4];
        const type = config.types[Math.floor(Math.random() * config.types.length)];
        const preset = config.sizePresets[type];
        
        const width = preset.minW + Math.random() * (preset.maxW - preset.minW);
        const height = preset.minH + Math.random() * (preset.maxH - preset.minH);
        
        let x, y;
        
        switch(side) {
            case 'top':
                x = Math.random() * (CANVAS_WIDTH - width);
                y = 10;
                break;
            case 'right':
                x = CANVAS_WIDTH - width - 10;
                y = Math.random() * (CANVAS_HEIGHT - height);
                break;
            case 'bottom':
                x = Math.random() * (CANVAS_WIDTH - width);
                y = CANVAS_HEIGHT - height - 10;
                break;
            case 'left':
                x = 10;
                y = Math.random() * (CANVAS_HEIGHT - height);
                break;
        }
        
        perimeterObstacles.push(new Obstacle(x, y, width, height, type));
    }
    
    return perimeterObstacles;
}

function generateObstacleCluster(x, y, count, config) {
    const cluster = [];
    const clusterRadius = 150;
    
    for (let i = 0; i < count; i++) {
        const type = config.types[Math.floor(Math.random() * config.types.length)];
        const preset = config.sizePresets[type];
        
        const width = preset.minW + Math.random() * (preset.maxW - preset.minW);
        const height = preset.minH + Math.random() * (preset.maxH - preset.minH);
        
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * clusterRadius;
        
        cluster.push(new Obstacle(
            x + Math.cos(angle) * distance,
            y + Math.sin(angle) * distance,
            width,
            height,
            type
        ));
    }
    
    return cluster;
}

function getFallbackConfig() {
    return {
        types: ['tree', 'rock', 'bush'],
        randomCount: 20,
        sizePresets: {
            tree: { minW: 30, maxW: 50, minH: 50, maxH: 70 },
            rock: { minW: 20, maxW: 40, minH: 20, maxH: 40 },
            bush: { minW: 20, maxW: 40, minH: 20, maxH: 40 }
        }
    };
}

// ---------------------
// Helper Functions
// ---------------------

function getLevelConfig() {
    return {
        1: {
            types: ['house', 'fence', 'tree', 'rock'],
            randomCount: 8,
            sizePresets: {
                house: { minW: 80, maxW: 120, minH: 100, maxH: 140 },
                fence: { minW: 150, maxW: 300, minH: 15, maxH: 25 },
                tree: { minW: 30, maxW: 50, minH: 50, maxH: 70 },
                rock: { minW: 20, maxW: 40, minH: 20, maxH: 40 }
            }
        },
        2: {
            types: ['pond', 'tree', 'rock'],
            randomCount: 12,
            sizePresets: {
                pond: { minW: 100, maxW: 200, minH: 80, maxH: 160 },
                tree: { minW: 40, maxW: 60, minH: 60, maxH: 80 },
                rock: { minW: 30, maxW: 50, minH: 30, maxH: 50 }
            }
        },
        3: {
            types: ['tree', 'bush', 'rock'],
            randomCount: 15,
            sizePresets: {
                tree: { minW: 40, maxW: 60, minH: 70, maxH: 90 },
                bush: { minW: 20, maxW: 40, minH: 20, maxH: 40 },
                rock: { minW: 20, maxW: 40, minH: 20, maxH: 40 }
            }
        },
        4: {
            types: ['mirror', 'geometric'],
            randomCount: 10,
            sizePresets: {
                mirror: { minW: 50, maxW: 100, minH: 100, maxH: 150 },
                geometric: { minW: 40, maxW: 80, minH: 40, maxH: 80 }
            }
        },
        5: {
            types: ['portal', 'obelisk'],
            randomCount: 8,
            sizePresets: {
                portal: { minW: 60, maxW: 100, minH: 100, maxH: 120 },
                obelisk: { minW: 30, maxW: 50, minH: 80, maxH: 120 }
            }
        }
    };
}

async function fetchObstacleData(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`HTTP ${response.status} - ${response.statusText}`);
    }

    const text = await response.text();
    console.log('Raw JSON:', text);

    const data = JSON.parse(text);
    console.log('Parsed data:', data);

    if (!Array.isArray(data)) {
        throw new Error('Invalid obstacle data format - expected array');
    }

    return data;
}

function createObstacleFromData(item, config) {
    return new Obstacle(
        item.x ?? 0,
        item.y ?? 0,
        item.width ?? 40,
        item.height ?? 40,
        item.type ?? config.types[0],
        item.color
    );
}

function generateRandomObstacles(count, config) {
    const newObstacles = [];

    for (let i = 0; i < count; i++) {
        const type = pickRandom(config.types);
        const preset = config.sizePresets[type];

        const width = randomBetween(preset.minW, preset.maxW);
        const height = randomBetween(preset.minH, preset.maxH);

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

function getFallbackConfig() {
    return {
        types: ['tree', 'rock'],
        randomCount: 10,
        sizePresets: {
            tree: { minW: 30, maxW: 50, minH: 50, maxH: 70 },
            rock: { minW: 20, maxW: 40, minH: 20, maxH: 40 }
        }
    };
}

function pickRandom(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function randomBetween(min, max) {
    return min + Math.random() * (max - min);
}

function getDistance(x1, y1, x2, y2) {
    return Math.hypot(x2 - x1, y2 - y1);
}

        
async function loadCollectibles() {

    const collectibleConfig = {
        1: ['coin', 'gem'],
        2: ['coin', 'star'],
        3: ['gem', 'diamond'],
        4: ['crystal', 'mirror_shard'],
        5: ['portal_key', 'time_orb']
    };

    try {
        const response = await fetch('collectibles.json');
        const data = await response.json();
          collectibles = data.map(item => new Collectible(
            item.x, item.y,
            item.width || 20,
            item.height || 20,
            item.type || 'coin',
            item.value || 50,
            item.phase || 1
        ));

    } catch (error) {
        console.warn('Using default collectibles');

 // Initialize phase collectibles BEFORE using them
 player.phase2Collectibles = [/*...*/];
 player.phase3Collectibles = [/*...*/];
 
 // Generate collectibles
 const gridCollectibles = generateCollectibleGrid(6, 5, 1);
        
   
        const manualPhase1Collectibles = [
            new Collectible(150, 350, 30, 30, 'star', 100, 1),
            new Collectible(400, 250, 25, 25, 'gem', 75, 1),
            new Collectible(1100, 200, 25, 25, 'gem', 75, 1),
            new Collectible(200, 500, 20, 20, 'coin', 50, 1),
            new Collectible(800, 150, 20, 20, 'coin', 50, 1),
            new Collectible(650, 400, 30, 30, 'star', 100, 1),
            new Collectible(900, 450, 20, 20, 'coin', 50, 1),
            new Collectible(350, 150, 20, 20, 'coin', 50, 1),
            new Collectible(250, 200, 20, 20, 'coin', 50, 1),
            new Collectible(750, 300, 20, 20, 'coin', 50, 1),
            new Collectible(500, 500, 25, 25, 'gem', 75, 1),
            new Collectible(1000, 350, 20, 20, 'coin', 50, 1),
            new Collectible(300, 600, 30, 30, 'star', 100, 1),
            new Collectible(950, 100, 20, 20, 'coin', 50, 1),
            new Collectible(150, 450, 25, 25, 'gem', 75, 1),
            new Collectible(850, 700, 20, 20, 'coin', 50, 1),
            new Collectible(450, 400, 30, 30, 'star', 100, 1),
            new Collectible(700, 550, 20, 20, 'coin', 50, 1),
            new Collectible(1100, 650, 25, 25, 'gem', 75, 1),
            new Collectible(550, 150, 20, 20, 'coin', 50, 1),
            new Collectible(200, 250, 30, 30, 'star', 100, 1),
            new Collectible(1050, 500, 20, 20, 'coin', 50, 1)
            
        ];

        player.phase2Collectibles = [
            new Collectible(200, 600, 35, 35, 'diamond', 200, 2),
            new Collectible(300, 650, 35, 35, 'diamond', 200, 2),
            new Collectible(1200, 500, 35, 35, 'diamond', 200, 2),
            new Collectible(500, 700, 40, 40, 'crown', 250, 2),
            new Collectible(900, 800, 40, 40, 'crown', 250, 2),
            new Collectible(1300, 200, 30, 30, 'star', 150, 2),
            new Collectible(700, 300, 40, 40, 'crown', 250, 2)
        ];

        player.phase3Collectibles = [
            new Collectible(100, 100, 45, 45, 'artifact', 500, 3),
            new Collectible(1100, 700, 45, 45, 'artifact', 500, 3),
            new Collectible(600, 400, 50, 50, 'key', 750, 3),
            new Collectible(1300, 300, 50, 50, 'key', 750, 3),
            new Collectible(400, 600, 60, 60, 'artifact', 1000, 3),
            new Collectible(1000, 200, 60, 60, 'key', 1500, 3)
        ];

        collectibles = [...gridCollectibles, ...manualPhase1Collectibles];
        console.log(`Phase 1 ready - ${collectibles.length} collectibles loaded`);
    }
}

function generateCollectibleGrid(columns, rows, phase = 1)
 {
    const gridCollectibles = [];
    const colWidth = CANVAS_WIDTH / columns;
    const rowHeight = CANVAS_HEIGHT / rows;
    const types = [
        {type: 'coin', value: 50, weight: 6},
        {type: 'gem', value: 75, weight: 3},
        {type: 'star', value: 100, weight: 1}
    ];
    
    for (let col = 0; col < columns; col++) {
        for (let row = 0; row < rows; row++) {
            const totalWeight = types.reduce((sum, t) => sum + t.weight, 0);
            let random = Math.random() * totalWeight;
            let selectedType = types[0];
            
            for (const type of types) {
                if (random < type.weight) {
                    selectedType = type;
                    break;
                }
                random -= type.weight;
            }
            
            gridCollectibles.push(new Collectible(
                col * colWidth + 10 + Math.random() * (colWidth - 20),
                row * rowHeight + 10 + Math.random() * (rowHeight - 20),
                20, 20,
                selectedType.type,
                selectedType.value,
                phase
            ));
        }
    }
    return gridCollectibles;
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
            Phase: ${currentPhase}<br>
            Score: ${score}<br>
            Next Phase: ${
                currentPhase === 1 ? PHASE1_SCORE_REQUIRED - score :
                currentPhase === 2 ? PHASE2_SCORE_REQUIRED - score :
                PHASE3_SCORE_REQUIRED - score
            } points needed<br>
            Collisions: ${collisionCount}<br>
            ${specialItemsCollected.diamonds > 0 ? `♦: ${specialItemsCollected.diamonds}<br>` : ''}
            ${specialItemsCollected.crowns > 0 ? `♛: ${specialItemsCollected.crowns}<br>` : ''}
            ${specialItemsCollected.stars > 0 ? `★: ${specialItemsCollected.stars}` : ''}
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
    setLevelTheme();
    player.update();  // <--- Important
    player.draw();    // <--- Important


    particles = particles.filter(p => p.life > 0);
    particles.forEach(p => {
        p.update();
        p.draw();
    });

    obstacles.forEach(o => o.draw());
    collectibles.forEach(c => c.draw());
    


    updateDebugInfo();
    requestAnimationFrame(gameLoop);
}


    
 

    // Update and draw particles
    particles = particles.filter(p => p.life > 0);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    
    particles = particles.filter(p => p.life > 0);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    obstacles.forEach(o => o.draw());
    collectibles.forEach(c => c.draw());
    player.draw();
    
    requestAnimationFrame(gameLoop);




async function initGame() {
    // Basic canvas setup
    canvas = document.getElementById('game-canvas');
    ctx = canvas.getContext('2d');
    
    // Initial player position
    player = new Player(CANVAS_WIDTH/2, CANVAS_HEIGHT/2);
    
    // Load game elements
    await loadObstacles();
    await loadCollectibles();
    
    // Setup controls
    setupControls();
    resizeCanvas();
    
    // Start game loop
    gameLoop();
}

