import { initGame } from "./Data/data.js";
import { GlobalEvent, applyRemoteMove, setMoveEmitter, setMyColor } from "./Events/global.js";
import { initGameRender } from "./Render/main.js";
import {
  beginOnlineGame,
  setStartRequestHandler,
  setResignHandler,
  setSearching,
} from "./Helper/addCloak.js";

const globalState = initGame();
let keySquareMapper = {};

globalState.flat().forEach((square) => {
  keySquareMapper[square.id] = square;
});

initGameRender(globalState);
GlobalEvent();

String.prototype.replaceAt = function (index, replacement) {
  return (
    this.substring(0, index) +
    replacement +
    this.substring(index + replacement.length)
  );
};

const MODE_TO_MINUTES = {
  Bullet: 1,
  Blitz: 3,
  Rapid: 10,
  Classic: 30,
};

const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log("Socket connected:", socket.id);
});

// Live count of connected players.
socket.on("total_players_count_change", function (totalPlayerCnt) {
  const playerCountEl = document.getElementById("total-players");
  if (playerCountEl) {
    playerCountEl.textContent = "Total Players: " + totalPlayerCnt;
  }
});

setStartRequestHandler((mode) => {
  if (!socket.connected) return false;
  const minutes = MODE_TO_MINUTES[mode] || 3;
  socket.emit("want_to_play", minutes);
  return true;
});

socket.on("match_made", ({ color, time }) => {
  setMyColor(color === "b" ? "black" : "white");
  beginOnlineGame({ color, mode: time });
});

setMoveEmitter((payload) => {
  socket.emit("move", payload);
});

setResignHandler(() => {
  if (socket.connected) {
    socket.emit("resign");
  }
});

// Apply a move made by the opponent.
socket.on("opponent_move", (payload) => {
  applyRemoteMove(payload);
});

// Opponent disconnected or resigned.
socket.on("opponent_left", ({ reason }) => {
  setSearching(false);
  const msg = reason === "resign" ? "Opponent resigned" : "Opponent left the game";
  const overlay = document.getElementById("game-over");
  const msgEl = document.getElementById("game-over-message");
  if (overlay && msgEl) {
    msgEl.innerText = msg + " \n You Win!";
    overlay.style.display = "flex";
  }
});

socket.on("disconnect", () => {
  setSearching(false);
});

export { globalState, keySquareMapper };
