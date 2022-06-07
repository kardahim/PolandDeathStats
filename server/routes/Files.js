const express = require('express')
const router = express.Router()
const controller = require('../controllers/FileController')
const multer = require('multer')
const { validateAdmin } = require('../middlewares/AuthMiddleware')
var storage = multer.memoryStorage()
var upload = multer({ storage: storage,
    limits: { fileSize: 30 * 1024 * 2014, files: 1 }
})

// post database fill request (fills database with default data)
router.post('/fill',validateAdmin, controller.fill)

// post database restore request ( fills db with default data)
router.post('/restore',validateAdmin, controller.restoreDefaultData)

// post file with import data
router.post('/import',validateAdmin, upload.single('file'), controller.import)

module.exports = router