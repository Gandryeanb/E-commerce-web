const route = require('express').Router()
const CategoryController = require('../controllers/categoryController')
const isLogin = require('../middlewares/isLogin')
const isAdmin = require('../middlewares/adminOnly')

route
  .post('/', isLogin, CategoryController.createCategory)
  .get('/',CategoryController.getCategory)
  .put('/:id', isLogin, isAdmin, CategoryController.updateCategory)
  .delete('/:id', isLogin, isAdmin, CategoryController.deleteCategory)


module.exports = route