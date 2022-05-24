module.exports = (sequelize, DataTypes) => {
    const Region = sequelize.define("Region", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {
        tableName: 'regions'
    })

    Region.associate = (models) => {
        Region.hasMany(models.Population)
        Region.hasMany(models.Death)
    }

    return Region
}