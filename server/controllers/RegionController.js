const { Region } = require("../db/models")

module.exports = {
    // get all Regions
    getRegions: async (req, res) => {
        const listOfRegions = await Region.findAll();
        res.json(listOfRegions);
    },

    // get Regions by id
    getById: async (req, res) => {
        const id = req.params.id
        const region = await Region.findByPk(id);
        res.json(region);
    },

    // get Regions by name
    getByName: async (req, res) => {
        const name = req.params.name
        const region = await Region.findOne({ where: { name: name } });
        res.json(region);
    },

    // // add Region
    // addRegion: async (req, res) => {
    //     const { name } = req.body;

    //     const region = await Region.findOne({ where: { name: name } });
    //     if (region) {
    //         res.json({ error: "A region with given name already exists." });
    //     }
    //     else {
    //         Region.create({
    //             name:name
    //         })
            
    //         res.json("Region added successfully.");
    //     }
    // }
}