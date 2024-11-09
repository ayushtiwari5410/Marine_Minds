let text = document.getElementById("text");
let sky = document.getElementById("sky");
let moon = document.getElementById("moon");
let cloud1 = document.getElementById("cloud1");
let cloud2 = document.getElementById("cloud2");
let cloud3 = document.getElementById("cloud3");
let play = document.getElementById("playBtn");
let rock1 = document.getElementById("rock1");
let rock2 = document.getElementById("rock2");
let rock3 = document.getElementById("rock3");
let coral1 = document.getElementById("coral1");
let coral2 = document.getElementById("coral2");
let header = document.getElementById("header");

window.addEventListener("scroll", function () {
  let value = window.scrollY;

  text.style.top = 50 + value * -0.5 + "%";
  cloud1.style.top = value * -1.5 + "px";
  cloud1.style.left = value * 0.5 + "px";
  cloud2.style.top = value * -1 + "px";
  cloud2.style.left = value * -0.5 + "px";
  cloud3.style.top = value * -1.5 + "px";
  cloud3.style.left = value * 0.2 + "px";
  play.style.bottom = value * 0.5 + "px";
  rock1.style.top = value * -0.12 + "px";
  rock2.style.top = value * -0.06 + "px";
  rock3.style.top = value * -0.09 + "px";
  coral1.style.top = value * -0.08 + "px";
  coral2.style.top = value * -0.1 + "px";
  header.style.top = value * 0.5 + "px";
});

// Track moon and clouds with mouse movement
document.addEventListener("mousemove", function (e) {
  let moveX = (e.clientX - window.innerWidth / 2) * 0.025;
  let moveY = (e.clientY - window.innerHeight / 2) * 0.025;
  moon.style.transform = `translate(${moveX}px, ${moveY}px)`;
  cloud1.style.transform = `translate(${moveX * 0.5}px, ${moveY * 0.5}px)`;
  cloud2.style.transform = `translate(${moveX * 0.3}px, ${moveY * 0.3}px)`;
  cloud3.style.transform = `translate(${moveX * 0.7}px, ${moveY * 0.7}px)`;
});

document.getElementById("playBtn").addEventListener("click", function () {
  alert("Starting the ocean adventure game!");
  // Add your game initialization code here
});

// Enhanced moon vibration effect
let moveX = 0,
  moveY = 0;
function vibrateMoon() {
  let time = Date.now() * 0.001;
  let offsetX = Math.sin(time) * 2;
  let offsetY = Math.cos(time) * 2;
  moon.style.transform = `translate(${moveX + offsetX}px, ${
    moveY + offsetY
  }px)`;
  requestAnimationFrame(vibrateMoon);
}
vibrateMoon();

// Synchronized cloud movement
function moveCloud(cloud, speed) {
  let time = Date.now() * 0.001;
  let offsetX = Math.sin(time * speed) * 10;
  let offsetY = Math.cos(time * speed) * 5;
  cloud.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
  requestAnimationFrame(() => moveCloud(cloud, speed));
}
moveCloud(cloud1, 0.5);
moveCloud(cloud2, 0.3);
moveCloud(cloud3, 0.7);

// Bioluminescent effect
function createBioluminescence() {
  const bio = document.createElement("div");
  bio.classList.add("bioluminescent");
  bio.style.left = `${Math.random() * 100}%`;
  bio.style.top = `${Math.random() * 100}%`;
  bio.style.width = bio.style.height = `${Math.random() * 50 + 20}px`;
  document.body.appendChild(bio);
  setTimeout(() => bio.remove(), 8000);
}
setInterval(createBioluminescence, 1000);

// Interactive water ripples
// document.addEventListener("mousemove", function (e) {
//   const ripple = document.createElement("div");
//   ripple.classList.add("bioluminescent");
//   ripple.style.left = `${e.clientX}px`;
//   ripple.style.top = `${e.clientY}px`;
//   ripple.style.width = ripple.style.height = "100px";
//   document.body.appendChild(ripple);
//   setTimeout(() => ripple.remove(), 2000);
// });

// Day/night cycle
window.addEventListener("scroll", function () {
  let scrollPercentage =
    window.scrollY /
    (document.documentElement.scrollHeight - window.innerHeight);
  let skyColor = `rgb(${Math.round(0 + scrollPercentage * 135)}, ${Math.round(
    30 + scrollPercentage * 176
  )}, ${Math.round(45 + scrollPercentage * 210)})`;
  document.body.style.background = skyColor;
});

// SVG animations for fish
function createFish() {
  const fish = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  fish.setAttribute("class", "fish-svg");
  fish.setAttribute("viewBox", "0 0 100 100");
  fish.innerHTML = `
                <path d="M70 50 C90 40, 90 60, 70 50 L30 30 C20 40, 20 60, 30 70 Z" />
            `;
  fish.style.top = `${Math.random() * 80 + 10}%`;
  document.getElementById("fish").appendChild(fish);
  setTimeout(() => fish.remove(), 20000);
}
setInterval(createFish, 3000);

// SVG animations for seaweed
function createSeaweed() {
  const seaweed = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  seaweed.setAttribute("class", "seaweed-svg");
  seaweed.setAttribute("viewBox", "0 0 100 100");
  seaweed.innerHTML = `
                <path d="M50 100 C30 80, 70 60, 50 40 C30 20, 70 0, 50 0" />
            `;
  seaweed.style.left = `${Math.random() * 100}%`;
  document.getElementById("seaweed").appendChild(seaweed);
}
for (let i = 0; i < 5; i++) {
  createSeaweed();
}

// Add interactive hotspots
const hotspots = [
  {
    top: "30%",
    left: "20%",
    fact: "The ocean covers more than 70% of Earth's surface.",
  },
  {
    top: "60%",
    left: "70%",
    fact: "The deepest known point in the ocean is the Challenger Deep in the Mariana Trench, at about 11,000 meters (36,000 feet) deep.",
  },
  {
    top: "40%",
    left: "50%",
    fact: "There are more historical artifacts under the sea than in all of the world's museums.",
  },
];

hotspots.forEach((spot) => {
  const hotspot = document.createElement("div");
  hotspot.classList.add("hotspot");
  hotspot.style.position = "absolute"; // Ensure it is positioned correctly
  hotspot.style.top = spot.top;
  hotspot.style.left = spot.left;
  hotspot.addEventListener("click", () => showFact(spot.fact));
  document.getElementById("home").appendChild(hotspot);
});

function showFact(fact) {
  const popup = document.getElementById("factPopup");
  popup.textContent = fact;
  popup.style.display = "block";
  setTimeout(() => {
    popup.style.display = "none";
  }, 3000);
}

// Add subtle sound effects
const oceanAmbience = document.getElementById("oceanAmbience");
const bubbleSound = document.getElementById("bubbleSound");

document.getElementById("playBtn").addEventListener("click", () => {
  oceanAmbience.play();
});

document.addEventListener("mousemove", () => {
  if (Math.random() < 0.05) {
    bubbleSound.currentTime = 0;
    bubbleSound.play();
  }
});

// Depth gauge functionality
window.addEventListener("scroll", function () {
  let scrollPercentage =
    (window.scrollY /
      (document.documentElement.scrollHeight - window.innerHeight)) *
    100;
  document.getElementById(
    "depthIndicator"
  ).style.height = `${scrollPercentage}%`;
});
