const { errorResponse } = require("../util/errorHandling");
const {
  handleCreateUser,
  handleGetUser,
} = require("../../src/service/userService");
const { successResponse } = require("../util/successHandling");

const createNewUser = async (req, res) => {
  try {
    const userInfo = req.body;
    const response = await handleCreateUser(userInfo);

    if (!response.success) {
      errorResponse(res, response.code, response.message);
    }

    if (
      response.success &&
      response.data.save === true &&
      response.data.token
    ) {
      res.cookie("sessionToken", response.data.token, {
        httpOnly: true,
        maxAge: 365 * 24 * 60 * 60 * 1000,
      });
    } else if (
      response.success &&
      response.data.save === false &&
      response.data.token
    ) {
      res.cookie("sessionToken", response.data.token, {
        httpOnly: true,
      });
    }
    successResponse(res, response.code, response.message, response.data);
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Cannot create user, server error.");
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
    errorResponse(res, 500, "Cannot get user. server error.");
  }
};

module.exports = {
  createNewUser,
  getUser,
};
