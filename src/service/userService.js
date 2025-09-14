const { createUserDB, getUserDB, loginUserDB, logoutUserDB, deleteUserDB } = require("../db/users");

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

const handleLoginUser = async (userInfo) => {
  try {
    const data = await loginUserDB(userInfo);
    if (data) {
      return data;
    }
  } catch (error) {
    console.error(error);
  }
};

const handleLogoutUser = async (sessionToken) => {
  try {
    const data = await logoutUserDB(sessionToken);
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

const handleDeleteUser = async (username, sessionToken) => {
  try {
    const data = await deleteUserDB(username, sessionToken);
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
  handleLoginUser,
  handleLogoutUser,
  handleDeleteUser
};
