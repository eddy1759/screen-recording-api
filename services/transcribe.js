const openai = require("../config/openai");
const fs = require("fs");
const path = require("path");
const Video = require("../model/Video");
const { createFile, deleteFile } = require("./file-manager");
const { sleep } = require("./");
const logger = require("../config/logger");

async function transcribeAudio(audioOutput, videoId) {
  try {
    if (!fs.existsSync(audioOutput)) {
        return logger.info(`Audio output ${audioOutput} not found`);
    
    }
    const transcript = await openai.audio.transcriptions.create({
      file: fs.createReadStream(audioOutput),
      model: "whisper-1",
    });

    // update transcript in the database
    const videoExists = await Video.findOne({
        videoId: videoId,
    });

    if (videoExists) {
      const filter = { videoId: videoId };
      const update = { transcript: transcript?.text };
      await Video.findOneAndUpdate(filter, update);

      logger.info("Successfully Transcribed");
    } else {
      console.log("Failed updating transcript, Video doesn't exist.");
    }
  } catch (error) {
    logger.error('Error Transcribing Audio to Text: ', error);
  }
}


async function ProcessScreenRecordingVideos(videoId) {
  const input = path.join(__dirname, "..", "storage/videos", `${videoId}.webm`);

  if (!fs.existsSync(input)) {
    console.log("Input file does not exist", { input });
    return;
  }
  // Generate transcript
  await transcribeAudio(input, videoId);
}

module.exports = {
  transcribeAudio,
  ProcessScreenRecordingVideos,
};
