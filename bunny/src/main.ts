import { Application, Assets, Sprite, Text } from "pixi.js";

(async () => {
  // Create a new application
  const app = new Application();

  // Initialize the application
  await app.init({ background: "#1099bb", resizeTo: window });

  // Append the application canvas to the document body
  document.getElementById("pixi-container")!.appendChild(app.canvas);

  // Load the bunny and carrot textures
  const bunnyTexture = await Assets.load("/assets/bunny.png");
  const carrotTexture = await Assets.load("/assets/carrot.png");

  // Create a bunny Sprite
  const bunny = new Sprite(bunnyTexture);

  // Helper to place carrot at a random position
  function placeCarrotRandomly(sprite: Sprite) {
    const margin = 30;
    const randX = margin + Math.random() * (app.screen.width - 2 * margin);
    const randY = margin + Math.random() * (app.screen.height - 2 * margin);
    sprite.position.set(randX, randY);
  }

  // Create a carrot Sprite at a random position
  const carrot = new Sprite(carrotTexture);
  carrot.anchor.set(0.5);
  placeCarrotRandomly(carrot);

  // Center the sprite's anchor point
  bunny.anchor.set(0.5);

  // Move the sprite to the center of the screen
  bunny.position.set(app.screen.width / 2, app.screen.height / 2);

  // Add the carrot and bunny to the stage
  app.stage.addChild(carrot);
  app.stage.addChild(bunny);

  // Scoreboard setup
  let score = 0;
  const scoreText = new Text(`Score: ${score}`, {
    fontFamily: "Arial",
    fontSize: 32,
    fill: 0xffffff,
    align: "right",
  });
  scoreText.anchor.set(1, 0); // right top
  scoreText.position.set(app.screen.width - 20, 20);
  app.stage.addChild(scoreText);

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

  // Update bunny rotation, movement, collision, and scoreboard
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

    // Collision detection (circle-based)
    const collisionDist = bunny.width * 0.4 + carrot.width * 0.4;
    const carrotDx = carrot.position.x - bunny.position.x;
    const carrotDy = carrot.position.y - bunny.position.y;
    const carrotDist = Math.sqrt(carrotDx * carrotDx + carrotDy * carrotDy);
    if (carrotDist < collisionDist) {
      // Bunny collects carrot
      score++;
      scoreText.text = `Score: ${score}`;
      placeCarrotRandomly(carrot);
    }

    // Keep scoreboard in top right if window resizes
    scoreText.position.set(app.screen.width - 20, 20);
  });
})();
