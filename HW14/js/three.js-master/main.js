// Import modules (if using bundler like Vite/Webpack)
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { Howl } from 'howler';

// === SETUP SCENE ===
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// === LIGHTING ===
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

// === PHYSICS WORLD ===
const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -9.82, 0) });

// === FLOOR ===
const floorBody = new CANNON.Body({ mass: 0 });
floorBody.addShape(new CANNON.Plane());
floorBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
world.addBody(floorBody);

const floorGeometry = new THREE.PlaneGeometry(20, 20);
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
floorMesh.rotation.x = -Math.PI / 2;
scene.add(floorMesh);

// === BALL ===
const ballRadius = 0.5;
const ballBody = new CANNON.Body({ mass: 1, shape: new CANNON.Sphere(ballRadius) });
ballBody.position.set(0, 5, 0);
world.addBody(ballBody);

const ballGeometry = new THREE.SphereGeometry(ballRadius, 32, 32);
const ballMaterial = new THREE.MeshStandardMaterial({ color: 0xff4444, metalness: 0.3, roughness: 0.6 });
const ballMesh = new THREE.Mesh(ballGeometry, ballMaterial);
scene.add(ballMesh);

// === WALLS ===
const wallShape = new CANNON.Box(new CANNON.Vec3(10, 1, 0.5));

const wallPositions = [
  { x: 0, y: 1, z: -10 },
  { x: 0, y: 1, z: 10 },
  { x: -10, y: 1, z: 0 },
  { x: 10, y: 1, z: 0 },
];

wallPositions.forEach(pos => {
  const body = new CANNON.Body({ mass: 0 });
  body.addShape(wallShape);
  body.position.set(pos.x, pos.y, pos.z);
  world.addBody(body);

  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(20, 2, 1),
    new THREE.MeshStandardMaterial({ color: 0x444444 })
  );
  mesh.position.copy(body.position);
  scene.add(mesh);
});

// === SOUND ===
const bounceSound = new Howl({ src: ['bounce.mp3'], volume: 0.5 });
const bumperSound = new Howl({ src: ['bumper.mp3'], volume: 0.7 });

// === SCORING ===
let score = 0;
const scoreDisplay = document.createElement('div');
scoreDisplay.style.position = 'absolute';
scoreDisplay.style.top = '10px';
scoreDisplay.style.left = '10px';
scoreDisplay.style.color = 'white';
scoreDisplay.style.fontSize = '24px';
scoreDisplay.style.fontFamily = 'monospace';
scoreDisplay.innerText = `Score: ${score}`;
document.body.appendChild(scoreDisplay);

// === BUMPERS ===
const bumpers = [];
const bumperMaterial = new THREE.MeshStandardMaterial({ color: 0x00aaff });

function createBumper(x, z) {
  const radius = 0.5;
  const bumperBody = new CANNON.Body({ mass: 0, shape: new CANNON.Sphere(radius) });
  bumperBody.position.set(x, radius, z);
  world.addBody(bumperBody);

  const bumperMesh = new THREE.Mesh(
    new THREE.SphereGeometry(radius, 16, 16),
    bumperMaterial
  );
  bumperMesh.position.set(x, radius, z);
  scene.add(bumperMesh);

  bumpers.push({ body: bumperBody, mesh: bumperMesh });

  bumperBody.addEventListener('collide', (e) => {
    bumperSound.play();
    score += 100;
    scoreDisplay.innerText = `Score: ${score}`;
  });
}

createBumper(-3, -2);
createBumper(3, -2);
createBumper(0, 2);

// === FLIPPERS (Simple Visual & Input-Based) ===
const flipperGeometry = new THREE.BoxGeometry(2, 0.2, 0.5);
const flipperMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });

const leftFlipper = new THREE.Mesh(flipperGeometry, flipperMaterial);
leftFlipper.position.set(-2, 0.2, 8);
leftFlipper.rotation.y = Math.PI / 4;
scene.add(leftFlipper);

const rightFlipper = new THREE.Mesh(flipperGeometry, flipperMaterial);
rightFlipper.position.set(2, 0.2, 8);
rightFlipper.rotation.y = -Math.PI / 4;
scene.add(rightFlipper);

let leftFlipperUp = false;
let rightFlipperUp = false;

window.addEventListener('keydown', (e) => {
  if (e.key === 'a') leftFlipperUp = true;
  if (e.key === 'd') rightFlipperUp = true;
});

window.addEventListener('keyup', (e) => {
  if (e.key === 'a') leftFlipperUp = false;
  if (e.key === 'd') rightFlipperUp = false;
});

// === CAMERA POSITION ===
camera.position.set(0, 10, 15);
camera.lookAt(0, 0, 0);

// === ANIMATION LOOP ===
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  world.step(1 / 60, delta, 3);

  ballMesh.position.copy(ballBody.position);
  ballMesh.quaternion.copy(ballBody.quaternion);

  bumpers.forEach(bumper => {
    bumper.mesh.position.copy(bumper.body.position);
    bumper.mesh.quaternion.copy(bumper.body.quaternion);
  });

  // Animate flippers
  leftFlipper.rotation.z = leftFlipperUp ? 0.5 : 0;
  rightFlipper.rotation.z = rightFlipperUp ? -0.5 : 0;

  renderer.render(scene, camera);
}

animate();

// === HANDLE RESIZE ===
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});