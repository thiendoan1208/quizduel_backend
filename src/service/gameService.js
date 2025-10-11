const { setJSON, getJSON, delJSON } = require("../redis/redis/redisJSON");
const {
  lPush,
  lLength,
  lRemoveMutliple,
  lRem,
  lRange,
} = require("../redis/redis/redisLIST");
const { redisKey } = require("../redis/redisKey/key");
const { openAI } = require("../config/openai");
const { generatePrompt } = require("../util/prompt");
const { addQuizDB, checkQuiz } = require("../db/quizes");
const { createJWT } = require("../config/jwt");
const Redis = require("ioredis");
const Redlock = require("redlock").default;
const { config } = require("dotenv");
config();

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
});

const redlock = new Redlock([redis], {
  driftFactor: 0.01,
  retryCount: 3,
  retryDelay: 200,
});

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
    const users = await lRange(redisKey.waitingQueue, 0, 1);
    let arrUsers = [];

    if (users && users.success && users.data.length > 0) {
      users.data.forEach((element) => {
        arrUsers.push(JSON.parse(element));
      });
    }

    if (data.success) {
      return {
        success: true,
        code: 200,
        message: "Get amount of user in waiting queue successfully.",
        user: {
          numberOfUserIsWaiting: data,
          matchUsers: arrUsers,
        },
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

const handleAddUserToMatch = async (user) => {
  const lockKey = "lock:waiting_queue";
  const lock = await redlock.acquire([lockKey], 2000);

  try {
    const MATCH_CACHE_TIME = 30 * 60;
    const USER_EACH_MATCH = 2;
    const users = [];

    const userInQueue = await lLength(redisKey.waitingQueue);
    const userMatchInfo = await getJSON(redisKey.userMatch(user.username));

    if (userMatchInfo.data !== null) {
      const matchInfo = await getJSON(
        redisKey.match(userMatchInfo.data[0].matchID)
      );
      const jwtToken = createJWT(
        { matchID: userMatchInfo.data[0].matchID },
        { expiresIn: "1h" }
      );

      return {
        success: true,
        code: 200,
        message: "Match is existed.",
        data: {
          matchID: userMatchInfo.data[0].matchID,
          users: matchInfo.data[0],
        },
        jwt: jwtToken,
      };
    } else {
      if (Number(userInQueue.user) >= USER_EACH_MATCH) {
        const data = await lRemoveMutliple(
          redisKey.waitingQueue,
          USER_EACH_MATCH
        );

        if (data.success && data.data.length === USER_EACH_MATCH) {
          for (let i = 0; i < USER_EACH_MATCH; i++) {
            users[i] = JSON.parse(data.data[i]);
          }

          const matchID = users.map((u) => u.userInfo.name).join("_");

          await setJSON(redisKey.match(matchID), "$", users, MATCH_CACHE_TIME);

          for (let i = 0; i < USER_EACH_MATCH; i++) {
            await setJSON(
              redisKey.userMatch(users[i].userInfo.name),
              "$",
              {
                matchID,
              },
              MATCH_CACHE_TIME
            );
          }

          const jwtToken = createJWT({ matchID }, { expiresIn: "1h" });

          return {
            success: true,
            code: 200,
            message: "Added user to match.",
            data: {
              matchID,
              users,
            },
            jwt: jwtToken,
          };
        } else {
          return {
            success: false,
            code: 500,
            message: "Not enough users removed from queue to form a match.",
          };
        }
      }
    }

    return {
      success: false,
      code: 422,
      message: "No valid match found.",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      code: 500,
      message: "Cannot add user to match.",
    };
  } finally {
    await lock.release();
  }
};

const handleDeleteMatch = async (user) => {
  try {
    await delJSON(redisKey.match(user.matchID));
    const userMatchRes = await delJSON(redisKey.userMatch(user.username));
    if (userMatchRes.success) {
      return {
        success: true,
        code: 200,
        message: "Deleted.",
      };
    } else {
      return {
        success: false,
        code: 404,
        message: "Nothing to delete.",
      };
    }
  } catch (error) {
    console.error(error);
    return {
      success: false,
      code: 500,
      message: "Cannot delete user, server error.",
    };
  }
};

// During game
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
  handleDeleteMatch,
  handleCreateQuizByTopic,
  handleGetEachQuiz,
};
