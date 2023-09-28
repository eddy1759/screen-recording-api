
function generateUniqueId() {
    return Date.now().toString();
}


function getFileExtension(filename) {
    const parts = filename.split('.');
    return parts[parts.length - 1];
}

const Asyncly = (fn) => (req, res, next) => {
	Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};


module.exports = {
    generateUniqueId,
    getFileExtension,
    Asyncly,
};