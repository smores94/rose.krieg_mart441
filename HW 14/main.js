import * as THREE from 'three';
import * as CANNON from 'cannon-es'; // cleaner import path if using a bundler
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// 1. Set up scene, camera, renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x333333);

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(10, 10, 20);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

// Attach to DOM
const app = document.getElementById('app');
if (app) {
    app.appendChild(renderer.domElement);
} else {
    console.error('Element with ID "app" not found.');
}

// Add orbit controls
const controls = new OrbitControls(camera, renderer.domElement);

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

// Improve shadow quality
light.shadow.mapSize.width = 1024;
light.shadow.mapSize.height = 1024;
light.shadow.camera.near = 0.5;
light.shadow.camera.far = 50;

scene.add(light);
scene.add(new THREE.AmbientLight(0x404040));

// 5. Physics setup
const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -20, 0) });

const ballBody = new CANNON.Body({
    mass: 1,
    shape: new CANNON.Sphere(0.5)
});
ballBody.position.set(0, 5, 0);
world.addBody(ballBody);

const groundBody = new CANNON.Body({
    mass: 0, // Static body
    shape: new CANNON.Box(new CANNON.Vec3(10, 0.5, 20))
});
groundBody.position.y = -0.5;
world.addBody(groundBody);

// 6. Animation loop with delta-based physics stepping
const fixedTimeStep = 1.0 / 60.0;
let lastTime;

function animate(time) {
    requestAnimationFrame(animate);

    if (lastTime !== undefined) {
        const delta = (time - lastTime) / 1000;
        world.step(fixedTimeStep, delta, 3);
    }
    lastTime = time;

    // Sync Three.js mesh with Cannon body
    ball.position.copy(ballBody.position);

    controls.update();
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
