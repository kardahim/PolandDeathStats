const express = require('express')
const router = express.Router()
const controller = require('../controllers/UserRoleController')

// // get all Roles
// router.get('/', controller.getRoles)

// Add User_Role
router.post('/', controller.addUserRole)

// Delete User_Role
router.delete('/', controller.deleteUserRole)

// Get User_Roles by RoleId
router.get('/role/:roleId', controller.getByRoleId)

// Get User_Roles by UserID
router.get("/user/:userId", controller.getByUserId)

module.exports = router