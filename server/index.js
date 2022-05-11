const express = require('express')
const app = express()
const port = 3001
const db = require('./db/models')

db.sequelize.sync().then(() => {
    app.listen(port, () => console.log(`Server listening on port ${port}!`))
})