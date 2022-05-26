const { Death } = require("../db/models")

module.exports = {
    // get all Deaths
    getDeaths: async (req, res) => {
        const deaths = await Death.findAll();
        res.json(deaths);
    },

    // get Deaths by id
    getById: async (req, res) => {
        const id = req.params.id
        const death = await Death.findByPk(id);
        res.json(death);
    },

    // get deaths by year
    getByYear: async (req, res) => {
        const year = req.params.year
        const deaths = await Death.findAll({ where: { year: year } });
        res.json(deaths);
    },
    // Get Deaths by RegionId
    getByRegionId: async (req, res) => {
        const regionid = req.params.regionid
        const deaths = await Death.findAll({ where: { RegionId: regionid } });
        res.json(deaths);
    },

    // get Deaths by DeathCauseId
    getBydeathCauseId: async (req, res) => {
        const deathcauseid = req.params.deathcauseid
        const deaths = await Death.findAll({ where: { DeathCauseId: deathcauseid } });
        res.json(deaths);
    },

    // get Deaths by Year, RegionId and DeathCauseId
    getByYearRegionIdAndDeathCauseId: async (req, res) => {
        const year = req.params.year
        const regionid = req.params.regionid
        const deathcauseid = req.params.deathcauseid
        const deaths = await Death.findOne({ where: { year: year, RegionId: regionid, DeathCauseId: deathcauseid } });
        res.json(deaths);
    }
}