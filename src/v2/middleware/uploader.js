const multer = require('multer')

const maxSize = 1024 * 1024
const storage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, './src/uploads')
    },
    filename : (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
})

const upload = multer({storage : storage}, {fileSize : maxSize})
module.exports = {upload}