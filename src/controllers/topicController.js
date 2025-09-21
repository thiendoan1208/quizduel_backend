const { handleGetTopic, handleFindTopic } = require("../service/topicService");
const { successResponse } = require("../util/successHandling");
const { errorResponse } = require("../util/errorHandling");

const getTopic = async (req, res) => {
  try {
    const response = await handleGetTopic();

    if (response.success) {
      successResponse(res, response.code, response.message, response.data);
    } else {
      errorResponse(res, response.code, response.message);
    }
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Không lấy được chủ đề, SERVER_ERROR.");
  }
};

const findTopic = async (req, res) => {
  try {
    const search = req.body;
    const response = await handleFindTopic(search.keyword);

    if (response.success) {
      successResponse(res, response.code, response.message, response.data);
    } else {
      errorResponse(res, response.code, response.message);
    }
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Không tìm được chủ đề, SERVER_ERROR.");
  }
};
module.exports = {
  getTopic,
  findTopic,
};
