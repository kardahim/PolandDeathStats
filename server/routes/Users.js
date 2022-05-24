const express = require('express')
const router = express.Router()
const controller = require('../controllers/UserController')

// get all Users
router.get('/', controller.getUsers)

// register
router.post('/register', controller.register)

// login
router.post('/login', controller.login)

// validate login
router.get('/auth', controller.validateToken)

// get Users by id
router.get('/:id', controller.getById)

// get Users by email
router.get('/email/:email', controller.getByEmail)

module.exports = router
