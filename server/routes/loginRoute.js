const route = require('express').Router()
const LoginController = require('../controllers/loginController')

route.post('/', LoginController.loginWeb)

module.exports = route