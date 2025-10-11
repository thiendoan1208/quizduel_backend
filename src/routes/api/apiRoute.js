const express = require("express");
const {
  createNewUser,
  loginUser,
  logoutUser,
  getUser,
  deleteUser,
} = require("../../controllers/userController");
const {
  addUserToWaitingQueue,
  checkEnoughUser,
  cancelMatchMaking,
  addUserToMatch,
  deleteMatch,
  createQuizByTopic,
  getEachQuiz,
} = require("../../controllers/gameController");
const { getTopic, findTopic } = require("../../controllers/topicController");
const { isSessionValidate } = require("../../middleware/checkSession");

const apiRoutes = express.Router();

/* User */
apiRoutes.post("/user", createNewUser);
apiRoutes.post("/user/login", loginUser);
apiRoutes.post("/user/logout", logoutUser);
apiRoutes.get("/user", isSessionValidate, getUser);
apiRoutes.delete("/user", deleteUser);

/* Topic */
apiRoutes.get("/topic", getTopic), apiRoutes.post("/topic", findTopic);

/* Gameplay */

// Before game
apiRoutes.post("/before-game/waiting-queue", addUserToWaitingQueue);
apiRoutes.get("/before-game/waiting-queue", checkEnoughUser);
apiRoutes.delete("/before-game/waiting-queue", cancelMatchMaking);
apiRoutes.post("/before-game/match", addUserToMatch);
apiRoutes.delete("/before-game/match", deleteMatch);

// sendBeacon
apiRoutes.post(
  "/before-game/waiting-queue/cancel",
  express.text(),
  cancelMatchMaking
);
apiRoutes.post(
  "/before-game/match/cancel",
  express.text(),
  deleteMatch
);

// During game
apiRoutes.post("/during-game/match/quiz", createQuizByTopic);
apiRoutes.get("/during-game/match/quiz", getEachQuiz);

module.exports = {
  apiRoutes,
};
