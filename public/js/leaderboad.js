const leaderboardData = [
  { name: "DeepDiver42", score: 1250 },
  { name: "CoralQueen", score: 1100 },
  { name: "WaveRider99", score: 950 },
  { name: "ReefExplorer", score: 875 },
  { name: "OceanMystic", score: 820 },
];

function renderLeaderboard() {
  const leaderboardList = document.getElementById("leaderboardList");
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
