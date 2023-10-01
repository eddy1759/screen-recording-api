const express = require('express');
const videoController = require('../controller/videoController');
const { handleFileUpload } = require('../middleware/upload');


const router = express.Router();

// router.post('/', videoController.uploadVideoController);
router.post( "/start", handleFileUpload, videoController.startVideoStream );
router.get("/end/:videoId", videoController.stopVideoStream);
router.get("/:id", videoController.getVideoById);
router.get("/", videoController.getAllVideos);

router.get('/stream/:id', videoController.getUploadedVideosController);

module.exports = router; 