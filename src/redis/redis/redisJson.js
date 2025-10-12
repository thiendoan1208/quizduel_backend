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

const getJSON = async (key) => {
  try {
    const data = await client.json.get(key);

    if (data && data.length > 0) {
      return {
        success: true,
        data,
      };
    }

    return {
      success: true,
      data: null,
    };
  } catch (error) {
    console.error(error);
    return {
      success: true,
      data: null,
    };
  }
};

const delJSON = async (key) => {
  try {
    const data = await client.json.del(key, "$");
    if (data) {
      return {
        success: true,
        message: "Deleted",
      };
    }
    return {
      success: false,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
    };
  }
};


module.exports = {
  setJSON,
  getJSON,
  delJSON,
};
