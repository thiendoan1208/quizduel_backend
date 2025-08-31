const express = require("express");
const { getDB } = require("../../config/db");
const { client } = require("../../config/redis");

const apiRoutes = express.Router();

module.exports = {
  apiRoutes,
};
