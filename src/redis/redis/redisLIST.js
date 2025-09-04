const { client } = require("../../config/redis");

const lPush = async (key, element) => {
  try {
    await client.lPush(key, element);
    return {
      status: true,
    };
  } catch (error) {
    console.error(error);
    return {
      status: false,
    };
  }
};

module.exports = {
  lPush,
};
