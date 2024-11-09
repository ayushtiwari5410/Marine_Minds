// Flash message function (unchanged)
function showFlashMessage(gameName) {
  const flashMessage = document.getElementById("flash-message");
  if (flashMessage) {
    flashMessage.textContent = `You have selected the ${gameName} game.`;
    flashMessage.style.display = "block";
    setTimeout(function () {
      flashMessage.style.display = "none";
    }, 3000);
  } else {
    console.warn("Flash message element not found");
  }
}

// Updated section loading function
function loadSection(sectionId, filePath, callback) {
  // Skip loading for specific sections (e.g., footer)
  const skipSections = ["footer", "footer-section"];
  if (skipSections.includes(sectionId.toLowerCase())) {
    console.log(`Skipping load for ${sectionId} as it's handled by EJS`);
    if (callback && typeof callback === "function") {
      callback();
    }
    return;
  }

  const sectionElement = document.getElementById(sectionId);

  if (!sectionElement) {
    console.warn(`Element with id "${sectionId}" not found. Skipping load.`);
    if (callback && typeof callback === "function") {
      callback();
    }
    return;
  }

  fetch(filePath)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to load ${filePath}: ${response.statusText}`);
      }
      return response.text();
    })
    .then((html) => {
      sectionElement.innerHTML = html;
      if (callback && typeof callback === "function") {
        callback();
      }
    })
    .catch((error) => {
      console.error("Error loading section:", error);
      sectionElement.innerHTML = `<p>Error loading content. Please try again later.</p>`;
      if (callback && typeof callback === "function") {
        callback();
      }
    });
}

// Usage example
document.addEventListener("DOMContentLoaded", () => {
  // Load sections
  const sectionsToLoad = [
    { id: "game-section", path: "game-content.html" },
    { id: "about-section", path: "about-content.html" },
    // Add more sections as needed, but don't include the footer
  ];

  sectionsToLoad.forEach((section) => {
    loadSection(section.id, section.path, () => {
      console.log(`${section.id} loaded`);
    });
  });

  // Set up game selection
  const gameButtons = document.querySelectorAll(".game-button");
  gameButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const gameName = button.dataset.game;
      showFlashMessage(gameName);
    });
  });
});
