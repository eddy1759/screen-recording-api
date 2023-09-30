const helper = require('../utils/helper');
const { Asyncly } = require('../utils/helper');
const ApiError = require('../utils/ApiError');
const path = require('path');
const httpStatus = require('http-status');
const fs = require('fs');
const { generateUniqueId } = require('../utils/helper');

const uploadVideoController = Asyncly(async (req, res) => {
    const { videoFile } = req.body;

    if (!videoFile) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Video file is required');
    }
    const videoFileName = await generateUniqueId();

    const uploadDir = path.join(__dirname, '../public/video');

    const savePath = path.join(uploadDir, videoFileName);

    const writeStream = fs.createWriteStream(savePath);

    req.on('data', (chunk) => {
        
        writeStream.write(chunk);
    });

    req.on('end', () => {
        writeStream.end();

        res.status(201).json({ 
            status: true, 
            id: videoFileName.split('.')[0],
            msg: 'Video Uploaded Successful' });
    });
})



const getUploadedVideosController = Asyncly(async (req, res) => {
    const videoFilename = req.params.id;
 
    if (!videoFilename) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Video filename is required');
    }
    const dirPath = path.join(__dirname, '../public/video');

    const videoFilePath = path.join(dirPath, videoFilename);

    if (!fs.existsSync(videoFilePath)) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Video not found');
    }

    // res.setHeader('Content-Type', 'video/mp4');
    helper.setContentDisposition(res, videoFilename);

    const { range } = req.headers;
 
    if (range) {
        helper.handleRangeRequest(req, res, videoFilePath);
    } else {
        helper.handleFullContent(req, res, videoFilePath);
    }

    // fs.createReadStream(videoFilePath).pipe(res);
})

module.exports = {
    uploadVideoController,
    getUploadedVideosController,
}