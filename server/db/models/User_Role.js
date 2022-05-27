

module.exports = (sequelize, DataTypes) => {
    const User_Role = sequelize.define("User_Role", {
        RoleId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        UserId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'user_role'
    });

    

    // User_Role.associate = (models) => {
    // //     User.belongsToMany(models.Role, {
    // //         through: "User_Role",
    // //     })
    //     User.belongsToMany(models.Role, {
    //         through: "User_Role",
    //     });
    //     Role.belongsToMany(models.User, {
    //         through: "User_Role"
    //     });

    // }
    return User_Role
}