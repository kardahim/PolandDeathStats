module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
        first_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })

    User.associate = (models) => {
        User.belongsToMany(models.Role, {
            through: "Users_Roles"
        })
    }

    return User
}