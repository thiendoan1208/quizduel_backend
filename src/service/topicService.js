const { getTopicDB, findTopicDB } = require("../db/topics");

const handleGetTopic = async () => {
  try {
    const data = await getTopicDB();
    if (data) {
      return data;
    }
  } catch (error) {
    console.error(error);
  }
};

const handleFindTopic = async (keyword) => {
  try {
    const data = await findTopicDB(keyword);
    if (data) {
      return data;
    }
  } catch (error) {
    console.error(error);
  }
};



module.exports = {
  handleGetTopic,
  handleFindTopic
};
