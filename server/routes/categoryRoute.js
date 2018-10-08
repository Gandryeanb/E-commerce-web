const route = require('express').Router()
const CategoryController = require('../controllers/categoryController')
const isLogin = require('../middlewares/isLogin')

route
  .post('/', isLogin, CategoryController.createCategory)


module.exports = route