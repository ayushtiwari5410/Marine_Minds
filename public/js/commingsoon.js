// Create bubbles
function createBubbles() {
  for (let i = 0; i < 20; i++) {
    const bubble = document.createElement("div");
    bubble.classList.add("bubble");
    bubble.style.left = `${Math.random() * 100}%`;
    bubble.style.width = `${Math.random() * 30 + 10}px`;
    bubble.style.height = bubble.style.width;
    bubble.style.animationDuration = `${Math.random() * 10 + 5}s`;
    bubble.style.animationDelay = `${Math.random() * 5}s`;
    document.body.appendChild(bubble);
  }
}

// Fact rotation
let facts;
let currentFact = 0;

function initializeFacts() {
  facts = document.querySelectorAll(".fact");
  if (facts.length > 0) {
    facts[currentFact].classList.add("active");
  } else {
    console.warn("No elements with class 'fact' found.");
  }
}

function rotateFacts() {
  if (facts && facts.length > 0) {
    facts[currentFact].classList.remove("active");
    currentFact = (currentFact + 1) % facts.length;
    facts[currentFact].classList.add("active");
  }
}

// Initialize everything when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  createBubbles();
  initializeFacts();

  if (facts && facts.length > 0) {
    setInterval(rotateFacts, 5000);
  }

  // Handle the audio/video element
  const mediaElement = document.querySelector("audio, video");
  if (mediaElement) {
    mediaElement.currentTime = 0;
  } else {
    console.warn("No audio or video element found.");
  }
});
