// Three.js core
import * as THREE from './js/three.js-master/build/three.module.js';

// Three.js controls
import { OrbitControls } from './js/three.js-master/examples/jsm/controls/OrbitControls.js';

// GLTF Loader (fixed path)
import { GLTFLoader } from './js/three.js-master/examples/jsm/loaders/GLTFLoader.js';

// Cannon-es (fixed import)
import * as CANNON from './js/cannon-es';

// Howler.js (fixed path)
import { Howl } from './js/howler/dist/howler.esm.js';

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

// CONTROLS
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// PHYSICS WORLD
const world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -20, 0),
    allowSleep: true,
});
world.defaultContactMaterial.restitution = 0.7;

// ------ FIXED MODEL LOADING ------
const loader = new GLTFLoader();
let trophy; // Declare variable outside loader scope

// Load first model
loader.load(
  './dirtyball/volley_ball_classic_dirty.glb', // Fixed path and extension
  (gltf) => {
    const model = gltf.scene;
    model.position.set(0, 5, -15);
    model.scale.set(0.5, 0.5, 0.5);
    scene.add(model);
  },
  undefined,
  (error) => console.error(error)
);

// Load trophy model
loader.load('trophy.glb', (gltf) => {
  trophy = gltf.scene;
  trophy.position.set(5, 5, 0);
  trophy.scale.set(0.5, 0.5, 0.5);
  scene.add(trophy);
});

// ------ REST OF YOUR SCENE SETUP ------
// TABLE
const table = new THREE.Mesh(
    new THREE.BoxGeometry(20, 1, 40),
    new THREE.MeshStandardMaterial({ color: 0x226622 })
);
table.position.y = -0.5;
table.receiveShadow = true;
scene.add(table);

// BALL
const ballGeo = new THREE.SphereGeometry(0.5, 32, 32);
const ballMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const ball = new THREE.Mesh(ballGeo, ballMat);
ball.castShadow = true;
ball.position.set(0, 5, 0);
scene.add(ball);

// PHYSICS BODY
const ballBody = new CANNON.Body({ 
    mass: 1, 
    shape: new CANNON.Sphere(0.5) 
});
ballBody.position.set(0, 5, 0);
world.addBody(ballBody);

// LIGHTS
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 5);
light.castShadow = true;
scene.add(light);
scene.add(new THREE.AmbientLight(0x404040));

// TEXT
const fontLoader = new FontLoader();
fontLoader.load(
  './js/three.js-master/examples/fonts/helvetiker_regular.typeface.json',
  (font) => {
    const textGeometry = new TextGeometry('PINBALL', {
      font: font,
      size: 1,
      height: 0.2,
    });
    const textMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.set(-4, 10, 0);
    scene.add(textMesh);
  }
);

// LINES
const points = [
  new THREE.Vector3(-10, 0, 20),
  new THREE.Vector3(10, 0, 20),
  new THREE.Vector3(10, 0, -20)
];
const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
const line = new THREE.Line(lineGeometry, lineMaterial);
scene.add(line);

// ANIMATION LOOP
function animate() {
  requestAnimationFrame(animate);
  world.step(1/60);
  
  // Update physics
  ball.position.copy(ballBody.position);
  ball.rotation.x += 0.01;
  ball.rotation.y += 0.01;

  // Rotate trophy if loaded
  if (trophy) {
    trophy.rotation.y += 0.02;
  }

  renderer.render(scene, camera);
}

// WINDOW RESIZE
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start animation
animate();