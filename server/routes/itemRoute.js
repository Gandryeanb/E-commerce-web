const route = require('express').Router()
const ItemControler = require('../controllers/itemController')
const isLogin = require('../middlewares/isLogin')

route
  .get('/', ItemControler.getItem)
  .put('/:id', isLogin, ItemControler.updateItem)
  .post('/', isLogin, ItemControler.createItem)
  .delete('/:id', isLogin, ItemControler.removeItem)


module.exports = route