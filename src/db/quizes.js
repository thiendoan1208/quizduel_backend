const { getDB } = require("../config/db");
const { collection } = require("../db/collection_name/collection");

const checkQuiz = async (quiz) => {
  try {
    let db = getDB();
    const data = await db
      .collection(collection.QUIZES)
      .find({
        question: quiz,
      })
      .toArray();

    if (data && data.length > 0) {
      return {
        sucess: true,
        message: "Checked exist quiz.",
        data,
      };
    }

    return {
      sucess: false,
      message: "No quiz exist.",
      data: null,
    };
  } catch (error) {
    console.error(error);
    return {
      sucess: false,
      message: "Cannot check exist quiz.",
      data: null,
    };
  }
};

const addQuizDB = async (quizes) => {
  try {
    let db = getDB();
    const now = new Date();

    for (let i = 0; i < quizes.length; i++) {
      await db.collection(collection.QUIZES).insertOne({
        ...quizes[i],
        create: now,
      });
    }

    return {
      success: true,
      message: "Added quizes to DB",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Cannot add quizes to DB.",
    };
  }
};

module.exports = {
  checkQuiz,
  addQuizDB,
};
