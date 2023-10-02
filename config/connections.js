const mongoose = require("mongoose");
const { Agenda } = require("@hokify/agenda");
// const OpenAI = require("openai");
const { Deepgram } = require("@deepgram/sdk");
const config = require("./config");


const databaseConnection = () => {
    mongoose.connect(config.DB_URL);

    mongoose.connection.on("connected", () => {
        console.info("Database connected successfully")
    })

    mongoose.connection.on("error", (error) => {
        console.error("An error occurred", error)
    })
};

const agenda = new Agenda({
    db: {
      address: config.AGENDA_URL,
    },
});

const deepgramService = new Deepgram(config.deepgramApiKey);



module.exports = {
    databaseConnection,
    agenda,
    deepgramService,
};


