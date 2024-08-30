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

const removeFileService = async (username, fileName) => {
  try {
    await fileModel.deleteOne({ username, fileName });
  } catch (error) {
    throw error;
  }
}

const addRelativeInfoService = async (username, fileName, info) => {
  const file = await getFileInfoService(username, fileName);

  const fileUpdated = await fileModel.findOneAndUpdate(
    { username, fileName },
    { relativeInfo: [...file.relativeInfo, info ] },
    { new: true }
  );
  return fileUpdated;
}

const editRelativeInfoService = async (username, fileName, data) => {
  const fileUpdated = await fileModel.findOneAndUpdate(
    { username, fileName },
    { relativeInfo: data },
    { new: true }
  );
  return fileUpdated;
}

module.exports = {
  getAllService,
  uploadFileService,
  updateFileService,
  getFileInfoService,
  removeFileService,
  addRelativeInfoService,
  editRelativeInfoService
};
