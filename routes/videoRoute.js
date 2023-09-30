const express = require('express');
const videoController = require('../controller/videoController');
const { handleFileUpload } = require('../middleware/upload');


const router = express.Router();

router.post('/', handleFileUpload, videoController.uploadVideoController);
router.get('/:id', videoController.getUploadedVideosController);

module.exports = router; 
