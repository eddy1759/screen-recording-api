const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const handleFileUpload = upload.fields([{ name: 'blob' }]);

module.exports = {
    handleFileUpload, 
};
