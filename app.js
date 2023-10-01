const express = require('express');
const httpStatus = require('http-status');
const cors = require('cors');
const createError = require('http-errors');
const { errorConverter, errorHandler } = require('./middleware/error');
const { databaseConnection } = require('./config/connections');
const ApiRouter = require('./routes/index');

const app = express();

// CORS middleware (before defining routes)

databaseConnection();

app.use(cors());
app.options('*', cors());

// Parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Define your routes
app.use('/api', ApiRouter);

// Error handling middleware (after defining routes)
app.use((req, res, next) => {
    next(createError(httpStatus.NOT_FOUND, 'Not found'));
});

// Convert errors to ApiError
app.use(errorConverter);

// Handle errors
app.use(errorHandler);

module.exports = app;
