const {
  handleCreateQuizByTopic,
  handleGetEachQuiz,
} = require("../service/gameService");

const matchHandler = (io, socket) => {
  // join match
  socket.on("join-match", ({ matchID }) => {
    socket.join(matchID);
  });

  // create question
  const TOTAL_QUES = 4;
  socket.on("create-ques", async ({ userMatchInfo }) => {
    await handleCreateQuizByTopic(userMatchInfo);
    const quesNum = await handleGetEachQuiz({
      matchID: userMatchInfo.matchID,
      question: 1,
    });

    if (quesNum.data.total >= TOTAL_QUES) {
      io.to(userMatchInfo.matchID).emit("ques-ready", {
        status: "ready",
      });
    } else {
      io.to(userMatchInfo.matchID).emit("waiting-for-others", {
        status: "pending",
      });
    }
  });

  // get each question
  socket.on("get-question", async ({ matchID, question }) => {
    const eachQues = await handleGetEachQuiz({ matchID, question });

    io.to(matchID).emit("question-res", {
      eachQues,
    });
  });
};

module.exports = {
  matchHandler,
};
