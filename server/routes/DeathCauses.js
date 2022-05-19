const express = require('express')
const router = express.Router()
const { DeathCause } = require("../db/models")

// Get all DeathCauses
router.get("/", async (req, res) => {
    const listOfDeathCauses = await DeathCause.findAll();
    res.json(listOfDeathCauses);
});

// Get DeathCause by id
router.get("/:id", async (req, res) => {
    const id = req.params.id
    const deathCause = await DeathCause.findByPk(id);
    res.json(deathCause);
});

// Get DeathCause by name
//  raczej nie będzie potrzebne

module.exports = router