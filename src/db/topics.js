const { getDB } = require("../config/db");
const { collection } = require("../db/collection_name/collection");

const getTopicDB = async () => {
  try {
    let db = getDB();

    const topic = await db.collection(collection.TOPICS).find().toArray();

    if (topic && topic.length > 0) {
      return {
        success: true,
        code: 200,
        message: "Lấy danh sách topic thành công.",
        data: topic,
      };
    }
    return {
      success: true,
      code: 200,
      message: "Danh sách không có gì.",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      code: 500,
      message: "Không lấy được danh sách, SERVER ERROR.",
    };
  }
};

const findTopicDB = async (keyword) => {
  try {
    let db = getDB();
    const topics = await db
      .collection(collection.TOPICS)
      .find({
        "topics.name": {
          $regex: keyword,
          $options: "i",
        },
      })
      .toArray();

    if (topics && topics !== null && topics.length > 0) {
      return {
        success: true,
        code: 200,
        message: "Lấy danh sách topic thành công.",
        data: topics,
      };
    } else {
      return {
        success: true,
        code: 200,
        message: "Không có chủ đề phù hợp.",
        data: topics,
      };
    }
  } catch (error) {
    console.error(error);
    return {
      success: false,
      code: 500,
      message: "Không lấy được danh sách, SERVER ERROR.",
    };
  }
};

module.exports = {
  getTopicDB,
  findTopicDB,
};
