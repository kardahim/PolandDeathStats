const express = require('express')
const router = express.Router()
const controller = require('../controllers/DeathController')

// Get all Deaths
router.get("/", controller.getDeaths)

// Get Death by id
router.get("/:id", controller.getById)

// Get Deaths by year
router.get("/year/:year", controller.getByYear)

// Get Deaths by RegionId
router.get("/region/:regionid", controller.getByRegionId)

// Get Deaths by DeathCauseId
router.get("/deathcause/:deathcauseid", controller.getBydeathCauseId)

// Get Death by year, RegionId and DeathCauseId
router.get("/yrdc/:year/:regionid/:deathcauseid", controller.getByYearRegionIdAndDeathCaudeId)

module.exports = router