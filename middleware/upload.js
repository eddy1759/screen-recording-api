const multer = require('multer');
const httpStatus = require('http-status');
const helper = require('../utils/helper');
const path = require('path');
const ApiError = require('../utils/ApiError');


const uploadDir = path.join(__dirname, '../public/video');
const uniqueId = helper.generateUniqueId();

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const fileExtension = path.extname(file.originalname);
        cb(null, `${uniqueId}${fileExtension}`);
    },
});

const filter = (req, file, cb) =>    {
    const allowedMimes = ['video/mp4', 'video/x-m4v', 'video/quicktime', 'video/webm'];
    if (allowedMimes.includes(file.mimetype) || helper.isExecutable(file)) {
        cb(null, true);
    } else {
        cb(
            new ApiError(httpStatus.BAD_REQUEST, 'Invalid file type. Only mp4, m4v, quicktime and webm video files are allowed'),
            false
        );
    }
  
};


const limit = {
    fileSize: 50 * 1024 * 1024, 
};



const upload = multer({ storage: storage, fileFilter: filter, limits: limit });
const videoUpload = upload.single('video');

const handleFileUpload = (req, res, next) => {
    videoUpload(req, res, (err) => {
        if (err) {
            return res.status(httpStatus.BAD_REQUEST).json({
                error: 'Invalid file. Please ensure the file is in a valid format and within the size limit.',
            });
        }
        next();
    });
};


module.exports = {
    handleFileUpload, 
    uniqueId,
};
