const route = require('express').Router()
const UserController = require('../controllers/userController')
const isLogin = require('../middlewares/isLogin')

route
  .get('/', isLogin, UserController.getDatauser)
  .put('/', isLogin, UserController.update)

module.exports = route