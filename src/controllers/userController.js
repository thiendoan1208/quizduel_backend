const { errorResponse } = require("../util/errorHandling");
const {
  handleCreateUser,
  handleGetUser,
  handleLoginUser,
} = require("../../src/service/userService");
const { successResponse } = require("../util/successHandling");

const createNewUser = async (req, res) => {
  try {
    const userInfo = req.body;
    const response = await handleCreateUser(userInfo);

    if (
      response.success &&
      response.data.loginSecret &&
      response.data.token !== null
    ) {
      res.cookie("sessionToken", response.data.token, {
        httpOnly: true,
        maxAge: 365 * 24 * 60 * 60 * 1000,
      });
    }

    if (!response.success) {
      errorResponse(res, response.code, response.message);
    }

    if (response.success && response.data.loginSecret) {
      successResponse(res, response.code, response.message);
    }
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Không thể kết nối đến server.");
  }
};

const loginUser = async (req, res) => {
  try {
    const userInfo = req.body;
    const response = await handleLoginUser(userInfo);

    if (response.success && response.token !== null) {
      res.cookie("sessionToken", response.token, {
        httpOnly: true,
        maxAge: 365 * 24 * 60 * 60 * 1000,
      });
    }

    if (!response.success) {
      errorResponse(res, response.code, response.message);
    }
    successResponse(res, response.code, response.message);
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Không thể kết nối đến server.");
  }
};

const getUser = async (req, res) => {
  try {
    const userToken = req.cookies.sessionToken;
    const response = await handleGetUser(userToken);

    if (!response.success) {
      errorResponse(res, response.code, response.message);
    }

    successResponse(res, response.code, response.message, response.data.user);
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Không thể kết nối đến server.");
  }
};

module.exports = {
  createNewUser,
  getUser,
  loginUser,
};
