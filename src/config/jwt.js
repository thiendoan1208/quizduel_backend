const jwt = require("jsonwebtoken");
const { config } = require("dotenv");
config();

const createJWT = (payload, option) => {
  try {
    const token = jwt.sign(payload, process.env.JWT_SECRET, option);
    return token;
  } catch (error) {
    console.error(error);
  }
};

const verifyToken = (token) => {
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    return decode;
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  createJWT,
  verifyToken,
};
