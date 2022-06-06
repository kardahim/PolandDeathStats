const express = require('express')
const router = express.Router()
const controller = require('../controllers/FileController')
const multer = require('multer')
var storage = multer.memoryStorage()
var upload = multer({ storage: storage,
    limits: { fileSize: 30 * 1024 * 2014, files: 1 }
})

router.post('/fill', controller.fill)

router.post('/restore', controller.restoreDefaultData)

router.post('/import', upload.single('file'), controller.import)

module.exports = router