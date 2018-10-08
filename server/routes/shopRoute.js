const route = require('express').Router()
const Shop = require('../controllers/shopController')
const isLogin = require('../middlewares/isLogin')

route
  .post('/', isLogin, Shop.createShop)
  .put('/', isLogin, Shop.updateShop)
  .get('/', isLogin, Shop.getInfo)

module.exports = route