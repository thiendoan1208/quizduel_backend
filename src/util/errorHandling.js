const { config } = require("dotenv");
config();

const criticalError = (message) => {
  console.error(message);

  if (process.env.NODE_ENV === "production") {
    process.exit(1);
  }
};

const errorResponse = (res, errorCode, error) => {
  return res.status(errorCode).json(error);
};

module.exports = {
  criticalError,
  errorResponse,
};
