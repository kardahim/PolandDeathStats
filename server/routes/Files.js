const express = require('express')
const router = express.Router()
const controller = require('../controllers/FileController')

router.post('/fill', controller.fill)

module.exports = router