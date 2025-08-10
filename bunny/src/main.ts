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

  // Track mouse position
  let mouseX = app.screen.width / 2;
  let mouseY = app.screen.height / 2;

  // Listen for mouse move events
  window.addEventListener("mousemove", (event) => {
    const rect = app.canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;
  });

  // Update bunny rotation to face the mouse pointer
  app.ticker.add(() => {
    const dx = mouseX - bunny.position.x;
    const dy = mouseY - bunny.position.y;
    bunny.rotation = Math.atan2(dy, dx);
  });
})();
