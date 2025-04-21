// Three.js core
import * as THREE from './three.js-master/build/three.module.js';

// Three.js controls
import { OrbitControls } from './three.js-master/examples/jsm/controls/OrbitControls.js';

// Cannon-es (needs npm install)
import * as CANNON from './cannon-es';

// Howler.js
import { Howl } from './howler.js';

// SCENE SETUP (only once!)
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

// SOUND TEST (verify howler works)
const testSound = new Howl({
    src: ['https://assets.codepen.io/21542/howler-pinball-bumper.mp3']
});
console.log("Howler loaded:", testSound);