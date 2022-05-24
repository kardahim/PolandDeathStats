module.exports = (sequelize, DataTypes) => {
    const Death = sequelize.define("Death", {
        year: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        value: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    }, {
        tableName: 'deaths'
    })

    Death.associate = (models) => {
        Death.belongsTo(models.Region)
        Death.belongsTo(models.DeathCause)
    }

    return Death
}