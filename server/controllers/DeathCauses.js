// const { DeathCauses } = require("../db/models")

// module.exports = {
//     getDeathCauses : ((req, res) => {
//     // const listOfDeathCauses = DeathCauses.findAll();
//     res.json(DeathCauses);
// }),

//     getDeathCauseById : ((req, res) => {
//     const id = req.params.id
//     const deathCause = DeathCauses.findByPk(id);
//     res.status(200).json(deathCause);
// }),

//     addDeathCause : ((req,res) => {
//     const deathCause = req.body;
//     DeathCauses.create(deathCause);
//     res.json(deathCause);
// })


// }