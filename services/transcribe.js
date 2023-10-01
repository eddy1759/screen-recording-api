const fs = require("fs");
const path = require("path");
const VideoModel = require("../model/video.model");
const logger = require("../config/logger");

async function transcribeAudio(filePath, videoId) {
  if (!fs.existsSync(filePath)) {
    return logger.info(`Audio output ${audioOutput} not found`);

  };
  const source = {
    buffer: fs.readFileSync(filePath),
    mimetype: "video/webm",
  };
  try {
    const { results } = await deepgramService.transcription.preRecorded(
      source,
      {
        smart_format: true,
        model: "nova",
      }
    );
    const transcribed = results?.channels[0].alternatives[0].transcript ?? null;

    // update transcript in the database
    const videoExists = await Video.findOne({
      videoId: videoId,
    });
    if (videoExists) {
      const filter = { videoId: videoId };
      const update = { transcript: transcribed };
      await VideoModel.findOneAndUpdate(filter, update);
      logger.info("Successfully updated transcript");
    }
  } catch (error) {
    logger.error("Error Transcribing Audio to Text: ", error);
  }
};

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
