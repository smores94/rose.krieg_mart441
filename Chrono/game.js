const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    }
};

const game = new Phaser.Game(config);

let player, shards, cursors, shardsCollected = 0;
const shardsRequired = 5;
let puzzleImage, puzzlePieces = [];
let puzzleActive = false;

function preload() {
    this.load.image('player', 'assets/player.png');
    this.load.image('shard', 'assets/shard.png');
    this.load.image('puzzleBase', 'assets/puzzle1.png');
    this.load.image('puzzlePiece1', 'assets/puzzle_piece1.png');
    // Load more assets as needed
}

function create() {
    // Create player
    player = this.physics.add.sprite(400, 300, 'player');
    player.setCollideWorldBounds(true);
    
    // Create shards
    shards = this.physics.add.group();
    for (let i = 0; i < 10; i++) {
        const x = Phaser.Math.Between(50, 750);
        const y = Phaser.Math.Between(50, 550);
        shards.create(x, y, 'shard');
    }
    
    // Collision detection
    this.physics.add.overlap(player, shards, collectShard, null, this);
    
    // Controls
    cursors = this.input.keyboard.createCursorKeys();
    
    // UI
    this.shardText = this.add.text(16, 16, 'Shards: 0/' + shardsRequired, {
        fontSize: '32px',
        fill: '#fff'
    });
}

function update() {
    if (puzzleActive) return;
    
    // Player movement
    player.setVelocity(0);
    
    if (cursors.left.isDown) {
        player.setVelocityX(-200);
    } else if (cursors.right.isDown) {
        player.setVelocityX(200);
    }
    
    if (cursors.up.isDown) {
        player.setVelocityY(-200);
    } else if (cursors.down.isDown) {
        player.setVelocityY(200);
    }
}

function collectShard(player, shard) {
    shard.disableBody(true, true);
    shardsCollected++;
    this.shardText.setText('Shards: ' + shardsCollected + '/' + shardsRequired);
    
    if (shardsCollected >= shardsRequired) {
        startPuzzle.call(this);
    }
}

function startPuzzle() {
    puzzleActive = true;
    player.setVisible(false);
    
    // Display puzzle background
    puzzleImage = this.add.image(400, 300, 'puzzleBase');
    puzzleImage.setScale(0.5);
    
    // Create puzzle pieces
    const piece1 = this.add.image(200, 150, 'puzzlePiece1')
        .setInteractive()
        .setScale(0.5);
    this.input.setDraggable(piece1);
    
    // Add more pieces as needed
    
    // Set up drag events
    this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
        gameObject.x = dragX;
        gameObject.y = dragY;
    });
    
    // Add puzzle completion check
    // This would check if pieces are in correct positions
}

// Add puzzle completion function
function checkPuzzleComplete() {
    // Logic to verify puzzle pieces are correctly placed
    // If complete:
    // this.scene.start('Level2'); or similar for progression
}