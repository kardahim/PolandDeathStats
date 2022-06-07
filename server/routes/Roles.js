const express = require('express')
const router = express.Router()
const controller = require('../controllers/RoleController')
const { validateAdmin } = require('../middlewares/AuthMiddleware')

// get all Roles
router.get('/', controller.getRoles)

// Get Role by id
router.get('/:id', controller.getById)

// Get Role by name
router.get("/name/:name", controller.getByName)

// Add new Role
router.post("/",validateAdmin,controller.addRole)

module.exports = router