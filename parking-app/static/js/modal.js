const modal = document.getElementById("modal");
const backdrop = document.getElementById("modal-backdrop");
const closeModalBtn = document.getElementById("close-modal");
const lotName = document.getElementById("lot-name");
const lotAddress = document.getElementById("lot-address");
const lotStatus = document.getElementById("lot-status");
const lotAvailable = document.getElementById("lot-available");
const lotTotal = document.getElementById("lot-total");
const lotType = document.getElementById("lot-type");
const directionsBtn = document.getElementById("directions-btn");

let currentLot = null;

function setStatusBadge(status) {
  lotStatus.className = "status-badge";
  if (status === "available") {
    lotStatus.classList.add("status-available");
    lotStatus.textContent = "Available";
  } else if (status === "limited") {
    lotStatus.classList.add("status-limited");
    lotStatus.textContent = "Limited";
  } else {
    lotStatus.classList.add("status-full");
    lotStatus.textContent = "Full";
  }
}

function openModal(lot) {
  currentLot = lot;
  lotName.textContent = lot.name;
  lotAddress.textContent = lot.address;
  setStatusBadge(lot.status);
  lotAvailable.textContent = lot.availableSpots;
  lotTotal.textContent = lot.totalSpots;
  lotType.textContent = lot.type;
  modal.classList.remove("hidden");
  backdrop.classList.remove("hidden");
  requestAnimationFrame(() => {
    modal.classList.add("show");
    backdrop.classList.add("show");
  });
}

function closeModal() {
  modal.classList.remove("show");
  backdrop.classList.remove("show");
  setTimeout(() => {
    if (!modal.classList.contains("show")) {
      modal.classList.add("hidden");
      backdrop.classList.add("hidden");
    }
  }, 250);
}

closeModalBtn?.addEventListener("click", closeModal);
backdrop?.addEventListener("click", closeModal);

directionsBtn?.addEventListener("click", () => {
  if (!currentLot) return;
  const url = `https://www.google.com/maps/dir/?api=1&destination=${currentLot.lat},${currentLot.lng}`;
  window.open(url, "_blank");
});

window.openModal = openModal;
window.closeModal = closeModal;
