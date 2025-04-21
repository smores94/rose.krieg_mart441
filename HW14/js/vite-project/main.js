// Three.js core
import * as THREE from './js/three.js-master/build/three.module.js';

// Three.js controls
import { OrbitControls } from './js/three.js-master/examples/jsm/controls/OrbitControls.js';

// Cannon-es (needs npm install)
import * as CANNON from './js/cannon-es';

// Howler.js
// Correct import for ES modules
import { Howl } from './js/howler/dist/howler.esm.js';

// SCENE SETUP (only once!)
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111122);

// In main.js - Add after scene/camera setup but before animate()

// 1. First, import the GLTF loader
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';



// 3. Load your model (put this INSIDE your scene setup)
loader.load(
  './dirtyball/volley_ball_classic_dirty.mdl"', // Path to model file
  (gltf) => {
    const model = gltf.scene;
    
    // Position/scale your model
    model.position.set(0, 5, -15); // Adjust these values
    model.scale.set(0.5, 0.5, 0.5);
    
    // Add to scene
    scene.add(model);
    
    // Make it rotate (for homework requirement)
    model.rotation.y = Math.PI; // Adjust initial rotation if needed
  },
  undefined,
  (error) => {
    console.error('Error loading model:', error);
  }
);

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
    gravity: new CANNON.Vec3(0, -20, 0),
    allowSleep: true,
});
world.defaultContactMaterial.restitution = 0.7;

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

// Add to animate() loop
function animate() {
    requestAnimationFrame(animate);
    
    // Rotate the ball (already in your physics code)
    ball.rotation.x += 0.01;
    ball.rotation.y += 0.01;
  
    // Rotate a custom model (e.g., trophy)
    if (trophy) {
      trophy.rotation.y += 0.02;
    }
  }

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

// ANIMATION LOOP
function animate() {
    requestAnimationFrame(animate);
    world.step(1 / 60);
    ball.position.copy(ballBody.position);
    renderer.render(scene, camera);
}
animate();

// WINDOW RESIZE
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
// Load a GLTF model (replace 'trophy.glb' with your model)
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
loader.load('trophy.glb', (gltf) => {
  const trophy = gltf.scene;
  trophy.position.set(5, 5, 0); // Position it on the table
  trophy.scale.set(0.5, 0.5, 0.5);
  scene.add(trophy);
});


// Add a title
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

const fontLoader = new FontLoader();
fontLoader.load('https://cdn.jsdelivr.net/npm/three@0.132.2/examples/fonts/helvetiker_regular.typeface.json', (font) => {
  const textGeometry = new TextGeometry('PINBALL', {
    font: font,
    size: 1,
    height: 0.2,
  });
  const textMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  const textMesh = new THREE.Mesh(textGeometry, textMaterial);
  textMesh.position.set(-4, 10, 0);
  scene.add(textMesh);
});


// Add boundary lines
const points = [];
points.push(new THREE.Vector3(-10, 0, 20));
points.push(new THREE.Vector3(10, 0, 20));
points.push(new THREE.Vector3(10, 0, -20));

const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
const line = new THREE.Line(lineGeometry, lineMaterial);
scene.add(line);

// SOUND TEST (verify howler works)
const testSound = new Howl({
    src: ['https://assets.codepen.io/21542/howler-pinball-bumper.mp3']
});
console.log("Howler loaded:", testSound);