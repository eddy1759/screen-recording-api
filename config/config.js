const path = require('path'); 
require('dotenv').config({ path: path.join(__dirname, '../.env') });

module.exports = {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    DB_URL: process.env.MONGO_DB,
    AGENDA_URL: process.env.AGENDA_MONGO_URL,
    BASE_URL: process.env.BASE_URL,
    OPENAI_KEY: process.env.OPENAI_APIkEY,
    deepgramApiKey: process.env.DEEP_GRAM_API_KEY,
};