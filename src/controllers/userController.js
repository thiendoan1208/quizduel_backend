const { errorResponse } = require("../util/errorHandling");
const { handleCreateUser } = require("../../src/service/userService");
const { successResponse } = require("../util/successHandling");

const createNewUser = async (req, res) => {
  try {
    const userInfo = req.body;
    const data = await handleCreateUser(userInfo);
    successResponse(res, 200, data);
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, {
      message: "Cannot create user.",
    });
  }
};

module.exports = {
  createNewUser,
};

// 