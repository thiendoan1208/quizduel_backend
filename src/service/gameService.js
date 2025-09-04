const { lPush } = require("../redis/redis/redisLIST");
const { redisKey } = require("../redis/redisKey/key");

const handleAddUserToWaitingQueue = async (userTopic) => {
  try {
    const status = await lPush(
      redisKey.waitingQueue,
      JSON.stringify(userTopic)
    );

    if (status) {
      return {
        success: true,
        code: 200,
        message: "Added user to waiting queue.",
      };
    }

    return {
      success: false,
      code: 500,
      message: "Failed to add user to waiting queue.",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      code: 500,
      message: "Server error while adding user to waiting queue.",
    };
  }
};

module.exports = {
  handleAddUserToWaitingQueue,
};
