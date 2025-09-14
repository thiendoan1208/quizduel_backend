const { getDB } = require("../config/db");
const { createJWT } = require("../config/jwt");
const { collection } = require("../db/collection_name/collection");
const { v4 } = require("uuid");

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
        message: "Người dùng đã tồn tại.",
      };
    }

    // create JWT Token
    const token = createJWT(
      { username: userInfo.name },
      { expiresIn: oneYearSec }
    );

    // create UUID for Signin
    const loginSecret = v4().replaceAll("-", "");

    if (!token) {
      return {
        success: false,
        code: 500,
        message: "Không tạo được user token.",
      };
    }

    const result = await db.collection(collection.USERS).insertOne({
      ...userInfo,
      loginSecret: loginSecret,
      createDate: now,
    });
    const userID = result.insertedId;

    await db.collection(collection.SESSIONS).insertOne({
      userID,
      sessionID: token,
      createdAt: now,
      expiresAt: new Date(now.getTime() + oneYearMs),
    });

    return {
      success: true,
      code: 200,
      message: "Tạo user thành công.",
      data: { userInfo, loginSecret: loginSecret, token },
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      code: 500,
      message: "Lỗi server, không tạo được user.",
    };
  }
};

const loginUserDB = async (userInfo) => {
  try {
    const db = getDB();
    const now = new Date();
    const oneYearMs = 365 * 24 * 60 * 60 * 1000;
    const oneYearSec = 365 * 24 * 60 * 60;

    const user = await db.collection(collection.USERS).findOne({
      name: userInfo.name,
    });

    if (user && userInfo.loginSecret === user.loginSecret) {
      // create JWT Token
      const token = createJWT(
        { username: userInfo.name },
        { expiresIn: oneYearSec }
      );

      await db.collection(collection.SESSIONS).insertOne({
        userID: user._id,
        sessionID: token,
        createdAt: now,
        expiresAt: new Date(now.getTime() + oneYearMs),
      });

      return {
        success: true,
        code: 200,
        message: "Đăng nhập thành công.",
        token,
      };
    } else {
      return {
        success: false,
        code: 404,
        message: "Thông tin đăng nhập không chính xác.",
      };
    }
  } catch (error) {
    console.error(error);
    return {
      success: false,
      code: 500,
      message: "Lỗi server, không đăng nhập được.",
    };
  }
};

const logoutUserDB = async (sessionToken) => {
  try {
    let db = getDB();

    const isSessionExist = await db.collection(collection.SESSIONS).findOne({
      sessionID: sessionToken,
    });

    if (isSessionExist) {
      await db.collection(collection.SESSIONS).deleteOne({
        sessionID: sessionToken,
      });

      return {
        success: true,
        message: "Đã đăng xuất.",
        code: 200,
      };
    } else {
      return {
        success: false,
        message: "Lỗi không thể đăng xuất.",
        code: 404,
      };
    }
  } catch (error) {
    console.error(error);
    return {
      success: false,
      code: 500,
      message: "Lỗi server, không đăng xuẩt được.",
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
        message: "Lấy user thành công.",
        code: 200,
        data: {
          user: user[0].userInfo,
        },
      };
    }
    return {
      success: false,
      message: "Không có session token",
      code: 404,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      code: 500,
      message: "Không lấy được user, lỗi server.",
    };
  }
};

const deleteUserDB = async (username, sessionToken) => {
  try {
    let db = getDB();

    if (username && sessionToken) {
      await db.collection(collection.USERS).deleteOne({
        name: username,
      });

      await db.collection(collection.SESSIONS).deleteOne({
        sessionID: sessionToken,
      });

      return {
        success: true,
        code: 200,
        message: "Dã xóa tài khoản.",
      };
    }

    return {
      success: false,
      code: 404,
      message: "Không lấy được thông tin user.",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      code: 500,
      message: "Không xóa được user, lỗi server.",
    };
  }
};

module.exports = {
  createUserDB,
  loginUserDB,
  getSession,
  getUserDB,
  logoutUserDB,
  deleteUserDB,
};
