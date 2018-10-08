const route = require('express').Router()
const TransactionController = require('../controllers/transactionController')
const isLogin = require('../middlewares/isLogin')

route
  .get('/', isLogin, TransactionController.getTransaction)
  .post('/', isLogin, TransactionController.createTransaction)
  .delete('/', isLogin, TransactionController.removeTransaction)

module.exports = route