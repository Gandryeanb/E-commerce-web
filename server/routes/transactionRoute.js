const route = require('express').Router()
const TransactionController = require('../controllers/transactionController')
const isLogin = require('../middlewares/isLogin')

route
  .get('/:target', isLogin, TransactionController.getTransaction)
  .post('/', isLogin, TransactionController.createTransaction)
  .delete('/:id/:target', isLogin, TransactionController.removeTransaction)

module.exports = route