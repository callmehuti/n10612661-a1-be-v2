const express = require("express");
const {
  loginController,
  registerController,
  profileController,
} = require("../controllers/user.controller");
const authorize = require("../middleware/authorize.middleware");
const user = express.Router();

user.post("/login", loginController);
user.post("/register", registerController);
user.get("/profile", authorize, profileController);

module.exports = user;
