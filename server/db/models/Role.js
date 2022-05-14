module.exports = (sequelize, DataTypes) => {
    const Role = sequelize.define("Role", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    })

    Role.associate = (models) => {
        Role.belongsToMany(models.User, {
            through: "Users_Roles"
        })
    }

    return Role
}