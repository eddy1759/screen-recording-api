const moment = require('moment');
const path = require('path');
const fs = require('fs');
const httpStatus = require('http-status');

function generateUniqueId() {
    const formattedDateTime = moment().format('YYMMDD');
    const uniqueId = Math.random().toString(36).substring(7);
    return `${formattedDateTime}_${uniqueId}.mp4`;
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
}

module.exports = {
    generateUniqueId,
    Asyncly,
    setContentDisposition,
    handleRangeRequest,
    handleFullContent,
};