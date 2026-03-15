// Minimal map script: start app toggling and call leaflet.
function startApp() {
  try { localStorage.setItem('lotowl_session', '1'); } catch (e) { /* ignore */ }
  const landing = document.getElementById('landing');
  const mainScreen = document.getElementById('main-screen');
  if (landing) landing.classList.add('hidden');
  if (mainScreen) mainScreen.classList.remove('hidden');
  setTimeout(function () {
    if (typeof initLeafletMap === 'function') initLeafletMap();
  }, 50);
}

window.addEventListener('DOMContentLoaded', function () {
  document.getElementById('advance-btn')?.addEventListener('click', startApp);
  // If a previous session exists, auto-open the main parking page
  try {
    if (localStorage.getItem('lotowl_session')) {
      startApp();
    }
  } catch (e) { /* ignore localStorage errors */ }
});
