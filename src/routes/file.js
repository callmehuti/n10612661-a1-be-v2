const express = require("express");
const {
  getAllFile,
  generateFile,
  uploadFile,
  downloadFile,
  handleDownloadFile,
} = require("../controllers/file.controller");
const authorize = require("../middleware/authorize.middleware");
const upload = require("../middleware/upload.middleware");
const file = express.Router();

file.get("/download", authorize, downloadFile);
file.get("/generate", authorize, generateFile);
file.get("/handleDownload", authorize, handleDownloadFile);
file.post("/upload", authorize, upload.single("file"), uploadFile);
file.get("/getAll", authorize, getAllFile);

module.exports = file;
