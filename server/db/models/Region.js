module.exports = (sequelize, DataTypes) => {
    const Region = sequelize.define("Region", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    })

    Region.associate = (models) => {
        Region.hasMany(models.Population)
    }

    return Region
}