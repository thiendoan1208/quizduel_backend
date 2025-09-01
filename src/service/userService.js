const { createUserDB } = require("../db/users");

const handleCreateUser = async (userInfo) => {
  try {
    const data = await createUserDB(userInfo);
    return data;
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  handleCreateUser,
};
