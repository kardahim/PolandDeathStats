const express = require('express')
const router = express.Router()
const { Region } = require("../db/models")

// Get all Regions
router.get("/", async (req, res) => {
    const listOfRegions = await Region.findAll();
    res.json(listOfRegions);
});

// Get Region by id
router.get("/:id", async (req, res) => {
    const id = req.params.id
    const region = await Region.findByPk(id);
    res.json(region);
});

// Get Region by name
router.get("/name/:name", async (req, res) => {
    const name = req.params.name
    const region = await Region.findOne({where: {name: name}});
    res.json(region);
});

module.exports = router