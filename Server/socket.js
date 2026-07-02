const { createServer } = require("http");
const { Server } = require("socket.io");
const PORT = 3000;
const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
    allowedHeaders: ["GET", "POST"],
    credentials: true,
  },
});

let totalPlayers = 0;
let players = {};

function onDisconnect(socket) {
  totalPlayers--;
  firePlayers();
}
function firePlayers() {
  io.emit("total_players_count_change", totalPlayers);
}
function fireOnConnected() {
  totalPlayers++;
  firePlayers();
}
io.on("connection", (socket) => {
  players[socket.id] = socket;
  totalPlayers++;
  fireOnConnected(socket);

  socket.on("disconnect", () => onDisconnect(socket));
});

httpServer.listen(PORT);
