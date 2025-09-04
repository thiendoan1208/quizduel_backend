const express = require("express");
const { createNewUser, getUser } = require("../../controllers/userController");
const { addUserToWaitingQueue } = require("../../controllers/gameController");
const { isSessionValidate } = require("../../middleware/checkSession");

const apiRoutes = express.Router();

// user
apiRoutes.post("/user", createNewUser);
apiRoutes.get("/user", isSessionValidate, getUser);

/* Gameplay */

// Find game
apiRoutes.post("/waiting-queue", addUserToWaitingQueue);

module.exports = {
  apiRoutes,
};
