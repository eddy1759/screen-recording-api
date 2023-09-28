const videoService = require('../services/videoService');
const { Asyncly } = require('../utils/helper');
const ApiError = require('../utils/ApiError');
const path = require('path');
const httpStatus = require('http-status');
const fs = require('fs');

const uploadVideoController = Asyncly(async (req, res) => {
    
    const videoFile = req.file.buffer;

    if (!videoFile) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Video file is required');
    }

    const videoFilename = await videoService.saveVideo(videoFile); 

    if (!videoFilename) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error saving the video');
    }

    res.status(201).json({ status: true, msg: 'Video Uploaded Successful' });
})

const getUploadedVideosController = Asyncly(async (req, res) => {
    const videoFilename = req.params.videoFilename;

    if (!videoFilename) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Video filename is required');
    }
    const dirPath = path.join(__dirname, '../public/video');
    const videoFilePath = path.join(dirPath, videoFilename);

    if (!fs.existsSync(videoFilePath)) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Video not found');
    }

    res.setHeader('Content-Type', 'video/mp4');

    fs.createReadStream(videoFilePath).pipe(res);
})

module.exports = {
    uploadVideoController,
    getUploadedVideosController,
}