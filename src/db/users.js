const { getDB } = require("../config/db");
const { createJWT, verifyToken } = require("../config/jwt");
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
        message: "User already exists",
        data: { save: userInfo.save, token: null },
      };
    }

    const token = createJWT(
      { username: userInfo.name },
      { expiresIn: oneYearSec }
    );

    if (!token) {
      return {
        message: "Cannot create user",
        data: { save: null, token: null },
      };
    }

    const result = await db.collection(collection.USERS).insertOne(userInfo);
    const userID = result.insertedId;

    await db.collection(collection.SESSIONS).insertOne({
      userID,
      sessionID: token,
      save: userInfo.save,
      createdAt: now,
      expiresAt: new Date(now.getTime() + oneYearMs),
    });

    return {
      message: "User created successfully",
      data: { save: userInfo.save, token },
    };
  } catch (error) {
    console.error(error);
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
        status: "Valid",
      };
    } else {
      return {
        message: "Session invalid.",
        status: "Invalid",
      };
    }
  } catch (error) {
    console.error(error);
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

    return {
      message: "Get user successfully.",
      data: {
        user: user[0].userInfo,
      },
    };
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  createUserDB,
  getSession,
  getUserDB,
};
