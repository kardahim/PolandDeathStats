const express = require('express')
const router = express.Router()
const controller = require('../controllers/PopulationController')

// Get all Populations
router.get("/", controller.getPopulations)

// Get Population by id
router.get("/:id", controller.getById)

// Get Populations by year
router.get("/year/:year", controller.getByYear)

// Get Populations by RegionId
router.get("/region/:regionid", controller.getByRegionId)

// Get Population by year and RegionId
router.get("/yearandregion/:year/:regionid", controller.getByYearAndRegionId)

module.exports = router