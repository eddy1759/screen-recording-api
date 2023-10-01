const { Agenda } = require("@hokify/agenda");
const config = require("../config/config");
const { ProcessScreenRecordingVideos } = require("../helper/video");
const logger = require("../config/logger");

const agenda = new Agenda({
  db: {
    address: config.AGENDA_MONGO_URL,
  },
});

async function processVideoJob(job, done) {
  try {
    const { videoId } = job.attrs.data;
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
