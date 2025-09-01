const express = require("express");
const { createNewUser } = require("../../controllers/userController");

const apiRoutes = express.Router();

// user
apiRoutes.post("/user", createNewUser);

module.exports = {
  apiRoutes,
};
