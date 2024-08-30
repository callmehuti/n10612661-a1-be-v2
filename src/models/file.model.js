const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FileModel = new Schema({
  username: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  mimeType: {
    type: String,
    required: true
  },
  relativeInfo: [],
  qualities: [],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("file", FileModel);
