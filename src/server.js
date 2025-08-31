const http = require("http");
const { connectRedis } = require("../src/config/redis");
const { createSocket } = require("../src/config/socket.io");
const { connectToDB } = require("../src/config/db");
const { createApp } = require("./app");
const { config } = require("dotenv");
config();

(async () => {
  const port = process.env.QUIZDUEL_BE_PORT;
  const hostname = process.env.QUIZDUEL_BE_HOSTNAME;

  // create express app
  const app = createApp();

  // create server
  const server = http.createServer(app);

  // connect mongodb
  await connectToDB();

  // connect to redis
  await connectRedis();

  // create socket
  createSocket(server);

  // start app
  server.listen(port, () => {
    console.log(`App is running on http://${hostname}:${port}`);
  });
})();
