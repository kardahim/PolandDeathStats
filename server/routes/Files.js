const express = require('express')
const router = express.Router()
const controller = require('../controllers/FileController')
const multer = require('multer')
var storage = multer.memoryStorage()
var upload = multer({ storage: storage,
    limits: { fileSize: 30 * 1024 * 2014, files: 1 }
})

// post database fill request (fills database with default data)
router.post('/fill', controller.fill)

// post database restore request ( fills db with default data)
router.post('/restore', controller.restoreDefaultData)

// post file with import data
router.post('/import', upload.single('file'), controller.import)

module.exports = router