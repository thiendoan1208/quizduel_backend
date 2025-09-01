const { getDB } = require("../config/db");
const { collection } = require("../db/collection_name/collection");

const createUserDB = async (userInfo) => {
  try {
    let db = getDB();

    const isUserExist = await db.collection(collection.USERS).findOne({
      name: userInfo.name,
    });

    if (isUserExist !== null) {
      return {
        message: "User is existed",
      };
    } else {
      await db.collection(collection.USERS).insertOne(userInfo);
      return {
        message: "Create user successfully.",
      };
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  createUserDB,
};
