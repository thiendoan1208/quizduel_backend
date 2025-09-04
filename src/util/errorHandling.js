const { config } = require("dotenv");
config();

const criticalError = (message) => {
  console.error(message);

  if (process.env.NODE_ENV === "production") {
    process.exit(1);
  }
};

const errorResponse = (res, errorCode, message, data = null) => {
  console.log(errorCode)
  return res.status(Number(errorCode)).json({
    success: false,
    message,
    data,
  });
};

module.exports = {
  criticalError,
  errorResponse,
};
