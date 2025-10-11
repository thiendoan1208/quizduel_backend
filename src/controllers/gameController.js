const {
  handleAddUserToWaitingQueue,
  handleCheckEnoughUser,
  handleCancelMatchMaking,
  handleAddUserToMatch,
  handleDeleteMatch,
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

const addUserToMatch = async (req, res) => {
  try {
    const user = req.body;
    const response = await handleAddUserToMatch(user);

    if (response.success) {
      if (response.jwt !== null) {
        res.cookie("match", response.jwt, {
          httpOnly: true,
          maxAge: 60 * 60 * 1000,
        });
      }

      successResponse(res, response.code, response.message, response.data);
    } else {
      errorResponse(res, response.code, response.message);
    }
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Cannot add user to match, SERVER_ERROR.");
  }
};

const deleteMatch = async (req, res) => {
  try {
    if (typeof req.body === "string") {
      const user = JSON.parse(req.body);
      const response = await handleDeleteMatch(user);

      if (response.success) {
        console.log("running");
        res.clearCookie("match", {
          httpOnly: true,
          maxAge: 60 * 60 * 1000,
        });
      }
      successResponse(res, response.code, response.message, response.data);
    } else {
      const user = req.body;
      const response = await handleDeleteMatch(user);

      if (response.success) {
        res.clearCookie("match", {
          httpOnly: true,
          maxAge: 60 * 60 * 1000,
        });
      }
      successResponse(res, response.code, response.message, response.data);
    }
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Cannot add user to match, SERVER_ERROR.");
  }
};

// During Game
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
  deleteMatch,
};
