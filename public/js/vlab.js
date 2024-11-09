// import { experimentContent } from "./experiments/index.js";
import { oceanAcidification } from "../js/experiments/oceanAcidification.js";
import { waves } from "./experiments/wavesFormation.js";
import { ecosystems } from "../js/experiments/ecosystems.js";
import { oceanCurrents } from "./experiments/oceanCurrent.js";
import { plasticPollution } from "./experiments/plasticPollution.js";
// import { tsunami } from "./experiments/tsunami.js";
import { salinity } from "./experiments/salinity.js";
import { oilSpill } from "./experiments/oilspill.js";

const experimentContent = {
  oceanAcidification,
  ecosystems,
  oceanCurrents,
  plasticPollution,
  oilSpill,
  waves,
  salinity,
  // ... other experiments ...
};

let currentExperimentId = null;

// DOM elements
const experimentList = document.getElementById("experiment-list");
const experimentTitle = document.getElementById("experiment-title");
const tabContents = document.querySelectorAll(".tab-content");
const tabs = document.querySelectorAll(".tab");
const progressBar = document.getElementById("progress");
const achievementPopup = document.getElementById("achievement-popup");

// Populate experiment list
function populateExperimentList() {
  Object.entries(experimentContent).forEach(([id, experiment]) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = "#";
    a.textContent = experiment.title;
    a.addEventListener("click", (e) => {
      e.preventDefault();
      loadExperiment(id);
    });
    li.appendChild(a);
    experimentList.appendChild(li);
  });
}

function initializeQuiz(id) {
  const quizContainer = document.getElementById("quiz");
  if (!quizContainer) {
    console.error(`Quiz container not found for experiment "${id}"`);
    return;
  }

  quizContainer.innerHTML = ""; // Clear previous quiz content

  const experiment = experimentContent[id];

  if (typeof experiment.initQuiz === "function") {
    try {
      experiment.initQuiz();
    } catch (error) {
      console.error(`Error initializing quiz for experiment "${id}":`, error);
      quizContainer.innerHTML = `<p>An error occurred while loading the quiz. Please try refreshing the page.</p>`;
    }
  } else {
    console.warn(`initQuiz is not a function for experiment "${id}"`);
    quizContainer.innerHTML = `<p>Quiz not available for this experiment.</p>`;
  }
}
// Load experiment
function loadExperiment(id) {
  currentExperimentId = id;
  const experiment = experimentContent[id];
  if (!experiment) {
    console.error(`Experiment with id "${id}" not found`);
    return;
  }
  resetProgress();
  experimentTitle.textContent = experiment.title;
  document.getElementById("theory").innerHTML = experiment.theory;
  document.getElementById("procedure").innerHTML = experiment.procedure;
  document.getElementById("simulation").innerHTML = experiment.simulation;
  document.getElementById("assignment").innerHTML = experiment.assignment;
  initializeQuiz(id); // Call the quiz initialization function
  document.getElementById("references").innerHTML = experiment.references;
  document.getElementById("feedback").innerHTML = experiment.feedback;

  // Hide welcome tab and show other tabs
  document.querySelector('.tab[data-tab="welcome"]').style.display = "none";
  document.getElementById("welcome").classList.remove("active");
  document.querySelector('.tab[data-tab="theory"]').classList.add("active");
  document.getElementById("theory").classList.add("active");

  // Initialize the simulation
  // Create a container for the simulation
  const simulationContainer = document.createElement("div");
  simulationContainer.id = `${id}-simulation`;
  document.getElementById("simulation").appendChild(simulationContainer);

  // Initialize the simulation
  if (typeof experiment.initSimulation === "function") {
    try {
      experiment.initSimulation(simulationContainer);
    } catch (error) {
      console.error(
        `Error initializing simulation for experiment "${id}":`,
        error
      );
      simulationContainer.innerHTML = `<p>An error occurred while loading the simulation. Please try refreshing the page.</p>`;
    }
  } else {
    console.warn(`initSimulation is not a function for experiment "${id}"`);
    simulationContainer.innerHTML = `<p>Simulation not available for this experiment.</p>`;
  }
}

// Tab functionality
tabs.forEach((tab) => {
  tab.addEventListener("click", (event) => openTab(event, tab.dataset.tab));
});

function openTab(event, tabName) {
  // Hide all tab contents
  tabContents.forEach((content) => content.classList.remove("active"));
  for (let i = 0; i < tabContents.length; i++) {
    tabContents[i].classList.remove("active"); // Hide other tab contents
  }

  // Show the clicked tab's content
  document.getElementById(tabName).classList.add("active");

  // Add the 'active' class to the clicked tab
  event.currentTarget.classList.add("active");

  // Initialize quiz only when the quiz tab is clicked
  if (tabName === "quiz") {
    const currentExperimentId = getCurrentExperimentId(); // You'll need to implement this function
    if (currentExperimentId) {
      initializeQuiz(currentExperimentId);
    }
  }

  // Update the progress only if this is the first time the tab is clicked
  updateProgress();
}

// Progress tracking
function updateProgress() {
  const completedTabs = document.querySelectorAll(".tab.active").length;
  const totalTabs = tabs.length - 1; // Exclude welcome tab

  const progressPercentage = Math.min((completedTabs / totalTabs) * 100, 100); // Ensure it doesn't exceed 100% // Calculate progress percentage

  // Update the progress bar width
  progressBar.style.width = progressPercentage + "%";
  console.log(`Progress updated: ${progressPercentage}%`);

  if (progressPercentage === 100) {
    showAchievement();
  }
}

function resetProgress() {
  progressBar.style.width = "0%";
  tabs.forEach((tab) => tab.classList.remove("active"));
  tabContents.forEach((content) => content.classList.remove("active"));
}

// Achievement popup
function showAchievement() {
  achievementPopup.style.display = "block";
  setTimeout(() => {
    achievementPopup.style.display = "none";
  }, 3000);
}

function getCurrentExperimentId() {
  return currentExperimentId;
}

document.addEventListener("DOMContentLoaded", () => {
  populateExperimentList();
  // Load the first experiment by default
  // Show welcome tab by default
  openTab(
    { currentTarget: document.querySelector('.tab[data-tab="welcome"]') },
    "welcome"
  );
});
