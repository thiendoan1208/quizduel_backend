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

    if (response.data.save === true && response.data.token) {
      res.cookie("sessionToken", response.data.token, {
        httpOnly: true,
        maxAge: 365 * 24 * 60 * 60 * 1000,
      });
    } else if (response.data.save === false && response.data.token) {
      res.cookie("sessionToken", response.data.token, {
        httpOnly: true,
      });
    }
    successResponse(res, 200, response.message, response.data);
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, {
      success: false,
      message: "Cannot create user.",
    });
  }
};

const getUser = async (req, res) => {
  try {
    const userToken = req.cookies.sessionToken;
    const response = await handleGetUser(userToken);

    successResponse(res, 200, response.message, response.data.user);
  } catch (error) {
    console.error(error);
    errorResponse(res, 404, {
      success: false,
      message: "Cannot get user.",
    });
  }
};

module.exports = {
  createNewUser,
  getUser,
};
