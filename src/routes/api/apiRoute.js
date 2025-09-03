const express = require("express");
const { createNewUser, getUser } = require("../../controllers/userController");
const { isSessionValidate } = require("../../middleware/checkSession");

const apiRoutes = express.Router();

// user
apiRoutes.post("/user", createNewUser);
apiRoutes.get("/user", isSessionValidate, getUser);

module.exports = {
  apiRoutes,
};
