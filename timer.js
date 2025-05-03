// timer.js
// Modular timer for Csound sections with adjustable timer UI
export function initTimer(stopCallback) {
    let timerIntervalId = null;
    let timerRemaining = 0;
  
    function onTimerToggle() {
      if (timerIntervalId) {
        clearTimer();
      } else {
        const hours = parseInt(document.getElementById("hoursInput").value) || 0;
        const mins = parseInt(document.getElementById("minutesInput").value) || 0;
        const totalSeconds = (hours * 60 + mins) * 60;
        if (totalSeconds <= 0) return;
        startTimer(totalSeconds);
      }
    }
  
    function startTimer(seconds) {
      timerRemaining = seconds;
      swapToCountdownUI();
      timerIntervalId = setInterval(() => {
        timerRemaining--;
        if (timerRemaining <= 0) {
          clearTimer();
          stopCallback();
        } else {
          updateCountdownUI();
        }
      }, 1000);
    }
  
    function clearTimer() {
      if (timerIntervalId) {
        clearInterval(timerIntervalId);
        timerIntervalId = null;
      }
      resetTimerUI();
    }
  
    function swapToCountdownUI() {
      const container = document.getElementById("timerContainer");
      container.innerHTML = `
        <span id="timerDisplay" class="me-2 fs-6"></span>
        <button id="timerToggle" class="btn btn-outline-secondary btn-sm p-1" style="font-size:0.75rem; line-height:1;">✖</button>
      `;
      document.getElementById("timerToggle").addEventListener("click", clearTimer);
      updateCountdownUI();
    }
  
    function updateCountdownUI() {
      const dsp = document.getElementById("timerDisplay");
      const h = Math.floor(timerRemaining / 3600);
      const m = Math.floor((timerRemaining % 3600) / 60);
      const s = timerRemaining % 60;
      dsp.textContent = h > 0
        ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
        : `${m}:${String(s).padStart(2, '0')}`;
    }
  
    function resetTimerUI() {
      const container = document.getElementById("timerContainer");
      container.innerHTML = `
        <input id="hoursInput" type="number" min="0" step="1" value="0"
               class="form-control form-control-sm text-center me-1" style="min-width: 3rem;max-width: 3rem; height: 1.5rem;" />
        <span class="fs-6 text-muted me-1">h</span>
        <input id="minutesInput" type="number" min="0" step="1" value="15"
               class="form-control form-control-sm text-center me-1" style="min-width: 3rem;max-width: 3rem; height: 1.5rem;" />
        <span class="fs-6 text-muted me-2">m</span>
        <button id="timerToggle" class="btn btn-outline-secondary btn-sm p-1" style="font-size:0.75rem; line-height:1;">start</button>
      `;
      document.getElementById("timerToggle").addEventListener("click", onTimerToggle);
    }
  
    // Initialize UI immediately
    resetTimerUI();
  }