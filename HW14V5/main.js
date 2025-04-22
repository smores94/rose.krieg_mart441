// Basic pinball scene starter
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x333333);

// Table
const tableMat = new THREE.MeshStandardMaterial({
    color: 0x226622,
    roughness: 0.8,
    metalness: 0.2,
    side: THREE.DoubleSide  // Add this from your main.js version
});
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