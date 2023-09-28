const express = require('express');
const videoController = require('../controller/videoController');
const uploadController = require('../middleware/upload');

const router = express.Router();

router.post('/upload', uploadController, videoController.uploadVideoController);
router.get('/:videoFilename', videoController.getUploadedVideosController);

module.exports = router;