// Combined JavaScript file

//Navbar
document.querySelector(".nav-toggle").addEventListener("click", function () {
  document.querySelector(".nav-items").classList.toggle("active");
});

// Utility function to load HTML content into a specified element
function loadSection(sectionId, filePath, callback) {
  fetch(filePath)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to load ${filePath}: ${response.statusText}`);
      }
      return response.text();
    })
    .then((html) => {
      document.getElementById(sectionId).innerHTML = html;
      if (callback) callback(); // Call the callback function after content loads
    })
    .catch((error) => {
      console.error("Error loading section:", error);
    });
}

// Initialize the scroll sound functionality
function initializeScrollSound() {
  const scrollSound = document.getElementById("scroll-sound");
  let lastScrollTop = 0;
  let isPlaying = false;

  function playScrollSound() {
    const st = window.pageYOffset || document.documentElement.scrollTop;

    if (Math.abs(lastScrollTop - st) <= 5) return;

    if (!isPlaying) {
      scrollSound.play().catch((error) => {
        console.error("Sound playback failed:", error);
      });
      isPlaying = true;

      scrollSound.addEventListener(
        "ended",
        () => {
          isPlaying = false;
        },
        { once: true }
      );
    }

    lastScrollTop = st <= 0 ? 0 : st;
  }

  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  window.addEventListener(
    "scroll",
    debounce(() => {
      let value = window.scrollY;

      text.style.top = 50 + value * -0.5 + "%";
      cloud1.style.top = value * -1.5 + "px";
      cloud1.style.top = value * 0.5 + "px";
      // Apply similar transformations to other elements
    }, 10)
  ); // Adjust debounce time as needed

  window.addEventListener("scroll", debounce(playScrollSound, 150));
}

// Initialize FAQ toggle functionality
function initializeFAQs() {
  const faqSection = document.getElementById("FAQs-section");
  if (!faqSection) return;

  const faqs = faqSection.querySelectorAll("[data-faq]");

  faqs.forEach((faq) => {
    const question = faq.querySelector(".faq-question");
    if (!question) return;

    question.addEventListener("click", () => {
      faqs.forEach((otherFaq) => {
        if (otherFaq !== faq && otherFaq.classList.contains("open")) {
          otherFaq.classList.remove("open");
        }
      });

      faq.classList.toggle("open");
    });
  });
}

// Initialize card scrolling functionality
function initializeCardScrolling() {
  const cardSection = document.querySelector("#Card-Section");
  if (!cardSection) return;

  const cardContainer = cardSection.querySelector(".card-container");
  if (!cardContainer) return;

  const scrollSpeed = 8; // Increased speed (was 10 before)
  let isAutoScrolling = true;
  let scrollAnimationFrame;
  let touchStartX;

  // Clone cards to create a seamless loop
  const cards = Array.from(cardContainer.children);
  cards.forEach((card) => {
    const clone = card.cloneNode(true);
    cardContainer.appendChild(clone);
  });

  function autoScroll() {
    if (!isAutoScrolling) return;

    cardContainer.scrollLeft += scrollSpeed;
    if (cardContainer.scrollLeft >= cardContainer.scrollWidth / 2) {
      cardContainer.scrollLeft = 0;
    }

    scrollAnimationFrame = requestAnimationFrame(autoScroll);
  }

  function startAutoScroll() {
    if (!isAutoScrolling) {
      isAutoScrolling = true;
      autoScroll();
    }
  }

  function stopAutoScroll() {
    isAutoScrolling = false;
    cancelAnimationFrame(scrollAnimationFrame);
  }

  // Touch event handlers for mobile devices
  cardContainer.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
    stopAutoScroll();
  });

  cardContainer.addEventListener("touchend", (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) < 5) {
      // If it's a tap (not a swipe), restart auto-scrolling
      startAutoScroll();
    } else {
      // If it's a swipe, wait a bit before restarting
      setTimeout(startAutoScroll, 3000);
    }
  });

  // Mouse event handlers for desktop devices
  cardContainer.addEventListener("mouseenter", stopAutoScroll);
  cardContainer.addEventListener("mouseleave", startAutoScroll);

  // Start auto-scrolling
  startAutoScroll();

  // Ensure scrolling continues when the tab becomes visible again
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopAutoScroll();
    } else {
      startAutoScroll();
    }
  });
}

// Newsletter Subscription
function subscribe() {
  const email = document.getElementById("email").value;
  const message = document.getElementById("confirmation-message");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (emailPattern.test(email)) {
    message.textContent = "Thank you for subscribing!";
    message.style.color = "green";
  } else {
    message.textContent = "Please enter a valid email address.";
    message.style.color = "red";
  }
  message.style.display = "block"; // Show message after checking
}

// Back to Top Button
window.onscroll = function () {
  const backToTop = document.querySelector(".back-to-top");
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    backToTop.style.display = "block";
  } else {
    backToTop.style.display = "none";
  }
};

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Show flash messages
function showFlashMessage(message) {
  const flashMessage = document.getElementById("flash-message");
  if (!flashMessage) return;

  flashMessage.textContent = message;
  flashMessage.style.display = "block";
  setTimeout(() => {
    flashMessage.style.display = "none";
  }, 3000);
}

// Initialize contact form submission
function initializeContactForm() {
  const contactForm = document.getElementById("contact-form");
  if (!contactForm) return;

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    showFlashMessage("Your form has been submitted successfully.");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const playBtn = document.getElementById("playBtn");
  const factPopup = document.getElementById("factPopup");
  let canExplore = false;

  // Animate the play button text
  const playBtnText = playBtn.textContent;
  playBtn.textContent = "";
  let charIndex = 0;

  function typeText() {
    if (charIndex < playBtnText.length) {
      playBtn.textContent += playBtnText.charAt(charIndex);
      charIndex++;
      setTimeout(typeText, 100);
    } else {
      canExplore = true;
      playBtn.classList.add("ready");
    }
  }

  typeText();

  // Handle play button click
  playBtn.addEventListener("click", () => {
    if (canExplore) {
      window.location.href = "/GameUi";
    } else {
      alert(
        "Please wait for the message to complete before starting your adventure!"
      );
    }
  });

  // Create and handle hotspots
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

  hotspots.forEach((spot, index) => {
    const hotspot = document.createElement("div");
    hotspot.classList.add("hotspot");
    hotspot.style.top = spot.top;
    hotspot.style.left = spot.left;
    hotspot.dataset.fact = spot.fact;
    hotspot.addEventListener("click", showFact);
    document.getElementById("home").appendChild(hotspot);
  });

  function showFact(event) {
    const fact = event.target.dataset.fact;
    factPopup.textContent = fact;
    factPopup.style.top = event.clientY + "px";
    factPopup.style.left = event.clientX + "px";
    factPopup.classList.remove("hidden");
    setTimeout(() => {
      factPopup.classList.add("hidden");
    }, 3000);
  }
});
// Enhanced scrolling effects and interactions
function initializeScrollEffects() {
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
    cloud1.style.top = value * 0.5 + "px";
    cloud2.style.top = value * -1 + "px";
    cloud2.style.top = value * 0.5 + "px";
    cloud3.style.top = value * 1.5 + "px";
    cloud3.style.top = value * 0.2 + "px";
    play.style.bottom = value * 0.5 + "px";
    rock1.style.top = value * -0.12 + "px";
    rock2.style.top = value * -0.06 + "px";
    rock3.style.top = value * -0.09 + "px";
    coral1.style.top = value * -0.08 + "px";
    coral2.style.top = value * -0.1 + "px";
    header.style.top = value * 0.5 + "px";
  });

  let lastMove = 0;
  document.addEventListener("mousemove", function (e) {
    const now = Date.now();
    if (now - lastMove > 50) {
      // Throttle by 50ms
      let moveX = (e.clientX - window.innerWidth / 2) * 0.025;
      let moveY = (e.clientY - window.innerHeight / 2) * 0.025;
      moon.style.transform = `translate(${moveX}px, ${moveY}px)`;
      cloud1.style.transform = `translate(${moveX * 0.5}px, ${moveY * 0.5}px)`;
      cloud2.style.transform = `translate(${moveX * 0.3}px, ${moveY * 0.3}px)`;
      cloud3.style.transform = `translate(${moveX * 0.7}px, ${moveY * 0.7}px)`;
      lastMove = now;
    }
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

  function moveCoral(coral, speed) {
    let time = Date.now() * 0.001;
    let offsetX = Math.sin(time * speed) * 10;
    let offsetY = Math.cos(time * speed) * 5;
    coral1.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    requestAnimationFrame(() => moveCoral(coral, speed));
  }

  moveCoral(coral2, 0.7);
  moveCoral(coral1, 0.7);

  moveCloud(cloud1, 0.5);
  moveCloud(cloud2, 0.3);
  moveCloud(cloud3, 0.7);
}

// Leaderboard functionality
const leaderboardData = [
  { name: "DeepDiver42", score: 1250 },
  { name: "CoralQueen", score: 1100 },
  { name: "WaveRider99", score: 950 },
  { name: "ReefExplorer", score: 875 },
  { name: "OceanMystic", score: 820 },
];

function renderLeaderboard() {
  const leaderboardList = document.getElementById("leaderboardList");
  if (!leaderboardList) return;

  leaderboardList.innerHTML = "";
  leaderboardData.forEach((player, index) => {
    const listItem = document.createElement("li");
    listItem.className = "leaderboard-item";
    listItem.innerHTML = `
      <span class="rank">#${index + 1}</span>
      <div class="player-info">
        <div class="player-name">${player.name}</div>
        <div class="player-score">${player.score} points</div>
      </div>
    `;
    leaderboardList.appendChild(listItem);
  });
}

function createBubbles() {
  const videoSection = document.querySelector(".video-section");
  if (!videoSection) return;

  for (let i = 0; i < 20; i++) {
    const bubble = document.createElement("div");
    bubble.className = `ocean-bubble bubble-${i + 1}`;
    bubble.style.left = `${Math.random() * 100}%`;
    bubble.style.top = `${Math.random() * 100}%`;
    const size = Math.random() * 30 + 10;
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.animationDuration = `${Math.random() * 3 + 2}s`;
    bubble.style.animationDelay = `${Math.random() * 2}s`;
    videoSection.appendChild(bubble);
  }
}

function initializeLeaderboard() {
  renderLeaderboard();
  createBubbles();

  // Simulate weekly updates
  setInterval(() => {
    leaderboardData.forEach((player) => {
      player.score += Math.floor(Math.random() * 50);
    });
    leaderboardData.sort((a, b) => b.score - a.score);
    renderLeaderboard();
  }, 5000); // Update every 5 seconds for demonstration
}

// Load all sections and initialize functionalities
document.addEventListener("DOMContentLoaded", () => {
  // loadSection("Hero-section", "/new Hero/newhero.html");
  loadSection("Vedio-section", "/Vedio Player/Vedio.html");
  loadSection("Card-Section", "/Card/Card.html", initializeCardScrolling);
  loadSection(
    "hall-of-fame-section",
    "/Hall Of Fame/hallOfFame.html",
    initializeLeaderboard
  );
  loadSection("FAQs-section", "/FAQs/FAQs.html", initializeFAQs);
  loadSection("Footer-section", "/Footer/footer.html", () => {
    initializeContactForm();
    subscribe(); // Initialize newsletter subscription
    scrollToTop(); // Initialize scroll to top button
  });

  initializeScrollSound();
  initializeScrollEffects(); // Initialize enhanced scrolling effects
});
let currentMission = "Explore the Coral Reef";
let exploredCount = 0;
let identifiedCount = 0;
let protectedCount = 0;

function changeVideo(videoSrc, missionTitle) {
  document.getElementById("main-video").src = videoSrc;
  document.getElementById(
    "mission-title"
  ).innerText = `Current Mission: ${missionTitle}`;
  document.getElementById("game-status").innerText =
    "New mission loaded! Choose an action to begin.";
  currentMission = missionTitle;
  resetMissionProgress();
}

function resetMissionProgress() {
  exploredCount = 0;
  identifiedCount = 0;
  protectedCount = 0;
}

function playGame(action) {
  let status = document.getElementById("game-status");
  switch (action) {
    case "explore":
      exploredCount++;
      status.innerText = `Exploring the ${currentMission}... You've discovered ${exploredCount} new areas!`;
      break;
    case "identify":
      identifiedCount++;
      status.innerText = `Identifying species in the ${currentMission}... You've cataloged ${identifiedCount} different species!`;
      break;
    case "protect":
      protectedCount++;
      status.innerText = `Protecting the ${currentMission}... You've implemented ${protectedCount} conservation measures!`;
      break;
  }

  if (exploredCount >= 3 && identifiedCount >= 3 && protectedCount >= 3) {
    showQuiz();
  }
}

function showQuiz() {
  const quizContainer = document.getElementById("quiz-container");
  const quizQuestion = document.getElementById("quiz-question");
  const quizOptions = document.getElementById("quiz-options");
  const quizResult = document.getElementById("quiz-result");

  quizContainer.style.display = "block";
  quizResult.innerText = "";

  // Sample quiz question (you can expand this with more questions related to each mission)
  const question = "What is the primary threat to coral reefs?";
  const options = [
    "Climate change",
    "Overfishing",
    "Plastic pollution",
    "Underwater noise",
  ];
  const correctAnswer = "Climate change";

  quizQuestion.innerText = question;
  quizOptions.innerHTML = "";
  options.forEach((option) => {
    const button = document.createElement("button");
    button.innerText = option;
    button.onclick = () => checkAnswer(option, correctAnswer);
    quizOptions.appendChild(button);
  });
}

function checkAnswer(selectedAnswer, correctAnswer) {
  const quizResult = document.getElementById("quiz-result");
  if (selectedAnswer === correctAnswer) {
    quizResult.innerText = "Correct! You've completed the mission!";
    setTimeout(() => {
      document.getElementById("quiz-container").style.display = "none";
      showMissionComplete();
    }, 2000);
  } else {
    quizResult.innerText = "Incorrect. Try again!";
  }
}

function showMissionComplete() {
  const missionCompleteDiv = document.getElementById("mission-complete");
  missionCompleteDiv.classList.remove("hidden");
}

function closeMissionComplete() {
  const missionCompleteDiv = document.getElementById("mission-complete");
  missionCompleteDiv.classList.add("hidden");
  resetMissionProgress();
  document.getElementById("game-status").innerText =
    "Ready for the next mission!";
}
