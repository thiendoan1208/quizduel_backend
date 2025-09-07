const redisKey = {
  waitingQueue: "waiting_queue",
  match: (matchID) => `match:${matchID}`,
  quiz: (matchID) => `quiz:${matchID}`,
};

module.exports = {
  redisKey,
};
