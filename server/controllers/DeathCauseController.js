const { DeathCause } = require("../db/models")

module.exports = {
    // get DeathCauses
    getDeathCauses: async (req, res) => {
        const listOfDeathCauses = await DeathCause.findAll();
        res.json(listOfDeathCauses);
    },

    getById: async (req, res) => {
        const id = req.params.id
        const deathCause = await DeathCause.findByPk(id);
        res.json(deathCause);
    }
}