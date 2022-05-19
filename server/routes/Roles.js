const express = require('express')
const router = express.Router()
const { Role } = require("../db/models")

// Get all Roles
router.get("/", async (req, res) => {
    const roles = await Role.findAll();
    res.json(roles);
});

// Get Role by id
router.get("/:id", async (req, res) => {
    const id = req.params.id
    const role = await Role.findByPk(id);
    res.json(role);
});

// Get Role by name
router.get("/name/:name", async (req, res) => {
    const name = req.params.name
    const role = await Role.findOne({where: {name: name}});
    res.json(role);
});

module.exports = router