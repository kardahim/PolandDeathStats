const express = require('express')
const router = express.Router()
const controller = require('../controllers/RoleController')

// get all Roles
router.get('/', controller.getRoles)

// Get Role by id
router.get('/:id', controller.getById)

// Get Role by name
router.get("/name/:name", controller.getByName)

// Add Role
router.post("/", controller.addRole)

module.exports = router