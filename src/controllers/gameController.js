const { handleAddUserToWaitingQueue } = require("../service/gameService");
const { errorResponse } = require("../util/errorHandling");
const { successResponse } = require("../util/successHandling");

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

module.exports = {
  addUserToWaitingQueue,
};
