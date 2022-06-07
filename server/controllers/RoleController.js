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
    },
    // add Role
    addRole: async (req, res) => {
        const { name } = req.body;

        const role = await Role.findOne({ where: { name: name } });
        if (role) {
            res.json({ error: "A role with given name already exists." });
        }
        else {
            Role.create({
                name:name
            })
            res.json("Role added successfully.");
        }
    }
}