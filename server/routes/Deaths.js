const express = require('express')
const router = express.Router()
const { Death } = require("../db/models")

// Get all Deaths
router.get("/", async (req, res) => {
    const listOfPopulations = await Population.findAll();
    res.json(listOfPopulations);
});

// Get Death by id
router.get("/:id", async (req, res) => {
    const id = req.params.id
    const death = await Death.findByPk(id);
    res.json(death);
});

// Get Deaths by year
router.get("/year/:year", async (req, res) => {
    const year = req.params.year
    const deaths = await Death.findAll({where: {year: year}});
    res.json(deaths);
});

// Get Deaths by RegionId
router.get("/region/:regionid", async (req, res) => {
    const regionid = req.params.regionid
    const deaths = await Death.findAll({where: {RegionId: regionid}});
    res.json(deaths);
});

// Get Deaths by DeathCauseId
router.get("/deathcause/:deathcauseid", async (req, res) => {
    const deathcauseid = req.params.deathcauseid
    const deaths = await Death.findAll({where: {DeathCauseId: deathcauseid}});
    res.json(deaths);
});

// Get Death by year, RegionId and DeathCauseId
router.get("/yrdc/:year/:regionid/:deathcauseid", async (req, res) => {
    const year = req.params.year
    const regionid = req.params.regionid
    const deathcauseid = req.params.deathcauseid
    const deaths = await Death.findOne({where: {year: year, RegionId: regionid, DeathCauseId: deathcauseid}});
    res.json(deaths);
});

module.exports = router