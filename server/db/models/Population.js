module.exports = (sequelize, DataTypes) => {
    const Population = sequelize.define("Population", {
        year: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        value: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    }, {
        tableName: 'populations'
    })

    Population.associate = (models) => {
        Population.belongsTo(models.Region)
    }

    return Population
}