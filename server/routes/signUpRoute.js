const route = require('express').Router()
const SignUpController = require('../controllers/signUpController')

route.post('/', SignUpController.signUp)

module.exports = route