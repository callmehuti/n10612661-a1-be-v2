const fileModel = require("../../models/file.model");
const { findOne } = require("../../models/user.model");

const getAllService = async (username) => {
  try {
    const files = await fileModel.find({ username });
    return files;
  } catch (error) {
    throw error;
  }
};

const getFileInfoService = async (username, fileName) => {
  try {
    const file = await fileModel.findOne({ username, fileName });
    return file;
  } catch (error) {
    throw error;
  }
};

const updateFileService = async (username, fileName, qualities) => {
  try {
    const file = await getFileInfoService(username, fileName);

    const fileUpdated = await fileModel.findOneAndUpdate(
      { username, fileName },
      { qualities: [...file.qualities, ...qualities ] },
      { new: true }
    );
    return fileUpdated;
  } catch (error) {
    throw error;
  }
};

const uploadFileService = async (username, fileName, mimeType) => {
  try {
    const newFile = new fileModel({ username, fileName, mimeType });
    await newFile.save();
    return newFile;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllService,
  uploadFileService,
  updateFileService,
  getFileInfoService,
};
