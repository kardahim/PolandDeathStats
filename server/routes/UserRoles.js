const express = require('express')
const router = express.Router()
const controller = require('../controllers/UserRoleController')
const { validateAdmin } = require('../middlewares/AuthMiddleware')

// get all User_Roles
router.get('/', controller.getAllRoles)

// Add new User_Role
router.post('/',validateAdmin, controller.addUserRole)

// Delete User_Role
router.delete('/', controller.deleteUserRole)

// Get User_Roles by RoleId
router.get('/role/:roleId', controller.getByRoleId)

// Get User_Roles by UserId
router.get("/user/:userId", controller.getByUserId)

module.exports = router