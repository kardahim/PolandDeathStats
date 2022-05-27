const { User_Role } = require('../db/models');
const Role = require('../db/models/Role');

module.exports = {
    // // get all UserRoles
    // getRoles: async (req, res) => {
    //     const roles = await Role.findAll();
    //     res.json(roles);
    // },

    // add User_Role
    addUserRole: async (req, res) => {
        const { RoleId, UserId } = req.body;

            User_Role.create({
                RoleId: RoleId,
                UserId: UserId
            })
            res.json("user_role added");
    },

    // DELETE User_Role
    deleteUserRole: async (req, res) => {
        const { RoleId, UserId } = req.body;

        Recipes.destroy({
            where: {
                RoleId: RoleId,
                UserId: UserId
            }
        })
        res.json("DELETED SUCCESSFULLY");
    },

    // get User_Role by RoleId
    getByRoleId: async (req, res) => {
        const roleId = req.params.roleId
        const user_role = await User_Role.findAll({ where: { RoleId: roleId } });
        res.json(user_role);
    },

    // get User_Role by UserId
    getByUserId: async (req, res) => {
        const userId = req.params.userId
        const user_role = await User_Role.findAll({ where: { UserId: userId } });
        res.json(user_role);
    }
    
}