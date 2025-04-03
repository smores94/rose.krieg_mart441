class SpriteLoader {
  constructor() {
      this.sprites = {};
      this.loadedCount = 0;
      this.totalCount = 0;
      this.isComplete = false;
  }

  loadSprite(direction, frame, path) {
      const key = `${direction}_${frame}`;
      this.totalCount++;
      const img = new Image();
      img.onload = () => {
          this.loadedCount++;
          if (this.loadedCount === this.totalCount) {
              this.isComplete = true;
          }
      };
      img.src = path;
      this.sprites[key] = img;
  }

  getSprite(direction, frame) {
      return this.sprites[`${direction}_${frame}`];
  }
}
class Player extends GameObject {
  constructor(x, y) {
      super(x, y, PLAYER_SIZE, PLAYER_SIZE);
      this.speed = 5;
      this.direction = 'down'; // Default direction
      this.frameIndex = 0;
      this.animationSpeed = 0.15;
      this.frameCount = 0;
      this.isMoving = false;
      
      // Initialize sprite loader
      this.spriteLoader = new SpriteLoader();
      
      // Load all sprites
      this.loadSprites();
  }

  loadSprites() {
      const directions = ['up', 'right', 'down', 'left'];
      directions.forEach(direction => {
          for (let i = 0; i < 8; i++) {
              const path = `sprites/player_${direction}_${i}.png`;
              this.spriteLoader.loadSprite(direction, i, path);
          }
      });
  }

  const playerSprites = {};

async function preloadSprites() {
    const directions = ['up', 'right', 'down', 'left'];
    const promises = [];
    
    directions.forEach(direction => {
        playerSprites[direction] = [];
        for (let i = 0; i < 8; i++) {
            const img = new Image();
            playerSprites[direction].push(img);
            img.src = `sprites/player_${direction}_${i}.png`;
            promises.push(new Promise(resolve => {
                img.onload = resolve;
            }));
        }
    });
    
    await Promise.all(promises);
}

// Then modify Player class to use playerSprites directly