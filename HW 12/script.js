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
        console.log('All sprites loaded!');
      }
    };
    img.onerror = () => {
      console.error(`Failed to load sprite: ${path}`);
      this.loadedCount++; // Still count as loaded to prevent infinite waiting
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
    this.direction = 'down';
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

  updateAnimation() {
    if (this.isMoving) {
      this.frameCount += this.animationSpeed;
      this.frameIndex = Math.floor(this.frameCount) % 8;
    } else {
      this.frameIndex = 0;
      this.frameCount = 0;
    }
  }

  draw() {
    const screenX = (this.x - camera.x) * scaleFactor;
    const screenY = (this.y - camera.y) * scaleFactor;
    const screenSize = this.width * scaleFactor;

    if (this.spriteLoader.isComplete) {
      const sprite = this.spriteLoader.getSprite(this.direction, this.frameIndex);
      if (sprite && sprite.complete) {
        ctx.drawImage(sprite, screenX, screenY, screenSize, screenSize);
        return;
      }
    }
    
    // Fallback
    ctx.fillStyle = 'red';
    ctx.fillRect(screenX, screenY, screenSize, screenSize);
  }
}