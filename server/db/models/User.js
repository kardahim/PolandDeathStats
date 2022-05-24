module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
        firstname: {
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
    }, {
        tableName: 'users'
    })

    User.associate = (models) => {
        User.belongsToMany(models.Role, {
            through: "users_roles",
        })
    }

    return User
}