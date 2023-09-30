const express = require('express');
const videoController = require('../controller/videoController');
const { handleFileUpload } = require('../middleware/upload');
const limiter = require('../middleware/Limiter');

const router = express.Router();

router.post('/', handleFileUpload, videoController.uploadVideoController);
router.get('/:videoFilename', videoController.getUploadedVideosController);

module.exports = router; 
