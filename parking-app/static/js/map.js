const mapContainer = document.getElementById("map");

const statusColors = {
  available: "#22c55e",
  limited: "#f59e0b",
  full: "#ef4444"
};

function createPinElement(lot) {
  const pin = document.createElement("button");
  pin.className = "lot-pin";
  pin.style.position = "absolute";
  pin.style.border = "0";
  pin.style.background = statusColors[lot.status] || "#111";
  pin.style.borderRadius = "50%";
  pin.style.width = "14px";
  pin.style.height = "14px";
  pin.style.cursor = "pointer";
  pin.style.boxShadow = "0 2px 8px rgba(0,0,0,0.25)";
  pin.title = lot.name;

  // Random position for placeholder
  const x = 12 + (lot.id * 50) % 280;
  const y = 80 + (lot.id * 35) % 260;
  pin.style.left = `${x}px`;
  pin.style.top = `${y}px`;

  pin.addEventListener("click", () => {
    window.openModal(lot);
  });

  return pin;
}

const advanceButton = document.getElementById("advance-btn");
const landingScreen = document.getElementById("landing");
const mainScreen = document.getElementById("main-screen");
const legend = document.getElementById("legend");

async function init() {
  try {
    const response = await fetch("/api/lots");
    if (!response.ok) throw new Error("Could not load lot data");
    const lots = await response.json();

    lots.forEach((lot) => {
      const pin = createPinElement(lot);
      mapContainer.append(pin);
    });
  } catch (error) {
    console.error(error);
    const errorEl = document.createElement("div");
    errorEl.textContent = "Unable to load lots right now.";
    errorEl.style.position = "absolute";
    errorEl.style.left = "50%";
    errorEl.style.top = "20px";
    errorEl.style.transform = "translateX(-50%)";
    errorEl.style.background = "#fff";
    errorEl.style.padding = "8px 12px";
    errorEl.style.borderRadius = "8px";
    mapContainer.append(errorEl);
  }
}

function startApp() {
  landingScreen.classList.add("hidden");
  mainScreen.classList.remove("hidden");
  legend.classList.remove("hidden");
  init();
}

advanceButton?.addEventListener("click", startApp);
