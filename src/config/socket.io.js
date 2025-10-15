const { Server } = require("socket.io");
const { config } = require("dotenv");
const { instrument } = require("@socket.io/admin-ui");
const { matchHandler } = require("../socket/match-socket");

config();

const createSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: [
        process.env.QUIZDUEL_FE_URL,
        process.env.SOCKET_ADMIN_ORIGIN_URL,
      ],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  instrument(io, {
    auth: {
      type: process.env.SOCKET_ADMIN_TYPE,
      username: process.env.SOCKET_ADMIN_USERNAME,
      password: "$2b$10$QcYfTYF6s4UxMeUlOjJ3K.gmwYHC6bR2voudvJ1.YMXiku5HUU5Ia",
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket Connected: ", socket.id);

    // matchHandler
    matchHandler(io, socket);
  });
};

module.exports = {
  createSocket,
};
