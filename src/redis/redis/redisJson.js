const { client } = require("../../config/redis");

const setJSON = async (key, path, value, ttl) => {
  try {
    const isKeyExist = await client.exists(key);
    if (isKeyExist === 0) {
      await client.json.set(key, path, []);

      await client.json.arrAppend(key, path, value);
      await client.expire(key, ttl);
    } else {
      await client.json.arrAppend(key, path, value);
    }
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
