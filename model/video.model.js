const mongoose = require("mongoose");

const { Schema } = mongoose;

const videoSchema = new Schema({
    videoId: { 
        type: String, 
        required: true 
    },
    transcript: { 
        type: String, 
        required: false 
    },
  createdAt: { 
        type: Date, 
        default: Date.now 
    },
});

const VideoModel = mongoose.model("Video", videoSchema);
module.exports = VideoModel;