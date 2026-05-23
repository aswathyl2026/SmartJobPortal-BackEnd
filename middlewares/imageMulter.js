const multer = require('multer')

const storage = multer.diskStorage({

    destination: (req, file, callback) => {

        callback(null, './uploads')

    },

    filename: (req, file, callback) => {

        callback(
            null,
            `profile-${Date.now()}-${file.originalname}`
        )

    }

})

const fileFilter = (req, file, callback) => {

    if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/jpg"
    ) {

        callback(null, true)

    }
    else {

        callback(null, false)

    }

}

const multerConfig = multer({

    storage,
    fileFilter

})

module.exports = multerConfig