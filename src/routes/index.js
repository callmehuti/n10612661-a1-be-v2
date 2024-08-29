const express = require("express");
const routes = express.Router();
const userRoute = require("./user");
const fileRoute = require("./file");


routes.use("/user", userRoute);
routes.use("/file", fileRoute);

module.exports = routes;
