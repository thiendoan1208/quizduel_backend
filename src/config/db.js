const { MongoClient } = require("mongodb");
const { config } = require("dotenv");
const { criticalError } = require("../util/errorHandling");
config();

let dbConnection;

const connectToDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    const dbName = process.env.MONGODB_NAME;

    const client = await MongoClient.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });

    dbConnection = client.db(dbName);

    console.log(`Connected to DB: ${dbName}`);
  } catch (error) {
    criticalError(`Failed to connect to DB`);
  }
};

const getDB = () => {
  if (!dbConnection) throw Error("DB not initialized");
  return dbConnection;
};

module.exports = {
  connectToDB,
  getDB,
};
