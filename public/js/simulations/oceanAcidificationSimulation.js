export function initOceanAcidificationSimulation(container) {
  container.innerHTML = `
    <div class="simulation" id="ocean-acidification-sim">
      <h2>Ocean Acidification Simulation</h2>
      <div class="controls-canvas-wrapper">
        <div class="controls">
          <div class="control-group">
            <label for="co2-level">CO2 Level: <span id="co2-level-value">400</span> ppm</label>
            <input type="range" id="co2-level" min="300" max="1000" value="400">
          </div>
          <div class="control-group">
            <label for="time-scale">Time Scale: <span id="time-scale-value">1</span>x</label>
            <input type="range" id="time-scale" min="1" max="100" step="1" value="1">
          </div>
          <div class="button-group">
            <button id="add-shellfish">Add Shellfish</button>
            <button id="add-coral">Add Coral</button>
            <button id="add-phytoplankton">Add Phytoplankton</button>
          </div>
        </div>
        <canvas id="ocean-acidification-canvas" class="simulation-canvas"></canvas>
      </div>
      <div id="info-panel" class="info-panel"></div>
    </div>
  `;

  // Add styles
  const style = document.createElement("style");
  style.textContent = `
    .simulation {
      font-family: Arial, sans-serif;
      max-width: 800px;
      margin: 0 auto;
    }
    .controls-canvas-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .controls {
      width: 100%;
      margin-bottom: 20px;
    }
    .control-group {
      margin-bottom: 15px;
    }
    .control-group label {
      display: block;
      margin-bottom: 5px;
    }
    .control-group input[type="range"] {
      width: 100%;
    }
    .button-group {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
    }
    .button-group button {
      flex: 1;
      margin: 0 5px;
      padding: 10px;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.3s;
    }
    .button-group button:hover {
      background-color: #45a049;
    }
    .simulation-canvas {
      border: 1px solid #ddd;
    }
    .info-panel {
      margin-top: 20px;
      padding: 10px;
      background-color: #f0f0f0;
      border-radius: 5px;
    }
  `;
  document.head.appendChild(style);

  const co2LevelSlider = document.getElementById("co2-level");
  const co2LevelValue = document.getElementById("co2-level-value");
  const timeScaleSlider = document.getElementById("time-scale");
  const timeScaleValue = document.getElementById("time-scale-value");
  const addShellfishBtn = document.getElementById("add-shellfish");
  const addCoralBtn = document.getElementById("add-coral");
  const addPhytoplanktonBtn = document.getElementById("add-phytoplankton");
  const canvas = document.getElementById("ocean-acidification-canvas");
  const ctx = canvas.getContext("2d");
  const infoPanel = document.getElementById("info-panel");

  canvas.width = 800;
  canvas.height = 600;

  let co2Level = 400;
  let timeScale = 1;
  let organisms = [];
  let bubbles = [];
  let currentYear = 2024;
  let temperature = 15; // Starting temperature in Celsius

  let shellfishImage = new Image();
  let coralImage = new Image();
  shellfishImage.src = "./models/fish.png";
  coralImage.src = "./models/corals.png";

  class Organism {
    constructor(x, y, type) {
      this.x = x;
      this.y = y;
      this.type = type;
      // Increase size for shellfish and coral specifically
      if (type === "shellfish") {
        this.size = 40; // Increased size for shellfish
      } else if (type === "coral") {
        this.size = 45; // Increased size for coral
      } else {
        this.size = 5; // Keep phytoplankton small
      }
      this.health = 100;
      this.age = 0;
    }

    update(pH, temp) {
      this.age += 0.1 * timeScale;

      if (this.type === "shellfish") {
        if (pH < 7.8) {
          this.health -= (7.8 - pH) * 0.2 * timeScale;
        }
        if (temp > 20) {
          this.health -= (temp - 20) * 0.1 * timeScale;
        }
      } else if (this.type === "coral") {
        if (pH < 8.0) {
          this.health -= (8.0 - pH) * 0.3 * timeScale;
        }
        if (temp > 28) {
          this.health -= (temp - 28) * 0.2 * timeScale;
        }
      } else if (this.type === "phytoplankton") {
        if (pH < 7.6) {
          this.health -= (7.6 - pH) * 0.1 * timeScale;
        }
        if (temp > 25) {
          this.health -= (temp - 25) * 0.05 * timeScale;
        }
      }

      this.health = Math.max(0, Math.min(100, this.health));
    }

    draw() {
      const alpha = this.health / 100;
      ctx.globalAlpha = alpha;
      if (this.type === "shellfish") {
        ctx.drawImage(
          shellfishImage,
          this.x - this.size / 2,
          this.y - this.size / 2,
          this.size,
          this.size
        );
      } else if (this.type === "coral") {
        ctx.drawImage(
          coralImage,
          this.x - this.size / 2,
          this.y - this.size / 2,
          this.size,
          this.size
        );
      } else if (this.type === "phytoplankton") {
        ctx.fillStyle = "green";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Draw health bar
      ctx.fillStyle = `rgb(${255 - this.health * 2.55}, ${
        this.health * 2.55
      }, 0)`;
      ctx.fillRect(
        this.x - this.size,
        this.y - this.size - 10,
        this.size * 2 * (this.health / 100),
        5
      );
    }
  }

  class Bubble {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 5 + 2;
      this.speed = Math.random() * 2 + 1;
    }

    update() {
      this.y -= this.speed * timeScale;
      if (this.y + this.size < 0) {
        this.y = canvas.height + this.size;
      }
    }

    draw() {
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function addOrganism(type) {
    organisms.push(
      new Organism(
        Math.random() * canvas.width,
        Math.random() * (canvas.height / 2) + canvas.height / 2,
        type
      )
    );
  }

  function calculatePH(co2) {
    return 8.1 - Math.log(co2 / 400) * 0.3;
  }

  function updateTemperature() {
    temperature = 15 + (co2Level - 400) * 0.01;
  }

  function updateSimulation() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updateTemperature();

    const pH = calculatePH(co2Level);
    const blueValue = Math.max(0, Math.min(255, 190 - (co2Level - 400) * 0.2));
    ctx.fillStyle = `rgb(0, ${119 - (temperature - 15) * 5}, ${blueValue})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    organisms = organisms.filter((org) => org.health > 0);
    organisms.forEach((org) => {
      org.update(pH, temperature);
      org.draw();
    });

    bubbles.forEach((bubble) => {
      bubble.update();
      bubble.draw();
    });

    if (Math.random() < 0.1 * timeScale * (co2Level / 400)) {
      bubbles.push(new Bubble(Math.random() * canvas.width, canvas.height));
    }

    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.fillText(`pH: ${pH.toFixed(2)}`, 10, 20);
    ctx.fillText(`Temperature: ${temperature.toFixed(1)}°C`, 10, 40);
    ctx.fillText(`Year: ${Math.floor(currentYear)}`, 10, 60);
    ctx.fillText(`Organisms: ${organisms.length}`, 10, 80);

    currentYear += 0.1 * timeScale;

    updateInfoPanel(pH, temperature);

    requestAnimationFrame(updateSimulation);
  }

  function updateInfoPanel(pH, temperature) {
    let info = `
      <h3>Ocean Acidification Information</h3>
      <p>CO2 Level: ${co2Level} ppm</p>
      <p>pH: ${pH.toFixed(2)}</p>
      <p>Temperature: ${temperature.toFixed(1)}°C</p>
      <p>Year: ${Math.floor(currentYear)}</p>
      <h4>Effects:</h4>
      <ul>
        <li>Shellfish: ${getHealthStatus(pH, 7.8, temperature, 20)}</li>
        <li>Coral: ${getHealthStatus(pH, 8.0, temperature, 28)}</li>
        <li>Phytoplankton: ${getHealthStatus(pH, 7.6, temperature, 25)}</li>
      </ul>
    `;
    infoPanel.innerHTML = info;
  }

  function getHealthStatus(pH, criticalPH, temp, criticalTemp) {
    if (pH < criticalPH - 0.2 || temp > criticalTemp + 2) {
      return "Severe stress";
    } else if (pH < criticalPH || temp > criticalTemp) {
      return "Moderate stress";
    } else {
      return "Healthy";
    }
  }

  co2LevelSlider.addEventListener("input", () => {
    co2Level = parseInt(co2LevelSlider.value);
    co2LevelValue.textContent = co2Level;
  });

  timeScaleSlider.addEventListener("input", () => {
    timeScale = parseInt(timeScaleSlider.value);
    timeScaleValue.textContent = timeScale;
  });

  addShellfishBtn.addEventListener("click", () => addOrganism("shellfish"));
  addCoralBtn.addEventListener("click", () => addOrganism("coral"));
  addPhytoplanktonBtn.addEventListener("click", () =>
    addOrganism("phytoplankton")
  );

  for (let i = 0; i < 20; i++) {
    bubbles.push(
      new Bubble(Math.random() * canvas.width, Math.random() * canvas.height)
    );
  }

  for (let i = 0; i < 5; i++) {
    addOrganism("shellfish");
    addOrganism("coral");
    addOrganism("phytoplankton");
  }

  updateSimulation();
}
