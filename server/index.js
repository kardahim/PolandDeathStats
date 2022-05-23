const express = require('express')
const cors = require('cors');
const app = express()
const port = 3001
const db = require('./db/models')
app.use(express.json());
app.use(cors());

//Routers
const usersRouter = require('./routes/Users');
app.use("/users", usersRouter);
const rolesRouter = require('./routes/Roles');
app.use("/roles", rolesRouter);
const regionsRouter = require('./routes/Regions');
app.use("/regions", regionsRouter);
const populationsRouter = require('./routes/Populations');
app.use("/deaths", populationsRouter);
const deathsRouter = require('./routes/Deaths');
app.use("/deaths", deathsRouter);
const deathCausesRouter = require('./routes/DeathCauses');
app.use("/deathcauses", deathCausesRouter);

db.sequelize.sync().then(() => {
    app.listen(port, () => console.log(`Server listening on port ${port}!`))
})