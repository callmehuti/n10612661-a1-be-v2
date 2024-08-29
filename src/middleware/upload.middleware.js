const multer = require("multer");
const fs = require("fs");
const { extname } = require("path");

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const username = req.username;
    if(!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads');
    }
    const path = `uploads/${username}`;
    console.log(path);
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }
    cb(null, path);
  },
  filename: (req, file, cb) => {
    console.log(file.originalname);
    const extension = extname(file.originalname);
    cb(null, Date.now() + extension);
  },
});

// Create the multer instance
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(mp4|mov|mkv|avi)$/)) {
      return cb(new Error("Video not allow!"), false);
    }
    return cb(null, true);
  },
});

module.exports = upload;
