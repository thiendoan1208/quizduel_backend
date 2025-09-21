const { setJSON, getJSON } = require("../redis/redis/redisJSON");
const {
  lPush,
  lLength,
  lRemoveMutliple,
  lRem,
} = require("../redis/redis/redisLIST");
const { redisKey } = require("../redis/redisKey/key");
const { openAI } = require("../config/openai");
const { generatePrompt } = require("../util/prompt");
const { addQuizDB, checkQuiz } = require("../db/quizes");

// Before game
const handleAddUserToWaitingQueue = async (userInfo) => {
  const EXPIRE_TIME = 30 * 60;

  try {
    const response = await lPush(
      redisKey.waitingQueue,
      JSON.stringify(userInfo),
      EXPIRE_TIME
    );

    if (response.success) {
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

const handleCheckEnoughUser = async () => {
  try {
    const data = await lLength(redisKey.waitingQueue);

    if (data.success) {
      return {
        success: true,
        code: 200,
        message: "Get amount of user in waiting queue successfully.",
        user: data.user,
      };
    }

    return {
      success: false,
      code: 500,
      message: "Cannot get amount of user in waiting queue.",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      code: 500,
      message: "Cannot get amount of user in waiting queue.",
    };
  }
};

const handleCancelMatchMaking = async (userInfo) => {
  try {
    const user = JSON.stringify(userInfo);
    const data = await lRem(redisKey.waitingQueue, 0, user);

    if (data.success) {
      return {
        success: true,
        code: 200,
        message: "Canceled match making.",
      };
    } else {
      return {
        success: false,
        code: 500,
        message: "An error ocurd while canceling match.",
      };
    }
  } catch (error) {
    console.error(error);
    return {
      success: false,
      code: 500,
      message: "An error ocurd while canceling match.",
    };
  }
};

// During game

const handleAddUserToMatch = async () => {
  try {
    const MATCH_CACHE_TIME = 30 * 60;
    const USER_EACH_MATCH = 2;
    const users = [];
    let matchID = "";

    const userInQueue = await lLength(redisKey.waitingQueue);

    if (Number(userInQueue.user) >= USER_EACH_MATCH) {
      const data = await lRemoveMutliple(
        redisKey.waitingQueue,
        USER_EACH_MATCH
      );

      if (data.success) {
        for (let i = 0; i < USER_EACH_MATCH; i++) {
          users[i] = JSON.parse(data.data[i]);
        }

        matchID = `${users[USER_EACH_MATCH - USER_EACH_MATCH].userInfo.name}_${
          users[USER_EACH_MATCH - 1].userInfo.name
        }`;

        await setJSON(redisKey.match(matchID), "$", users, MATCH_CACHE_TIME);

        return {
          success: true,
          code: 200,
          message: "Added user to match.",
          data: {
            matchID,
          },
        };
      } else {
        return {
          success: false,
          code: 500,
          message: "Cannot add user to match.",
        };
      }
    }

    return {
      success: false,
      code: 422,
      message:
        "The amount of user left is not engouh to make a match, min is 2.",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      code: 500,
      message: "Cannot add user to match.",
    };
  }
};

const handleCreateQuizByTopic = async (matchInfo) => {
  try {
    const QUIZ_CACHE_TIME = 45 * 60;
    const NUM_QUESTION = 2;
    const TOPIC = matchInfo.topic;
    const LANGUAGE = "Vietnamese";

    const prompt = generatePrompt(NUM_QUESTION, TOPIC, LANGUAGE);

    const reply = await openAI(prompt);

    if (reply.data !== null) {
      await setJSON(
        redisKey.quiz(matchInfo.matchID),
        "$",
        ...reply.data,
        QUIZ_CACHE_TIME
      );

      for (let i = 0; i < reply.data.length; i++) {
        const quizes = await checkQuiz(reply.data[i].question);

        if (quizes.data === null) {
          await addQuizDB(reply.data);
        }
      }

      return {
        success: true,
        code: 200,
        message: "Quiz is created.",
        data: reply.data,
      };
    }
  } catch (error) {
    console.error(error);
    return {
      success: false,
      code: 500,
      message: "Cannot get quiz.",
    };
  }
};

const handleGetEachQuiz = async (matchInfo) => {
  try {
    const question = await getJSON(redisKey.quiz(matchInfo.matchID));
    if (question.data && question.data.length > 0) {
      return {
        success: true,
        code: 200,
        message: `Get question number: ${matchInfo.question - 1}.`,
        data: question.data[matchInfo.question - 1],
      };
    }
  } catch (error) {
    console.error(error);
    return {
      success: false,
      code: 500,
      message: `Cannot get question number: ${matchInfo.question - 1}.`,
    };
  }
};

module.exports = {
  handleAddUserToWaitingQueue,
  handleCheckEnoughUser,
  handleCancelMatchMaking,
  handleAddUserToMatch,
  handleCreateQuizByTopic,
  handleGetEachQuiz,
};
