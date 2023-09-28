const fs = require('fs');
const helper = require('../utils/helper');
const path = require('path');
const logger = require('../config/logger');

const dirPath = path.join(__dirname, '../public/video');

async function saveVideo(fileBuffer) {
  if (!fs.existsSync(dirPath)) {
    await fs.promises.mkdir(dirPath, { recursive: true });
  }
  const id = helper.generateUniqueId();
  const filename = `${id}.mp4`;
  const filePath = path.join(dirPath, filename);

  try {
    if (!Buffer.isBuffer(fileBuffer)) {
      throw new Error('fileBuffer must be a Buffer');
    }

    await fs.promises.writeFile(filePath, fileBuffer);
    return filename;
  } catch (error) {
    logger.error(`Error saving video: ${error.message}`);
    throw error;
  }
}


module.exports = {
  saveVideo,
};
