const mongoose = require("mongoose");
const { Agenda } = require("@hokify/agenda");
const OpenAI = require("openai");
const config = require("./config");
const logger = require("./logger");

const databaseConnection = async () => {
    mongoose.set('strictQuery', false)

    await mongoose.connect(config.DB_URL);

    mongoose.connection.on("connected", () => {
        logger.info("Database connected successfully")
    })

    mongoose.connection.on("error", (error) => {
        logger.error("An error occurred", error)
    })
};

const agenda = new Agenda({
    db: {
      address: config.AGENDA_URL,
    },
});

const openai = new OpenAI({
    apiKey: config.OPENAI_KEY,
});

module.exports = {
    databaseConnection,
    agenda,
    openai,
};


