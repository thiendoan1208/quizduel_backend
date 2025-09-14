const { successResponse } = require("../util/successHandling");
const { errorResponse } = require("../util/errorHandling");

const {
  handleCreateUser,
  handleGetUser,
  handleLoginUser,
  handleLogoutUser,
  handleDeleteUser,
} = require("../../src/service/userService");

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
      return errorResponse(res, response.code, response.message);
    }

    if (response.success && response.data.loginSecret) {
      return successResponse(res, response.code, response.message);
    }
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Không thể kết nối đến server.");
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
      return errorResponse(res, response.code, response.message);
    }
    return successResponse(res, response.code, response.message);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Không thể kết nối đến server.");
  }
};

const logoutUser = async (req, res) => {
  try {
    const sessionToken = req.cookies.sessionToken;

    const response = await handleLogoutUser(sessionToken);

    if (response.success) {
      await res.clearCookie("sessionToken", {
        httpOnly: true,
        maxAge: 365 * 24 * 60 * 60 * 1000,
      });

      return successResponse(res, response.code, response.message);
    }

    return errorResponse(res, response.code, response.message);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Không thể kết nối đến server.");
  }
};

const getUser = async (req, res) => {
  try {
    const userToken = req.cookies.sessionToken;
    const response = await handleGetUser(userToken);

    if (!response.success) {
      return errorResponse(res, response.code, response.message);
    }

    return successResponse(
      res,
      response.code,
      response.message,
      response.data.user
    );
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Không thể kết nối đến server.");
  }
};

const deleteUser = async (req, res) => {
  try {
    const userInfo = req.query;
    const sessionToken = req.cookies.sessionToken;

    const response = await handleDeleteUser(userInfo.username, sessionToken);

    if (response.success) {
      await res.clearCookie("sessionToken", {
        httpOnly: true,
        maxAge: 365 * 24 * 60 * 60 * 1000,
      });

      return successResponse(res, response.code, response.message);
    }

    return errorResponse(res, response.code, response.message);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Không thể kết nối đến server.");
  }
};

module.exports = {
  createNewUser,
  getUser,
  loginUser,
  logoutUser,
  deleteUser,
};
