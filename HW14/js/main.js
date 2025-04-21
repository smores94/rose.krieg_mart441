import * as THREE from './three.js/three.module.js';
import { OrbitControls } from './three.js/OrbitControls.js';
import * as CANNON from 'cannon-es';
import { Howl } from 'howler';

// SCENE SETUP
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111122);

// CAMERA
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 20, -30);
camera.lookAt(0, 0, 0);

// RENDERER
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// CONTROLS (for debugging)
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// PHYSICS WORLD
const world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -20, 0), // Stronger gravity for pinball
    allowSleep: true,
});
world.defaultContactMaterial.restitution = 0.7; // Bounciness



// 1. Set up scene, camera, renderer
scene.background = new THREE.Color(0x333333);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// 2. Add a table (floor)
const table = new THREE.Mesh(
    new THREE.BoxGeometry(20, 1, 40),
    new THREE.MeshStandardMaterial({ color: 0x226622 })
);
table.position.y = -0.5;
table.receiveShadow = true;
scene.add(table);

// 3. Add a ball
const ballGeo = new THREE.SphereGeometry(0.5, 32, 32);
const ballMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const ball = new THREE.Mesh(ballGeo, ballMat);
ball.castShadow = true;
ball.position.set(0, 5, 0);
scene.add(ball);

// 4. Add lights
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 5);
light.castShadow = true;
scene.add(light);
scene.add(new THREE.AmbientLight(0x404040));

// 5. Physics setup
const ballBody = new CANNON.Body({ mass: 1, shape: new CANNON.Sphere(0.5) });
ballBody.position.set(0, 5, 0);
world.addBody(ballBody);

// 6. Animation loop
function animate() {
    requestAnimationFrame(animate);
    world.step(1 / 60); // Update physics
    ball.position.copy(ballBody.position); // Sync 3D object with physics
    renderer.render(scene, camera);
}
animate();

// 7. Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Debug: Log success
console.log("It's working! Ball position:", ball.position);

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