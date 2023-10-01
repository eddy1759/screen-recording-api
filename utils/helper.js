const moment = require('moment');
const fs = require('fs');
const httpStatus = require('http-status');
const logger = require('../config/logger');
const VideoModel = require('../model/video.model');

function generateUniqueId() {
    const formattedDateTime = moment().format('YYMMDD');
    const uniqueId = Math.random().toString(36).substring(7);
    return `${formattedDateTime}_${uniqueId}.webm`;
}

const Asyncly = (fn) => (req, res, next) => {
	Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};

const setContentDisposition = (res, filename) => {
    const contentDisposition = `inline; filename="${filename}"`;
    res.setHeader('Content-Disposition', contentDisposition);
}

const handleRangeRequest = (req, res, videoPath) => {
    const { range } = req.headers;
    const fileStats = fs.statSync(videoPath);
    const fileSize = fileStats.size;

    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunkSize = (end - start) + 1;

    res.status(httpStatus.PARTIAL_CONTENT);
    res.setHeader('Content-Range', `bytes ${start}-${end}/${fileSize}`);
    res.setHeader('Content-Length', chunkSize);

    const fileStream = fs.createReadStream(videoPath, { start, end });
    fileStream.pipe(res);
};

const handleFullContent = (req, res, videoPath) => {
    const fileStats = fs.statSync(videoPath);
    const fileSize = fileStats.size;

    res.setHeader('Content-Length', fileSize);
    res.setHeader('Content-Type', 'video/mp4');

    const fileStream = fs.createReadStream(videoPath);
    fileStream.pipe(res);
};

function createFile(destPath, fileName, content) {
    try {
      if (!fs.existsSync(destPath)) {
        logger.error(`Failed to create file, destination path doesn't exist.`);
        return false;
      }
      const file = `${destPath}/${fileName}`;
      fs.writeFileSync(file, content);
      return true;
    } catch (e) {
        logger.error(`Failed to create file: ${e.message}`);
        return false;
    }
};

function deleteFile(file) {
    if (!fs.existsSync(file)) {
        logger.info(`Failed to delete file: ${file}`);
    } else {
      fs.unlinkSync(file);
    }
  }

const checkIfVideoExists = async (videoId) => {
    const video = await VideoModel.findOne({ videoId });
    if (video) {
        return true;
    }
    return false;
};

module.exports = {
    generateUniqueId,
    Asyncly,
    setContentDisposition,
    handleRangeRequest,
    handleFullContent,
    createFile,
    deleteFile,
    checkIfVideoExists,
};