const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const handleFileUpload = upload.fields([{ name: 'blob' }, { name: 'videoId' }]);

module.exports = {
    handleFileUpload, 
};
