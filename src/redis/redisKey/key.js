const redisKey = {
  waitingQueue: "waiting_queue",
  match: (matchID) => `match:${matchID}`,
  userMatch: (username) => `user_match:${username}`,
  quiz: (matchID) => `quiz:${matchID}`,
};

module.exports = {
  redisKey,
};
