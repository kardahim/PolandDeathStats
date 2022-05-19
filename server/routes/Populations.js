const express = require('express')
const router = express.Router()
const { Population } = require("../db/models")

// Get all Populations
router.get("/", async (req, res) => {
    const listOfPopulations = await Population.findAll();
    res.json(listOfPopulations);
});

// Get Population by id
router.get("/:id", async (req, res) => {
    const id = req.params.id
    const population = await Population.findByPk(id);
    res.json(population);
});

// Get Populations by year
router.get("/year/:year", async (req, res) => {
    const year = req.params.year
    const populations = await Population.findAll({where: {year: year}});
    res.json(populations);
});

// Get Populations by RegionId
router.get("/region/:regionid", async (req, res) => {
    const regionid = req.params.regionid
    const populations = await Population.findAll({where: {RegionId: regionid}});
    res.json(populations);
});

// Get Population by year and RegionId      // jakoś ładniej można tą ścieżkę nazwać, żeby było krócej, ale na razie niczego innego nie wymyślałem xd
router.get("/yearandregion/:year/:regionid", async (req, res) => {
    const year = req.params.year
    const regionid = req.params.regionid
    const population = await Population.findOne({where: {year: year, RegionId: regionid}});
    res.json(population);
});

module.exports = router