const { createClient } = require("redis");
const { config } = require("dotenv");
const { criticalError } = require("../util/errorHandling");
config();

const client = createClient({
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

client.on("error", (err) => criticalError("Redis Error", err));

const connectRedis = async () => {
  if (!client.isOpen) {
    await client.connect();
    console.log("✅ Connected to Redis");
  }
};

module.exports = {
  connectRedis,
  client,
};
