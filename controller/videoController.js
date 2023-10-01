const fs = require('fs');
const path = require('path');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const config = require('../config/config');
const VideoModel = require('../models/video.model');
const { Asyncly, createFile, deleteFile, generateUniqueId, checkIfVideoExists, 
    setContentDisposition, handleRangeRequest,handleFullContent 
} = require('../utils/helper');
const { processVideoJob } = require('../services/process');

const startVideoStream  = Asyncly(async (req, res) => {
    const blobBuffer = req.files["blob"][0].buffer;
    const videoId = req.body.videoId;
    if (typeof blobBuffer === "undefined" || typeof videoId === "undefined") {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Request body is empty');
    }

    const videoExists = await checkIfVideoExists(videoId);
    if (!videoExists) {
        await VideoModel.create({ videoId });
    }

    const fileName = `${videoId}.webm`;
    const filePath = path.join(process.cwd(), 'videos');
    const videoPath = path.join(filePath, fileName);

    if (fs.existsSync(videoPath)) {
        createFile(filePath, fileName, "");
    }

    const videoStream = fs.createWriteStream(videoPath);
    videoStream.write(blobBuffer);
    res.status(httpStatus.OK).json({ status: true, msg: 'Video Streaming in progress' });
});

const stopVideoStream = Asyncly(async (req, res) => {
    const videoId = req?.params?.videoId;
    if (typeof videoId === "undefined") {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Video id is required');
    }

    const videoExists = await checkIfVideoExists(videoId);
    if (!videoExists) {
        res.status(httpStatus.NOT_FOUND).json({ status: false, msg: 'Video not found' });
    }

    const fileName = `${videoId}.webm`;
    const filePath = path.join(process.cwd(), 'videos');
    const videoPath = path.join(filePath, fileName);

    if (!fs.existsSync(videoPath)) {
      createFile(fileDir, fileName, "");
    }

    await processVideoJob(videoId);

    res.status(httpStatus.OK).json({ status: true, msg: 'Video Streaming stopped' });
});


const uploadVideoController = Asyncly(async (req, res) => {
    if (!req.body) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Request body is empty');
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
    setContentDisposition(res, videoFilename);

    const { range } = req.headers;
 
    if (range) {
        handleRangeRequest(req, res, videoFilePath);
    } else {
        handleFullContent(req, res, videoFilePath);
    }

    // fs.createReadStream(videoFilePath).pipe(res);
})


const getVideoById = Asyncly (async (req, res) => {
      const videoId = req.params.id;
      if (typeof videoId === "undefined") {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Video id is required');
      }
  
      // check if video exists
      const videoExists = helper.checkIfVideoExists(videoId);
  
      if (!videoExists) {
        return res.status(httpStatus.NOT_FOUND).json({ message: "Video not found." });
      }
  
      const videoPath = path.join(
        __dirname,
        "..",
        "/videos",
        `${videoId}.webm`
      );
  
      if (!fs.existsSync(videoPath)) {
        res.status(httpStatus.NOT_FOUND).json({ message: "Video no longer exists on the server" });
  
        await VideoModel.deleteOne({ vId: videoId });
        deleteFile(videoPath);
        return;
      }
  
      res.status(httpStatus).json({
        status: true,
        message: "Succesfully gotten video file",
        data: {
            id: videoExists.videoId,
            videoPath: `${config.BASE_URL}/media/files/${videoExists?.vId}.webm`,
            transcript: videoExists.transcript,
            createAt: videoExists.createdAt,
        },
      });
});
  
const getAllVideos = Asyncly(async (req, res) => {
    const allVideos = await Video.find();
    const updated =
    allVideos?.length > 0
        ? allVideos.map((d) => {
            return {
                videoId: d?.videoId,
                video: `${config.BASE_URL}/media/files/${d?.videoId}.webm`,
                createdAt: d?.createdAt,
            };
        })
        : [];

    res.status(httpStatus.OK).json({ 
        status: true, 
        message: "Video fetched successfully", 
        data: updated 
    });
})
  
module.exports = {
    startVideoStream,
    stopVideoStream,
    uploadVideoController,
    getUploadedVideosController,
    getVideoById,
    getAllVideos,
}