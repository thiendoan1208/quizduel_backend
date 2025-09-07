const redisKey = {
  waitingQueue: "waiting_queue",
  match: (matchID) => `match:${matchID}`,
};

module.exports = {
  redisKey,
};
