const fs = require('fs');
const path = require('path');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const config = require('../config/config');
const VideoModel = require('../model/video.model');
const { Asyncly, deleteFile, generateUniqueId, checkIfVideoExists, 
    setContentDisposition, handleRangeRequest,handleFullContent 
} = require('../utils/helper');
const { processVideoJob } = require('../services/process');
const logger = require('../config/logger');

const startVideoStream = Asyncly(async (req, res) => {
    const fileName = generateUniqueId();
    const filePath = path.join(process.cwd(), 'videos');
    const videoPath = path.join(filePath, fileName);

    const videoStream = fs.createWriteStream(videoPath);
    
    req.on('data', (chunk) => {
        videoStream.write(chunk);
        logger.info("video streaming..........") 
    });

    req.on('end', async () => {
        videoStream.end();
        await processVideoJob(videoId);
        logger.info('Video streaming ended......');
        res.status(httpStatus.OK).json({ status: true, videoId: fileName.split('.')[0],
            msg: 'Video Streaming started' })
    });
});


const getVideoById = Asyncly (async (req, res) => {
      const videoId = req.params.id;
      if (!videoId) {
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
            videoPath: `${config.BASE_URL}/media/files/${videoExists.videoId}.webm`,
            transcript: videoExists.transcript,
            createAt: videoExists.createdAt,
        },
      });
});
  
const getAllVideos = Asyncly(async (req, res) => {
    const Videos = await Video.find();
        
    const videoFile = VideoModel.map((video) => ({
        videoId:video.videoId,
        video: `${config.BASE_URL}/media/files/${video.videoId}.webm`,
        createdAt: video.createdAt,
    }));
    
    res.status(httpStatus.OK).json({ 
        status: true, 
        message: "Video fetched successfully", 
        data: videoFile 
    });
});

const getUploadedVideosController = Asyncly(async (req, res) => {
    const videoId = req.params.videoId;
 
    if (!videoId) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Video filename is required');
    }
    const fileName = `${videoId}.webm`;
    const filePath = path.join(process.cwd(), 'videos');
    const videoPath = path.join(filePath, fileName);

    if (!fs.existsSync(videoPath)) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Video not found');
    }

    // res.setHeader('Content-Type', 'video/mp4');
    setContentDisposition(res, fileName);

    const { range } = req.headers;
 
    if (range) {
        handleRangeRequest(req, res, videoPath);
    } else {
        handleFullContent(req, res, videoPath);
    }

    // fs.createReadStream(videoFilePath).pipe(res);
})

  
module.exports = {
    startVideoStream,
    getUploadedVideosController,
    getVideoById,
    getAllVideos,
}