const express = require('express')
const app = express()
const port = 3001
const db = require('./db/models')

//Routers
const usersRouter = require('./routes/Users');
const rolesRouter = require('./routes/Roles');
const regionsRouter = require('./routes/Regions');
const populationsRouter = require('./routes/Populations');
const deathsRouter = require('./routes/Deaths');
const deathCausesRouter = require('./routes/DeathCauses');

db.sequelize.sync().then(() => {
    app.listen(port, () => console.log(`Server listening on port ${port}!`))
})