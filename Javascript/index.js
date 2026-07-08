import { initGame } from "./Data/data.js";
import { GlobalEvent } from "./Events/global.js";
import { initGameRender } from "./Render/main.js";
import "./Helper/addCloak.js";

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

function handleBtnClk(event) {
  const timer = Number(event.target.getAttribute("data-time"));
  socket.emit("want_to_play", timer);
  $(`waitingJoin`).hide();
  $(`waitingJoin`).show();
}
const socket = io("http://localhost:3000");
socket.on("connect", () => {
  console.log("Socket connected:", socket.id);
});

socket.on("total_players_count_change", function (totalPlayerCnt) {
  const playerCountEl = document.getElementById("total-players");
  if (playerCountEl) {
    playerCountEl.textContent = "Total Players: " + totalPlayerCnt;
  }
  console.log("Player count updated:", totalPlayerCnt);
});

export { globalState, keySquareMapper };
