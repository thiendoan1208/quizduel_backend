const { verifyToken } = require("../config/jwt");
const { getSession } = require("../db/users");
const { errorResponse } = require("../util/errorHandling");

const isSessionValidate = async (req, res, next) => {
  try {
    const session = req.cookies.sessionToken;
    const isJWTValidate = verifyToken(session);

    if (isJWTValidate) {
      const response = await getSession(session);

      if (response.status === "Valid") {
        next();
      } else {
        errorResponse(res, response.code, response.message);
      }
    } else {
      errorResponse(res, 404, "Cannot verify session token.");
    }
  } catch (error) {
    console.error(error);
    errorResponse(res, 500, "Cannot get session, server error.");
  }
};

module.exports = {
  isSessionValidate,
};
