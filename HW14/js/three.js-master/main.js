// Create a sphere (ball)
const ballGeometry = new THREE.SphereGeometry(1, 32, 32);
const ballMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
const ball = new THREE.Mesh(ballGeometry, ballMaterial);
scene.add(ball);

// Physics world
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0); // Earth-like gravity

// Physics ball body
const ballPhysicsBody = new CANNON.Body({
  mass: 1, // Makes it dynamic
  position: new CANNON.Vec3(0, 5, 0), // Start above the floor
  shape: new CANNON.Sphere(1), // Match the radius of the visual ball
});
world.addBody(ballPhysicsBody);

// Sync Three.js ball with physics
function animate() {
  requestAnimationFrame(animate);
  world.step(1/60); // Update physics

  // Match the 3D model to the physics body
  ball.position.copy(ballPhysicsBody.position);
  ball.quaternion.copy(ballPhysicsBody.quaternion);

  renderer.render(scene, camera);
}
animate();

// Physics floor
const floorBody = new CANNON.Body({ mass: 0 }); // Static body
floorBody.addShape(new CANNON.Plane());
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI/2);
world.addBody(floorBody);

// Visual floor (optional)
const floorGeometry = new THREE.PlaneGeometry(20, 20);
const floorMaterial = new THREE.MeshPhongMaterial({ color: 0x444444 });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI/2;
scene.add(floor);

// Left flipper (physics)
const leftFlipperBody = new CANNON.Body({ mass: 0 });
leftFlipperBody.addShape(new CANNON.Box(new CANNON.Vec3(2, 0.2, 1)));
leftFlipperBody.position.set(-5, 0.2, 0);
world.addBody(leftFlipperBody);

// Right flipper (similar code)
// ...

// Keyboard controls
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    // Apply torque to left flipper
    leftFlipperBody.angularVelocity.y = -5;
  } else if (e.key === 'ArrowRight') {
    // Apply torque to right flipper
    rightFlipperBody.angularVelocity.y = 5;
  }
});

document.addEventListener('keydown', (e) => {
    if (e.key === ' ') { // Spacebar
      ballPhysicsBody.velocity.set(0, 0, 10); // Launch forward
    }
  });
  ballPhysicsBody.material = new CANNON.Material({ restitution: 0.8 });
floorBody.material = new CANNON.Material({ restitution: 0.5 });
// Define contact materials for interactions

ball.castShadow = true;
floor.receiveShadow = true;
renderer.shadowMap.enabled = true;