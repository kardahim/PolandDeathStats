const { DeathCause } = require("../db/models")

module.exports = {
    // get all DeathCauses
    getDeathCauses: async (req, res) => {
        const listOfDeathCauses = await DeathCause.findAll();
        res.json(listOfDeathCauses);
    },
    // get DeathCause /w specific id
    getById: async (req, res) => {
        const id = req.params.id
        const deathCause = await DeathCause.findByPk(id);
        res.json(deathCause);
    }
}