const { client } = require("../../config/redis");

const setJSON = async (key, path, value, ttl) => {
  try {
    await client.json.set(key, path, value);
    await client.expire(key, ttl);
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
    };
  }
};

module.exports = {
  setJSON,
};
