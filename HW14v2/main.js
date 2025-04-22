import * as THREE from 'three';
import * as CANNON from 'cannon-es';

// Create scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

// Ball
const ballGeo = new THREE.SphereGeometry(0.5);
const ballMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const ball = new THREE.Mesh(ballGeo, ballMat);

// Flippers (use rotated boxes)
const flipperGeo = new THREE.BoxGeometry(2, 0.5, 4);
const leftFlipper = new THREE.Mesh(flipperGeo, metalMaterial);

const world = new CANNON.World({ gravity: { x: 0, y: -9.82, z: 0 } });

// Create physics bodies for all objects
const ballBody = new CANNON.Body({ mass: 1, shape: new CANNON.Sphere(0.5) });
world.addBody(ballBody);

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowLeft') {
      // Activate left flipper
    }
    if (e.code === 'ArrowRight') {
      // Activate right flipper
    }
    if (e.code === 'Space') {
      // Launch plunger
    }
  });

  // Using Raycaster for mouse interaction
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onClick(event) {
  // Calculate mouse position
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Check intersections
  const intersects = raycaster.intersectObjects(clickableObjects);
  if (intersects.length > 0) {
    // Handle button press
  }
}

// Basic pinball scene starter
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x333333);

// Table
const table = new THREE.Mesh(
  new THREE.BoxGeometry(20, 1, 40),
  new THREE.MeshStandardMaterial({ color: 0x226622 })
);
scene.add(table);

// Ball
const ball = new THREE.Mesh(
  new THREE.SphereGeometry(0.5),
  new THREE.MeshStandardMaterial({ color: 0xff0000 })
);
ball.position.set(0, 5, 0);
scene.add(ball);

// Camera position
camera.position.set(0, 15, -20);
camera.lookAt(0, 0, 0);