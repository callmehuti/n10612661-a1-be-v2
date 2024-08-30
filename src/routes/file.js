const express = require("express");
const {
  getAllFileController,
  generateFileController,
  uploadFileController,
  downloadFileController,
  handleDownloadFileController,
  streamController,
  deleteFileController,
  addRelativeInfoController,
  editRelativeInfoController,
  getFileInfoController,
} = require("../controllers/file.controller");
const authorize = require("../middleware/authorize.middleware");
const upload = require("../middleware/upload.middleware");
const file = express.Router();

file.get("/download", authorize, downloadFileController);
file.get("/generate", authorize, generateFileController);
file.get("/handleDownload", authorize, handleDownloadFileController);
file.post("/upload", authorize, upload.single("file"), uploadFileController);
file.get("/getAll", authorize, getAllFileController);
file.get("/stream", streamController);
file.delete("/remove", authorize, deleteFileController);
file.put("/editRelativeInfo", authorize, editRelativeInfoController);
file.post("/addRelativeInfo", authorize, addRelativeInfoController);
file.get("/getFileInfo", authorize, getFileInfoController);

module.exports = file;
