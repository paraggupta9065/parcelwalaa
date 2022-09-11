
const multer = require("multer");
const multerStorage = multer.diskStorage({
    filename: (req, file, cb) => {
        const ext = file.mimetype.split("/")[1];
        cb(null, `${file.fieldname}-${Date.now()}.${"png"}`);
    },
});

const multerMod = multer({ storage: multerStorage, })
module.exports = multerMod;
