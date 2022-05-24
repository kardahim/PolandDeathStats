const { Role } = require('../db/models')

module.exports = {
    // get all Roles
    getRoles: async (req, res) => {
        const roles = await Role.findAll();
        res.json(roles);
    },

    // get Roles by id
    getById: async (req, res) => {
        const id = req.params.id
        const role = await Role.findByPk(id);
        res.json(role);
    },

    // get Roles by name
    getByName: async (req, res) => {
        const name = req.params.name
        const role = await Role.findOne({ where: { name: name } });
        res.json(role);
    }
}