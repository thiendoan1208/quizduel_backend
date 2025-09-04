const { getDB } = require("../config/db");
const { createJWT } = require("../config/jwt");
const { collection } = require("../db/collection_name/collection");

const createUserDB = async (userInfo) => {
  try {
    const db = getDB();
    const now = new Date();
    const oneYearMs = 365 * 24 * 60 * 60 * 1000;
    const oneYearSec = 365 * 24 * 60 * 60;

    const userExist = await db.collection(collection.USERS).findOne({
      name: userInfo.name,
    });
    if (userExist) {
      return {
        success: false,
        code: 400,
        message: "User already exists",
      };
    }

    const token = createJWT(
      { username: userInfo.name },
      { expiresIn: oneYearSec }
    );

    if (!token) {
      return {
        success: false,
        code: 500,
        message: "Cannot create user token.",
      };
    }

    const result = await db
      .collection(collection.USERS)
      .insertOne({ ...userInfo, createDate: now });
    const userID = result.insertedId;

    await db.collection(collection.SESSIONS).insertOne({
      userID,
      sessionID: token,
      save: userInfo.save,
      createdAt: now,
      expiresAt: new Date(now.getTime() + oneYearMs),
    });

    return {
      success: true,
      code: 200,
      message: "User is created successfully.",
      data: { save: userInfo.save, token },
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      code: 200,
      message: "Cannot create user, server error.",
    };
  }
};

const getSession = async (sessionID) => {
  try {
    let db = getDB();

    const isSessionExist = await db.collection(collection.SESSIONS).findOne({
      sessionID: sessionID,
    });

    if (isSessionExist) {
      return {
        message: "Session valid.",
        code: 200,
        status: "Valid",
      };
    } else {
      return {
        message: "Session invalid.",
        code: 404,
        status: "Invalid",
      };
    }
  } catch (error) {
    console.error(error);
    return {
      message: "Session invalid, server error.",
      code: 500,
      status: "Invalid",
    };
  }
};

const getUserDB = async (userToken) => {
  try {
    let db = getDB();
    const pipeline = [
      {
        $match: {
          sessionID: userToken,
        },
      },
      {
        $lookup: {
          from: collection.USERS,
          localField: "userID",
          foreignField: "_id",
          as: "userInfo",
        },
      },
    ];

    const user = await db
      .collection(collection.SESSIONS)
      .aggregate(pipeline)
      .toArray();

    if (user) {
      return {
        success: true,
        message: "Get user successfully.",
        code: 200,
        data: {
          user: user[0].userInfo,
        },
      };
    }
    return {
      success: false,
      message: "Cannot get user, no session is found",
      code: 404,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      code: 500,
      message: "Cannot get user, server error.",
    };
  }
};

module.exports = {
  createUserDB,
  getSession,
  getUserDB,
};
