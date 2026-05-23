const multer = require('multer')

const storage = multer.diskStorage({

    destination: (req, file, callback) => {

        callback(null, "./uploads")
    },

    filename: (req, file, callback) => {

        callback(null, `cv-${Date.now()}-${file.originalname}`)
    }
})

const fileFilter = (req, file, callback) => {

    if (file.mimetype === "application/pdf") {

        callback(null, true)

    } else {

        callback(new Error("Only PDF files allowed"), false)
    }
}

const multerMiddleware = multer({

    storage,
    fileFilter
})

module.exports = multerMiddleware