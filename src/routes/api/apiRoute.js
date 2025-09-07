const express = require("express");
const { createNewUser, getUser } = require("../../controllers/userController");
const {
  addUserToWaitingQueue,
  checkEnoughUser,
  cancelMatchMaking,
  addUserToMatch,
  createQuizByTopic,
  getEachQuiz
} = require("../../controllers/gameController");
const { isSessionValidate } = require("../../middleware/checkSession");

const apiRoutes = express.Router();

// user
apiRoutes.post("/user", createNewUser);
apiRoutes.get("/user", isSessionValidate, getUser);

/* Gameplay */

// Before game
apiRoutes.post("/before-game/waiting-queue", addUserToWaitingQueue);
apiRoutes.get("/before-game/waiting-queue", checkEnoughUser);
apiRoutes.delete("/before-game/waiting-queue", cancelMatchMaking);

// During game
apiRoutes.post("/during-game/match", addUserToMatch);
apiRoutes.post("/during-game/match/quiz", createQuizByTopic);
apiRoutes.get("/during-game/match/quiz", getEachQuiz)

module.exports = {
  apiRoutes,
};
