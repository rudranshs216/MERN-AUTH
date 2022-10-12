const express = require('express')
const loginController = require('./controller/auth/loginController')
const refreshController = require('./controller/auth/refreshController')
const registerController = require('./controller/auth/registerController')
const userController = require('./controller/auth/userController')
const auth = require('./middlewares/auth')
const router = express.Router()

router.post('/register', registerController.register)
router.post('/login', loginController.login)
router.get('/me', auth, userController.me)
router.post('/refresh', refreshController.refresh)
router.post('/logout', auth , loginController.logout)

module.exports = router
