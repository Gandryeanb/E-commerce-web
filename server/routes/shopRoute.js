const route = require('express').Router()
const Shop = require('../controllers/shopController')
const isLogin = require('../middlewares/isLogin')
const isUser = require('../middlewares/userOnly')

route
  .post('/', isLogin, isUser, Shop.createShop)
  .put('/', isLogin, isUser, Shop.updateShop)
  .get('/', isLogin, isUser ,Shop.getInfo)

module.exports = route