const { agenda } = require("../config/connections");
const { ProcessScreenRecordingVideos } = require("./transcribe");
const logger = require("../config/logger");

async function processVideoJob(job, done) {
  try {
    const { videoPath, videoId } = job.attrs.data;
    await ProcessScreenRecordingVideos(videoId);
    done();
  } catch (error) {
    logger.info('Error processing recorded video', error);
    done();
  }
}

agenda.define("process_video", processVideoJob, { concurrency: 10, priority: "high" });

agenda.on("start", (job) => {
  logger.info("Job %s starting", job.attrs.name);
});

module.exports = {
  agenda,
  processVideoJob,
};
