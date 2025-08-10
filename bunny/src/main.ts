import { Application, Assets, Sprite } from "pixi.js";

(async () => {
  // Create a new application
  const app = new Application();

  // Initialize the application
  await app.init({ background: "#1099bb", resizeTo: window });

  // Append the application canvas to the document body
  document.getElementById("pixi-container")!.appendChild(app.canvas);

  // Load the bunny texture
  const texture = await Assets.load("/assets/bunny.png");

  // Create a bunny Sprite
  const bunny = new Sprite(texture);

  // Center the sprite's anchor point
  bunny.anchor.set(0.5);

  // Move the sprite to the center of the screen
  bunny.position.set(app.screen.width / 2, app.screen.height / 2);

  // Add the bunny to the stage
  app.stage.addChild(bunny);

  // Track mouse position and target position for movement
  let mouseX = app.screen.width / 2;
  let mouseY = app.screen.height / 2;
  let targetX = bunny.position.x;
  let targetY = bunny.position.y;

  // Listen for click events to set target position
  app.canvas.addEventListener("click", (event) => {
    const rect = app.canvas.getBoundingClientRect();
    targetX = event.clientX - rect.left;
    targetY = event.clientY - rect.top;
  });

  // Listen for mouse move events
  window.addEventListener("mousemove", (event) => {
    const rect = app.canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;
  });

  // Update bunny rotation to face the mouse pointer and move towards target
  app.ticker.add(() => {
    // Rotate to face mouse
    const dx = mouseX - bunny.position.x;
    const dy = mouseY - bunny.position.y;
  // Adjust rotation so that 0 radians is facing down
  bunny.rotation = Math.atan2(dy, dx) - Math.PI / 2;

    // Move towards target position
    const moveDx = targetX - bunny.position.x;
    const moveDy = targetY - bunny.position.y;
    const distance = Math.sqrt(moveDx * moveDx + moveDy * moveDy);
    const speed = 3; // pixels per frame
    if (distance > speed) {
      bunny.position.x += (moveDx / distance) * speed;
      bunny.position.y += (moveDy / distance) * speed;
    } else if (distance > 0) {
      bunny.position.x = targetX;
      bunny.position.y = targetY;
    }
  });
})();
