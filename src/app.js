const express = require("express");
const cors = require("cors");
const { apiRoutes } = require("../src/routes/api/apiRoute");
const { config } = require("dotenv");
config();

const createApp = () => {
  const app = express();

  //CORS
  app.use(
    cors({
      origin: process.env.QUIZDUEL_FE_URL,
      credentials: true,
    })
  );

  // config bodyparser
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // routes
  app.use("/api", apiRoutes);

  return app;
};

module.exports = {
  createApp,
};
