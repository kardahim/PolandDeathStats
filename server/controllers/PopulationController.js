const { Population, sequelize } = require("../db/models")
const { Transaction } = require('sequelize');

module.exports = {
    // get all Populations
    getPopulations: async (req, res) => {
        const trans = await sequelize.transaction({
            isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE
        });
        try {
            const listOfPopulations = await Population.findAll({ transaction: trans });
            res.json(listOfPopulations);
            trans.commit()
        }
        catch (e) {
            await trans.rollback();
        }
    },
    // get Populations by id
    getById: async (req, res) => {
        const id = req.params.id
        const population = await Population.findByPk(id);
        res.json(population);
    },
    // get Populations by year
    getByYear: async (req, res) => {
        const year = req.params.year
        const populations = await Population.findAll({ where: { year: year } });
        res.json(populations);
    },
    // get Populations by RegionId
    getByRegionId: async (req, res) => {
        const regionid = req.params.regionid
        const populations = await Population.findAll({ where: { RegionId: regionid } });
        res.json(populations);
    },
    // get Populations by year and RegionId
    getByYearAndRegionId: async (req, res) => {
        const year = req.params.year
        const regionid = req.params.regionid
        const population = await Population.findOne({ where: { year: year, RegionId: regionid } });
        res.json(population);
    }
}