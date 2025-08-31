const { config } = require("dotenv");
config();

const criticalError = (message) => {
  console.error(message);

  if (process.env.NODE_ENV === "production") {
    process.exit(1);
  }
};

module.exports = {
  criticalError,
};
