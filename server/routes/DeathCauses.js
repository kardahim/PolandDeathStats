const express = require('express')
const router = express.Router()
const controller = require('../controllers/DeathCauseController')

// Get all DeathCauses
router.get("/", controller.getDeathCauses)

// Get DeathCause by id
router.get("/:id", controller.getById)

module.exports = router