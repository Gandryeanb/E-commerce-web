const route = require('express').Router()
const ItemControler = require('../controllers/itemController')
const isLogin = require('../middlewares/isLogin')

route
  .get('/', isLogin, ItemControler.getItem)
  .put('/', isLogin, ItemControler.updateItem)
  .post('/', isLogin, ItemControler.createItem)
  .delete('/', isLogin, ItemControler.removeItem)


module.exports = route