import { initGame } from "../Data/data.js";
import { ROOT_DIV } from "./constants.js";
import { initGameRender, globalPiece } from "../Render/main.js";
import { globalState, keySquareMapper } from "../index.js";
import { resetGameRuntimeState } from "../Events/global.js";

const times = {
  Bullet: { time: 60 },
  Blitz: { time: 60 * 3 },
  Rapid: { time: 60 * 10 },
  Classic: {time: 60 * 30},
};

const minutesToMode = {
  1: "Bullet",
  3: "Blitz",
  10: "Rapid",
  30: "Classic",
};

class ChessClock {
  constructor(mode = 'Blitz') {
    const control = times[mode] || times.Blitz;
    this.times = { w: control.time, b: control.time };
    this.increment = 0;
    this.active = null;
    this.interval = null;
    this.onTimeout = null;
  }

  start(color) {
    if (!['w', 'b'].includes(color)) color = 'w';
    this.active = color;
    this.stop();

    this.interval = setInterval(() => {
      this.times[this.active]--;

      if (this.times[this.active] <= 0) {
        this.times[this.active] = 0;
        this.stop();
        if (this.onTimeout) this.onTimeout(this.active);
        this.updateDisplay();
        return;
      }

      this.updateDisplay();
    }, 1000);

    this.updateDisplay();
  }

  switch() {
    this.times[this.active] += this.increment;
    this.stop();
    this.start(this.active === 'w' ? 'b' : 'w');
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  reset(mode) {
    this.stop();
    const control = times[mode] || times.Blitz;
    this.increment = 0;
    this.times = { w: control.time, b: control.time };
    this.active = null;
    this.updateDisplay();
  }

  format(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  updateDisplay() {
    const whiteClock = document.getElementById('clock1');
    const blackClock = document.getElementById('clock2');
    const whiteTime = whiteClock?.querySelector('.clock-time');
    const blackTime = blackClock?.querySelector('.clock-time');

    if (whiteTime) {
      whiteTime.textContent = this.format(this.times.w);
    }
    if (blackTime) {
      blackTime.textContent = this.format(this.times.b);
    }

    if (whiteClock) {
      whiteClock.style.color = this.times.w < 10 ? 'red' : '';
    }
    if (blackClock) {
      blackClock.style.color = this.times.b < 10 ? 'red' : '';
    }
  }
}

const clock = new ChessClock('Blitz');
function showGameOverPopup(message) {
  const overlay = document.getElementById('game-over');
  const msgEl = document.getElementById('game-over-message');
  if (overlay && msgEl) {
    msgEl.innerText = message;
    overlay.style.display = 'flex';
  }
  isGameRunning = false;
  setIdleState();
  refreshClockUI();
}

clock.onTimeout = (loser) => {
  const winner = loser === 'w' ? 'Black' : 'White';
  showGameOverPopup(`${winner} wins on time!`);
};

const modeSelect = document.getElementById('gameMode');
const startButton = document.getElementById('start-btn');
const offlineButton = document.getElementById('offline-btn');
const whiteClockEl = document.getElementById('clock1');
const blackClockEl = document.getElementById('clock2');
let isGameRunning = false;

export function isGameStarted() {
  return isGameRunning;
}

function resetBoardAndGame() {
  const boardRoot = document.getElementById("root") || ROOT_DIV;
  if (boardRoot) {
    boardRoot.innerHTML = "";
  }

  Object.keys(globalPiece).forEach((key) => delete globalPiece[key]);

  globalState.splice(0, globalState.length, ...initGame());

  Object.keys(keySquareMapper).forEach((key) => delete keySquareMapper[key]);
  globalState.flat().forEach((square) => {
    keySquareMapper[square.id] = square;
  });

  initGameRender(globalState);

  const moveHistoryEl = document.getElementById("move-history");
  if (moveHistoryEl) {
    moveHistoryEl.innerHTML = "";
  }

  resetGameRuntimeState();
  const selectedMode = modeSelect?.value || "Blitz";
  clock.reset(selectedMode);
  refreshClockUI();
}

function refreshClockUI() {
  if (!whiteClockEl || !blackClockEl) return;
  const active = clock.active;

  whiteClockEl.classList.toggle('active', active === 'w');
  whiteClockEl.classList.toggle('inactive', active !== 'w');
  blackClockEl.classList.toggle('active', active === 'b');
  blackClockEl.classList.toggle('inactive', active !== 'b');

  whiteClockEl.classList.remove('danger');
  blackClockEl.classList.remove('danger');

  if (!active) {
    whiteClockEl.classList.remove('active');
    blackClockEl.classList.remove('active');
    whiteClockEl.classList.add('inactive');
    blackClockEl.classList.add('inactive');
  }
}

function setIdleState() {
  if (modeSelect) {
    modeSelect.disabled = false;
    modeSelect.removeAttribute('disabled');
    modeSelect.classList.remove('disabled');
    modeSelect.style.pointerEvents = '';
  }
  if (startButton) {
    startButton.disabled = false;
    startButton.classList.remove('started');
    startButton.textContent = 'Play Online';
  }
  if (offlineButton) {
    offlineButton.disabled = false;
    offlineButton.classList.remove('disabled');
    offlineButton.style.pointerEvents = '';
  }
  isGameRunning = false;
}

function setRunningState() {
  if (modeSelect) {
    modeSelect.disabled = true;
    modeSelect.setAttribute('disabled', 'disabled');
    modeSelect.classList.add('disabled');
    modeSelect.style.pointerEvents = 'none';
  }
  if (startButton) {
    startButton.disabled = false;
    startButton.classList.add('started');
    startButton.textContent = 'Resign';
  }
  if (offlineButton) {
    offlineButton.disabled = true;
    offlineButton.classList.add('disabled');
    offlineButton.style.pointerEvents = 'none';
  }
  isGameRunning = true;
}

let onStartRequest = null;
export function setStartRequestHandler(fn) {
  onStartRequest = fn;
}

let onResignRequest = null;
export function setResignHandler(fn) {
  onResignRequest = fn;
}

function handleStartOrRestart() {
  if (isGameRunning) {
    if (onResignRequest) {
      onResignRequest();
    }
    resetBoardAndGame();
    setIdleState();
    setSearching(false);
    refreshClockUI();
    return;
  }

  // Online mode: hand off to the matchmaking layer and wait for match_made.
  if (onStartRequest) {
    const mode = modeSelect?.value || "Blitz";
    const handled = onStartRequest(mode);
    if (handled) {
      setSearching(true);
      return;
    }
  }

  startLocalGame();
}

function startLocalGame() {
  if (isGameRunning && onResignRequest) {
    // Tell the online layer we're leaving any in-progress match.
    onResignRequest();
  }

  setSearching(false);

  if (modeSelect) {
    modeSelect.disabled = true;
    modeSelect.setAttribute('disabled', 'disabled');
    modeSelect.classList.add('disabled');
    modeSelect.style.pointerEvents = 'none';
  }

  resetBoardAndGame();
  orientBoard('w');
  clock.start('w');
  setRunningState();
  refreshClockUI();
}

if (modeSelect) {
  modeSelect.addEventListener('change', (e) => {
    if (isGameRunning) {
      e.preventDefault();
      return;
    }

    clock.reset(e.target.value);
    refreshClockUI();
  });
}

if (startButton) {
  startButton.addEventListener('click', handleStartOrRestart);
}

if (offlineButton) {
  offlineButton.addEventListener('click', startLocalGame);
}

function orientBoard(color) {
  const boardRoot = document.getElementById("root") || ROOT_DIV;
  if (!boardRoot) return;
  boardRoot.classList.toggle("flipped", color === "b");
}

export function setSearching(isSearching) {
  const overlayEl = document.getElementById("main-element");
  const waitingEl = document.getElementById("waitingJoin");
  if (overlayEl) {
    overlayEl.classList.toggle("search-active", isSearching);
  }
  if (waitingEl) {
    waitingEl.classList.toggle("search-visible", isSearching);
  }
}

export function beginOnlineGame({ color, mode }) {
  setSearching(false);

  if (modeSelect && minutesToMode[mode]) {
    modeSelect.value = minutesToMode[mode];
  }

  resetBoardAndGame();
  orientBoard(color);
  clock.start('w');
  setRunningState();
  refreshClockUI();
}

export function switchClock() {
  clock.switch();
  refreshClockUI();
}

clock.updateDisplay();
setIdleState();