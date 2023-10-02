const fs = require('fs');
const path = require('path');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const config = require('../config/config');
const VideoModel = require('../model/video.model');
const { Asyncly, createFile, deleteFile, generateUniqueId, checkIfVideoExists, 
    setContentDisposition, handleRangeRequest,handleFullContent 
} = require('../utils/helper');
const { processVideoJob } = require('../services/process');

const startVideoStream = Asyncly(async (req, res) => {
    try {
        // const videoId = req.body.videoId;
        // if (typeof videoId === "undefined") {
        //     throw new ApiError(httpStatus.BAD_REQUEST, 'Video ID is missing in the request');
        // }

        const fileName = generateUniqueId();
        const filePath = path.join(process.cwd(), 'videos');
        const videoPath = path.join(filePath, fileName);

        // Create a writable stream to save the video data
        const videoStream = fs.createWriteStream(videoPath);

        // Listen for data events from the request stream
        req.on('data', (chunk) => {
            videoStream.write(chunk);
            console.log("video streaming..........") // Write the incoming data chunk to the video stream
        });

        // Listen for the end event when streaming is complete
        req.on('end', () => {
            videoStream.end(); // Close the video stream
            console.log('Video streaming ended......');
            res.status(httpStatus.OK).json({ status: true, videoId: fileName.split('.')[0],
                msg: 'Video Streaming started' })
        });
    } catch (error) {
        console.error(error);
    }
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
    console.log('Video processing started......')
    // res.status(httpStatus.OK).json({ status: true, msg: 'Video Streaming stopped' });
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
            videoPath: `${config.BASE_URL}/media/files/${videoExists?.videoId}.webm`,
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
    getUploadedVideosController,
    getVideoById,
    getAllVideos,
}