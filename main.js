class GameState {
  constructor() {
    this.p1Life = 20;
    this.p2Life = 20;
    this.startLife = 20;
    this.history = [];
    this.p1Color = this.randomColor();
    this.p2Color = this.randomColor(this.p1Color);
    this.p1Change = 0;
    this.p2Change = 0;
    this.changeTimeoutP1 = null;
    this.changeTimeoutP2 = null;
  }

  randomColor(excludeHue = null) {
    let hue;
    do {
      hue = Math.floor(Math.random() * 360);
    } while (excludeHue !== null && Math.abs(hue - excludeHue) < 40);
    return `hsl(${hue}, 70%, 50%)`;
  }

  updateLife(player, amount) {
    if (player === 1) {
      this.p1Life += amount;
      this.p1Change += amount;
      this.showChange(1);
    } else {
      this.p2Life += amount;
      this.p2Change += amount;
      this.showChange(2);
    }
    this.history.push({
      player,
      amount,
      newLife: player === 1 ? this.p1Life : this.p2Life,
      timestamp: new Date().toLocaleTimeString(),
    });
    this.render();
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
    this.p1Life = this.startLife;
    this.p2Life = this.startLife;
    this.history = [];
    this.p1Change = 0;
    this.p2Change = 0;
    this.render();
  }

  setStartLife(val) {
    this.startLife = parseInt(val);
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

document.getElementById("reset-btn").addEventListener("click", () => {
  if (confirm("Reset game?")) state.reset();
});

// Modal Logic
const modals = {
  history: document.getElementById("history-modal"),
  settings: document.getElementById("settings-modal"),
};

document.getElementById("history-btn").addEventListener("click", () => {
  modals.history.classList.add("active");
});

document.getElementById("settings-btn").addEventListener("click", () => {
  modals.settings.classList.add("active");
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
    document
      .querySelectorAll(".start-life-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    state.setStartLife(btn.dataset.value);
  });
});

document.getElementById("custom-life").addEventListener("change", (e) => {
  state.setStartLife(e.target.value);
});

// Initial Render
state.render();
