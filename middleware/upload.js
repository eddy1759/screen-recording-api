const multer = require('multer');
const httpStatus = require('http-status');
const helper = require('../utils/helper');
const path = require('path');
const ApiError = require('../utils/ApiError');

const uploadDir = path.join(__dirname, '../public/video');

const storage = multer.memoryStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = helper.getFileExtension(file.originalname);
        
        cb(null, `${uniqueSuffix}.${fileExtension}`);
    },
});


const upload = multer({ storage: storage });
const videoUpload = upload.single('video');

const handleFileUpload = (req, res, next) => {
    videoUpload(req, res, (err) => {
      if (err) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'unable to upload video');
      }
      next();
    });
  };

module.exports = handleFileUpload;
