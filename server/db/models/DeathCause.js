module.exports = (sequelize, DataTypes) => {
    const DeathCause = sequelize.define("DeathCause", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {
        tableName: 'deathcauses'
    })

    DeathCause.associate = (models) => {
        DeathCause.hasMany(models.Death)
    }

    return DeathCause
}