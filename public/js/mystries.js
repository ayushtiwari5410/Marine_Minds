const map = L.map("map", {
  center: [20, 0],
  zoom: 3,
  minZoom: 2,
  maxBounds: [
    [-90, -180],
    [90, 180],
  ],
  maxBoundsViscosity: 1.0,
  zoomControl: false,
});

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
  noWrap: true,
  bounds: [
    [-90, -180],
    [90, 180],
  ],
}).addTo(map);

// Add custom marine style to the map
map.on("load", function () {
  map.getContainer().style.background = "#b3d9ff";
});

L.control
  .zoom({
    position: "bottomright",
  })
  .addTo(map);

function adjustMapView() {
  const viewportWidth = document.documentElement.clientWidth;
  const viewportHeight = document.documentElement.clientHeight;
  let zoom;
  if (viewportWidth < 600) {
    zoom = 2;
  } else if (viewportWidth < 1024) {
    zoom = 3;
  } else {
    zoom = 4;
  }
  const center = [20, 0];
  map.setView(center, zoom);
}

adjustMapView();
window.addEventListener("resize", adjustMapView);

const locations = [
  {
    name: "Titanic Sinking Spot",
    lat: 41.7325,
    lng: -49.9469,
    summary: "Location where the RMS Titanic sank in 1912.",
    description:
      "On April 15, 1912, the RMS Titanic sank in the North Atlantic Ocean after hitting an iceberg during her maiden voyage. The tragedy resulted in the deaths of more than 1,500 passengers and crew.",
    isAvailable: true,
  },
  {
    name: "Bermuda Triangle",
    lat: 25.0,
    lng: -71.0,
    summary: "Area where numerous ships and aircraft have disappeared.",
    description:
      "The Bermuda Triangle is a region in the western part of the North Atlantic Ocean where numerous ships and aircraft are said to have disappeared under mysterious circumstances. The area has been the subject of many theories and conspiracies.",
    isAvailable: true,
  },
  {
    name: "Mary Celeste",
    lat: 38.4,
    lng: -35.5,
    summary: "Location where the Mary Celeste was found abandoned.",
    description:
      "The Mary Celeste was an American merchant brigantine discovered adrift and deserted in the Atlantic Ocean off the Azores Islands on December 5, 1872. The fate of the crew remains unknown and has been the subject of much speculation.",
    isAvailable: false,
  },
  {
    name: "Lost City of Atlantis",
    lat: 36.1333,
    lng: -7.6167,
    summary: "Hypothetical location of the legendary lost city.",
    description:
      "Atlantis is a fictional island mentioned in Plato's works Timaeus and Critias. Many have searched for the real location of this legendary advanced civilization, with theories ranging from the Mediterranean to the Atlantic Ocean.",
    isAvailable: false,
  },
  {
    name: "Baltic Sea Anomaly",
    lat: 55.0745,
    lng: 19.7795,
    summary: "Unusual sonar image discovered in the Baltic Sea.",
    description:
      "The Baltic Sea Anomaly is a sonar image resembling a UFO, discovered in 2011 by the Swedish diving team Ocean X. While some claim it's a crashed UFO, others argue it's a natural geological formation.",
    isAvailable: false,
  },
  {
    name: "Lost Flight of MH370",
    lat: -39.2833,
    lng: 88.2167,
    summary: "Last known location of Malaysia Airlines Flight 370.",
    description:
      "Malaysia Airlines Flight 370 was a scheduled international passenger flight that disappeared on March 8, 2014, while flying from Kuala Lumpur to Beijing. Despite extensive searches, the aircraft's fate remains unknown.",
    isAvailable: false,
  },
  {
    name: "Dwarka Nagri",
    lat: 22.2442,
    lng: 68.9685,
    summary: "Ancient submerged city off the coast of Gujarat, India.",
    description:
      "Dwarka Nagri, also known as the Lost City of Dwarka, is an ancient submerged city located off the coast of Dwarka in Gujarat, India. According to Hindu tradition, it was the legendary city of Lord Krishna. Marine archaeological explorations have revealed structures and artifacts dating back thousands of years, sparking debates about its true age and historical significance.",
    isAvailable: true,
  },
  {
    name: "Point Nemo",
    lat: -48.8767,
    lng: -123.3933,
    summary:
      "The most remote point in the world's oceans, also known as the oceanic pole of inaccessibility.",
    description:
      "Point Nemo, named after Captain Nemo from Jules Verne's '20,000 Leagues Under the Sea', is the point in the ocean farthest from any land. Located in the South Pacific Ocean, it's approximately 2,688 kilometers (1,670 miles) from the nearest land - Ducie Island to the north, Motu Nui to the northeast, and Maher Island to the south. Due to its extreme isolation, it's often used as a spacecraft cemetery where space agencies dispose of decommissioned satellites and other space debris.",
    isAvailable: true,
  },
];

let boat = L.marker([15, 90], {
  icon: L.icon({
    iconUrl: "boat2.png", // Replace with a more appropriate boat icon URL
    iconSize: [50, 50],
    iconAnchor: [25, 25],
  }),
}).addTo(map);

// Add this after creating the map
const waterOverlay = L.rectangle(
  [
    [-90, -180],
    [90, 180],
  ],
  {
    color: "#4ecdc4",
    fillColor: "#4ecdc4",
    fillOpacity: 0.2,
    weight: 0,
  }
).addTo(map);

function getOceanPath(start, end) {
  const path = [start];
  if ((start.lng < 20 && end.lng > 70) || (start.lng > 70 && end.lng < 20)) {
    if (start.lat > 0 || end.lat > 0) {
      path.push({ lat: 12, lng: 43 });
      path.push({ lat: 30, lng: 32 });
    } else {
      path.push({ lat: -35, lng: 20 });
    }
  } else if (
    (start.lng < -40 && end.lng > -70) ||
    (start.lng > -70 && end.lng < -40)
  ) {
    path.push({ lat: -56, lng: -67 });
  }
  path.push(end);
  return path;
}

function distance(p1, p2) {
  const dx = p1.lng - p2.lng;
  const dy = p1.lat - p2.lat;
  return Math.sqrt(dx * dx + dy * dy);
}

function setupLocationInfo(location) {
  const goButton = document.getElementById("go-button");
  const developmentNotice = document.getElementById("development-notice");

  if (location.isAvailable) {
    goButton.classList.remove("hidden");
    developmentNotice.classList.add("hidden");
    goButton.onclick = () => {
      console.log(`Going into ${location.name}`);
      if (location.name === "Bermuda Triangle") {
        window.location.href = "/Mystries/titanic";
      } else if (location.name === "Titanic Sinking Spot") {
        window.location.href = "/Mystries/titanic";
      } else {
        const locationJSON = encodeURIComponent(JSON.stringify(location));
        window.location.href = "/Mystries/titanic?location=" + locationJSON;
      }
    };
  } else {
    goButton.classList.add("hidden");
    developmentNotice.classList.remove("hidden");
  }
}
document.getElementById("returnToHome").addEventListener("click", returnToHome);
document.getElementById("play-game").addEventListener("click", returnToGame);

function returnToHome() {
  const currentLocation = { name: "Titanic Sinking Spot" };
  window.location.href = `/?returnedFrom=${encodeURIComponent(
    currentLocation.name
  )}`;
}
function returnToGame() {
  const currentLocation = { name: "Titanic Sinking Spot" };
  window.location.href = `/GameUI?returnedFrom=${encodeURIComponent(
    currentLocation.name
  )}`;
}

function moveBoat(targetLat, targetLng, location, callback) {
  const start = boat.getLatLng();
  const end = L.latLng(targetLat, targetLng);
  const path = getOceanPath(start, end);

  let currentLeg = 0;
  const speed = 10; // Increased speed for smoother animation

  function animate() {
    if (currentLeg < path.length - 1) {
      const start = path[currentLeg];
      const end = path[currentLeg + 1];
      const d = distance(start, end);
      const steps = Math.ceil(d * 10); // Increased steps for smoother animation

      let step = 0;
      function animateLeg() {
        if (step < steps) {
          const i = step / steps;
          const lat = start.lat + (end.lat - start.lat) * i;
          const lng = start.lng + (end.lng - start.lng) * i;
          boat.setLatLng([lat, lng]);
          map.panTo([lat, lng], { animate: true, duration: 0.1 }); // Smooth map panning
          step++;
          requestAnimationFrame(animateLeg);
        } else {
          currentLeg++;
          animate();
        }
      }
      animateLeg();
    } else {
      setupLocationInfo(location);
      if (callback) callback();
    }
  }
  animate();
}

locations.forEach((location) => {
  const marker = L.marker([location.lat, location.lng], {
    icon: L.icon({
      iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png", // Replace with a more appropriate marker icon URL
      iconSize: [30, 30],
      iconAnchor: [15, 30],
    }),
  }).addTo(map);

  marker.bindTooltip(location.summary);

  marker.on("click", () => {
    document.getElementById("info-title").textContent = location.name;
    document.getElementById("info-description").textContent =
      location.description;
    document.getElementById("go-button").classList.add("hidden");
    document.getElementById("development-notice").classList.add("hidden");
    document.getElementById("info-panel").classList.remove("hidden");

    moveBoat(location.lat, location.lng, location, () => {
      // The setupLocationInfo function is now called inside moveBoat
    });
  });
});

document.getElementById("close-info").addEventListener("click", () => {
  document.getElementById("info-panel").classList.add("hidden");
});

function handleReturnFromDive() {
  const urlParams = new URLSearchParams(window.location.search);
  const returnedFromLocation = urlParams.get("returnedFrom");
  if (returnedFromLocation) {
    const location = locations.find((loc) => loc.name === returnedFromLocation);
    if (location) {
      document.getElementById("info-title").textContent = location.name;
      document.getElementById("info-description").textContent =
        location.description;
      document.getElementById("info-panel").classList.remove("hidden");
      boat.setLatLng([location.lat, location.lng]);
      setupLocationInfo(location);
    }
  }
}

window.addEventListener("load", handleReturnFromDive);

console.log("Map and markers should be loaded now.");
