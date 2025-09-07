const {
  handleAddUserToWaitingQueue,
  handleCheckEnoughUser,
  handleCancelMatchMaking,
  handleAddUserToMatch,
} = require("../service/gameService");
const { errorResponse } = require("../util/errorHandling");
const { successResponse } = require("../util/successHandling");

// Before game
const addUserToWaitingQueue = async (req, res) => {
  try {
    const userTopic = req.body;
    const response = await handleAddUserToWaitingQueue(userTopic);

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
    if (response.sucess) {
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
    const userInfo = req.body;
    const response = await handleCancelMatchMaking(userInfo);

    if (response.sucess) {
      successResponse(res, response.code, response.message);
    } else {
      errorResponse(res, response.code, response.message);
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

    if (response.sucess) {
      successResponse(res, response.code, response.message);
    } else {
      errorResponse(res, response.code, response.message);
    }
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Cannot add user to match, SERVER_ERROR.");
  }
};

module.exports = {
  addUserToWaitingQueue,
  checkEnoughUser,
  addUserToMatch,
  cancelMatchMaking,
};
