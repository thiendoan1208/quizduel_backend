const redisKey = {
  user: (username) => `user:${username}`,
};

module.exports = {
  redisKey,
};
