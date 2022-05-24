module.exports = (sequelize, DataTypes) => {
    const Role = sequelize.define("Role", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {
        tableName: 'roles'
    })

    Role.associate = (models) => {
        Role.belongsToMany(models.User, {
            through: "users_roles"
        })
    }

    return Role
}