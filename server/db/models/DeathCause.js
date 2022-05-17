module.exports = (sequelize, DataTypes) => {
    const DeathCause = sequelize.define("DeathCause", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    })

    DeathCause.associate = (models) => {
        DeathCause.hasMany(models.Death)
    }

    return DeathCause
}