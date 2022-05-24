const express = require('express')
const router = express.Router()
const controller = require('../controllers/RegionController')

// get all Regions
router.get("/", controller.getRegions)

// Get Region by id
router.get("/:id", controller.getById)

// Get Region by name
router.get("/name/:name", controller.getByName)

module.exports = router