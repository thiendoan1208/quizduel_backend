const {
  handleAddUserToWaitingQueue,
  handleCheckEnoughUser,
  handleCancelMatchMaking,
  handleAddUserToMatch,
  handleCreateQuizByTopic,
  handleGetEachQuiz,
} = require("../service/gameService");
const { errorResponse } = require("../util/errorHandling");
const { successResponse } = require("../util/successHandling");

// Before game
const addUserToWaitingQueue = async (req, res) => {
  try {
    const userInfo = req.body;
    const response = await handleAddUserToWaitingQueue(userInfo);

    if (response.success) {
      successResponse(res, response.code, response.message);
    } else {
      errorResponse(res, response.code, response.message);
    }
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Cannot add user to waiting queue, SERVER_ERROR.");
  }
};

const checkEnoughUser = async (req, res) => {
  try {
    const response = await handleCheckEnoughUser();
    if (response.success) {
      successResponse(res, response.code, response.message, response.user);
    } else {
      errorResponse(res, response.code, response.message);
    }
  } catch (error) {
    console.error(error);
    errorResponse(
      res,
      500,
      "Cannot get amount of user in waiting queue, SERVER_ERROR."
    );
  }
};

const cancelMatchMaking = async (req, res) => {
  try {
    if (typeof req.body === "string") {
      const userInfo = JSON.parse(req.body);

      const response = await handleCancelMatchMaking(userInfo);

      if (response.success) {
        successResponse(res, response.code, response.message);
      } else {
        errorResponse(res, response.code, response.message);
      }
    } else {
      const userInfo = req.body;
      const response = await handleCancelMatchMaking(userInfo);

      if (response.success) {
        successResponse(res, response.code, response.message);
      } else {
        errorResponse(res, response.code, response.message);
      }
    }
  } catch (error) {
    console.error(error);
    errorResponse(
      res,
      500,
      "An error ocurd while canceling match, SERVER_ERROR."
    );
  }
};

// During Game
const addUserToMatch = async (req, res) => {
  try {
    const response = await handleAddUserToMatch();

    if (response.success) {
      successResponse(res, response.code, response.message, response.data);
    } else {
      errorResponse(res, response.code, response.message);
    }
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Cannot add user to match, SERVER_ERROR.");
  }
};

const createQuizByTopic = async (req, res) => {
  try {
    const matchInfo = req.body;
    const response = await handleCreateQuizByTopic(matchInfo);

    if (response.success) {
      successResponse(res, response.code, response.message, response.data);
    } else {
      errorResponse(res, response.code, response.message);
    }
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Cannot get quiz, SERVER_ERROR.");
  }
};

const getEachQuiz = async (req, res) => {
  try {
    const matchInfo = req.body;
    const response = await handleGetEachQuiz(matchInfo);

    if (response.success) {
      successResponse(res, response.code, response.message, response.data);
    } else {
      errorResponse(res, response.code, response.message);
    }
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Cannot get each quiz, SERVER_ERROR.");
  }
};

module.exports = {
  addUserToWaitingQueue,
  checkEnoughUser,
  addUserToMatch,
  cancelMatchMaking,
  createQuizByTopic,
  getEachQuiz,
};
