const path = require('path'); 
require('dotenv').config({ path: path.join(__dirname, '../.env') });

module.exports = {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    DB_URL: process.env.DB_URL,
    CLOUDINARY_URL: process.env.CLOUDINARY_URL,
};
