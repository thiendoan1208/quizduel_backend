const { Server } = require("socket.io");
const { config } = require("dotenv");
config();

const createSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.QUIZDUEL_FE_URL,
      methods: ["GET", "POST"],
    },
  });
};

module.exports = {
  createSocket,
};
