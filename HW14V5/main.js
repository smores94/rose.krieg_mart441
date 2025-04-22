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