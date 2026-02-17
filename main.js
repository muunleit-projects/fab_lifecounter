class GameState {
  constructor() {
    this.p1StartLife = 20;
    this.p2StartLife = 20;
    this.p1Life = 20;
    this.p2Life = 20;
    this.history = [];
    this.p1Color = this.randomColor();
    this.p2Color = this.randomColor(this.p1Color);
    this.p1Change = 0;
    this.p2Change = 0;
    this.changeTimeoutP1 = null;
    this.changeTimeoutP2 = null;
    this.historyBufferP1 = 0;
    this.historyBufferP2 = 0;
    this.historyTimeoutP1 = null;
    this.historyTimeoutP2 = null;
  }

  randomColor(excludeHue = null) {
    let hue;
    const minGap = 160; // Larger gap for better distinction
    do {
      hue = Math.floor(Math.random() * 360);
    } while (
      excludeHue !== null &&
      Math.abs(hue - excludeHue) < minGap &&
      Math.abs(hue - excludeHue) > 360 - minGap
    );
    // Premium vibrant colors: Saturation 80-90%, Lightness 45-55%
    const s = 85;
    const l = 50;
    return `hsl(${hue}, ${s}%, ${l}%)`;
  }

  updateLife(player, amount) {
    if (player === 1) {
      this.p1Life += amount;
      this.p1Change += amount;
      this.historyBufferP1 += amount;
      this.showChange(1);
      this.scheduleHistory(1);
    } else {
      this.p2Life += amount;
      this.p2Change += amount;
      this.historyBufferP2 += amount;
      this.showChange(2);
      this.scheduleHistory(2);
    }
    this.render();
  }

  scheduleHistory(player) {
    const timeoutKey = `historyTimeoutP${player}`;
    const bufferKey = `historyBufferP${player}`;

    if (this[timeoutKey]) clearTimeout(this[timeoutKey]);

    this[timeoutKey] = setTimeout(() => {
      const amount = this[bufferKey];
      if (amount !== 0) {
        this.history.push({
          player,
          amount,
          newLife: player === 1 ? this.p1Life : this.p2Life,
          timestamp: new Date().toLocaleTimeString(),
        });
        this[bufferKey] = 0;
        this.render();
      }
    }, 2000);
  }

  showChange(player) {
    const indicator = document.getElementById(`p${player}-change`);
    const changeVal = player === 1 ? this.p1Change : this.p2Change;

    indicator.textContent = (changeVal > 0 ? "+" : "") + changeVal;
    indicator.classList.add("show");

    const timeoutKey = `changeTimeoutP${player}`;
    if (this[timeoutKey]) clearTimeout(this[timeoutKey]);

    this[timeoutKey] = setTimeout(() => {
      indicator.classList.remove("show");
      if (player === 1) this.p1Change = 0;
      else this.p2Change = 0;
    }, 3000);
  }

  reset() {
    this.p1Life = this.p1StartLife;
    this.p2Life = this.p2StartLife;
    this.history = [];
    this.p1Change = 0;
    this.p2Change = 0;
    this.render();
  }

  setStartLife(player, val) {
    if (player === 1) this.p1StartLife = parseInt(val);
    else this.p2StartLife = parseInt(val);
    this.reset();
  }

  render() {
    document.getElementById("p1-life").textContent = this.p1Life;
    document.getElementById("p2-life").textContent = this.p2Life;

    const root = document.documentElement;
    root.style.setProperty("--p1-color", this.p1Color);
    root.style.setProperty("--p2-color", this.p2Color);

    // Update History List
    const historyList = document.getElementById("history-list");
    historyList.innerHTML = this.history
      .slice()
      .reverse()
      .map(
        (entry) => `
            <div class="history-entry">
                <span class="history-p${entry.player}">Player ${entry.player}</span>
                <span>${entry.amount > 0 ? "+" : ""}${entry.amount}</span>
                <span>${entry.newLife} HP</span>
                <span style="opacity: 0.5">${entry.timestamp}</span>
            </div>
        `,
      )
      .join("");
  }
}

const state = new GameState();

// Event Listeners
document.querySelectorAll(".adjust-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const player = parseInt(btn.dataset.player);
    const amount = parseInt(btn.dataset.amount);
    state.updateLife(player, amount);

    const display = document.getElementById(`p${player}-life`);
    display.classList.remove("pop");
    void display.offsetWidth; // trigger reflow
    display.classList.add("pop");
  });
});

// Removed browser confirm, now uses custom modal listener below

// Modal Logic
const modals = {
  history: document.getElementById("history-modal"),
  settings: document.getElementById("settings-modal"),
  reset: document.getElementById("reset-modal"),
};

document.getElementById("history-btn").addEventListener("click", () => {
  modals.history.classList.add("active");
});

document.getElementById("settings-btn").addEventListener("click", () => {
  modals.settings.classList.add("active");
});

document.getElementById("reset-btn").addEventListener("click", () => {
  modals.reset.classList.add("active");
});

document.getElementById("confirm-reset").addEventListener("click", () => {
  state.reset();
  modals.reset.classList.remove("active");
});

document.getElementById("cancel-reset").addEventListener("click", () => {
  modals.reset.classList.remove("active");
});

document.querySelectorAll(".close-modal").forEach((btn) => {
  btn.addEventListener("click", () => {
    Object.values(modals).forEach((m) => m.classList.remove("active"));
  });
});

window.addEventListener("click", (e) => {
  Object.values(modals).forEach((m) => {
    if (e.target === m) m.classList.remove("active");
  });
});

// Settings Logic
document.querySelectorAll(".start-life-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const player = parseInt(btn.dataset.player);
    document
      .querySelectorAll(`.start-life-btn[data-player="${player}"]`)
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    state.setStartLife(player, btn.dataset.value);
  });
});

document.querySelectorAll(".custom-life").forEach((input) => {
  input.addEventListener("change", (e) => {
    const player = parseInt(input.dataset.player);
    state.setStartLife(player, e.target.value);
  });
});

// Wake Lock API - Prevent screen sleep
let wakeLock = null;

const requestWakeLock = async () => {
  if ("wakeLock" in navigator) {
    try {
      wakeLock = await navigator.wakeLock.request("screen");
      console.log("Wake Lock is active");

      wakeLock.addEventListener("release", () => {
        console.log("Wake Lock has been released");
        wakeLock = null;
      });
    } catch (err) {
      console.error(`${err.name}, ${err.message}`);
    }
  }
};

// Re-request wake lock when page becomes visible again
document.addEventListener("visibilitychange", async () => {
  if (wakeLock === null && document.visibilityState === "visible") {
    await requestWakeLock();
  }
});

// User gesture to ensure wake lock is granted (some browsers require this)
document.addEventListener("click", requestWakeLock, { once: true });
document.addEventListener("touchstart", requestWakeLock, { once: true });

// Initial request attempt
requestWakeLock();

// Initial Render
state.render();

// Service Worker Registration
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    const swPath = `${import.meta.env.BASE_URL}sw.js`;
    navigator.serviceWorker.register(swPath).catch((err) => {
      console.error("Service Worker registration failed:", err);
    });
  });
}
