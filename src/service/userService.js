const { createUserDB, getUserDB } = require("../db/users");

const handleCreateUser = async (userInfo) => {
  try {
    const data = await createUserDB(userInfo);

    if (data) {
      return data;
    }
  } catch (error) {
    console.error(error);
  }
};

const handleGetUser = async (userToken) => {
  try {
    const data = await getUserDB(userToken);
    if (data) {
      return data;
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  handleCreateUser,
  handleGetUser,
};
