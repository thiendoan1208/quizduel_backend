const { client } = require("../../config/redis");

const lPush = async (key, element, ttl) => {
  try {
    await client.lPush(key, element);
    await client.expire(key, ttl);
    return {
      success: true,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
    };
  }
};

const lRange = async (key, start, stop) => {
  try {
    const data = await client.lRange(key, start, stop);
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
    };
  }
};

const lLength = async (key) => {
  try {
    const data = await client.lLen(key);

    return {
      success: true,
      user: data,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      user: null,
    };
  }
};

const lRemoveMutliple = async (key, total) => {
  try {
    const startPostion = total - total;
    const endPostion = total - 1;

    const data = await client.lRange(key, startPostion, endPostion);
    await client.lTrim(key, total, -1);

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      data: null,
    };
  }
};

const lRem = async (key, count, element) => {
  try {
    await client.lRem(key, count, element);

    return {
      success: true,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
    };
  }
};

module.exports = {
  lPush,
  lLength,
  lRemoveMutliple,
  lRem,
  lRange,
};
