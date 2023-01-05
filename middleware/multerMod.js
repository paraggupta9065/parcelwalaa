
const { storage } = require("firebase-admin");
const multer = require("multer");
const multerStorage = multer.diskStorage({
    filename: (req, file, cb) => {
        const ext = file.mimetype.split("/")[1];
        cb(null, `${file.fieldname}-${Date.now()}.${"png"}`);
    },
    destination: function (req, file, cb) {
        cb(null, "./uploads");
    },
    // limits: { fieldSize: 25 * 1024 * 1024 }
});

const multerMod = multer({ storage: multerStorage });
module.exports = multerMod;
