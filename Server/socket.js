const { createServer } = require("http");
const { Server } = require("socket.io");

const PORT = process.env.PORT || 3000;
const httpServer = createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Chess Socket Server Running");
});

const io = new Server(httpServer, {
  cors: {
    origin: ["http://127.0.0.1:5500", "http://localhost:5500", "https://av-chess-zero.vercel.app"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const TIMES = [1, 3, 10, 30];
let totalPlayers = 0;

const games = {};
const waiting = {
  1: null,
  3: null,
  10: null,
  30: null,
};

function broadcastPlayerCount() {
  io.emit("total_players_count_change", totalPlayers);
}

function removeFromQueues(socketId) {
  TIMES.forEach((time) => {
    if (waiting[time] === socketId) {
      waiting[time] = null;
    }
  });
}

function makeMatch(socketId, opponentId, time) {
  const roomId = `${opponentId}#${socketId}`;
  io.sockets.sockets.get(opponentId)?.join(roomId);
  io.sockets.sockets.get(socketId)?.join(roomId);

  games[opponentId] = { opponentId: socketId, roomId, color: "w", time };
  games[socketId] = { opponentId, roomId, color: "b", time };

  io.to(opponentId).emit("match_made", { color: "w", time });
  io.to(socketId).emit("match_made", { color: "b", time });
}

function handlePlayRequest(socket, time) {
  time = Number(time);
  if (!TIMES.includes(time)) return;

  // Already in a game — ignore duplicate requests.
  if (games[socket.id]) return;
  removeFromQueues(socket.id);

  const opponentId = waiting[time];

  if (
    opponentId &&
    opponentId !== socket.id &&
    io.sockets.sockets.get(opponentId)
  ) {
    waiting[time] = null;
    makeMatch(socket.id, opponentId, time);
    return;
  }
  waiting[time] = socket.id;
}

function handleMove(socket, payload) {
  const game = games[socket.id];
  if (!game) return;
  socket.to(game.roomId).emit("opponent_move", payload);
}

function endGame(socketId, reason) {
  const game = games[socketId];
  if (!game) return;

  const { opponentId, roomId } = game;
  io.to(opponentId).emit("opponent_left", { reason });

  delete games[socketId];
  delete games[opponentId];

  io.sockets.sockets.get(opponentId)?.leave(roomId);
  io.sockets.sockets.get(socketId)?.leave(roomId);
}

function onDisconnect(socket) {
  removeFromQueues(socket.id);
  endGame(socket.id, "disconnect");
  totalPlayers = Math.max(0, totalPlayers - 1);
  broadcastPlayerCount();
}

io.on("connection", (socket) => {
  totalPlayers++;
  broadcastPlayerCount();

  socket.on("want_to_play", (time) => handlePlayRequest(socket, time));
  socket.on("move", (payload) => handleMove(socket, payload));
  socket.on("resign", () => endGame(socket.id, "resign"));
  socket.on("disconnect", () => onDisconnect(socket));
});

httpServer.listen(PORT, () => {
  console.log(`Chess socket server listening on :${PORT}`);
});
