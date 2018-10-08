const Transaction = require('../models/transactionModel')

class TransactionController {

  static getTransaction (req, res) {
    Transaction.find()
      .then(data => {
        res.status(200).json({
          status: 'success',
          data: data
        })
      })
      .catch(err => {
        res.status(500).json({
          status: 'failed',
          message: 'failed get data from database',
          err: err.message
        })
      })
  }

  static createTransaction (req, res) {
    let data = {
      shopId: req.decoded.shopId,
      userId: req.decoded.id,
      item: req.body.item,
      totalPrice: req.body.totalPrice
    }
    let transaction = new Transaction(data)

    transaction.save()
      .then(data => {
        res.status(201).json({
          status: 'success',
          message: 'success creating transaction',
          data: data
        })
      })
      .catch(err => {
        res.status(500).json({
          status: 'failed',
          message: 'failed when creating transaction',
          err: err.message
        })
      })
  }

  static removeTransaction (req, res) {
    Transaction.deleteOne({ _id: req.params.id, userId: req.decoded.id })
      .then(data => {
        res.status(201).json({
          status: 'success',
          message: 'success when deleting data'
        })
      })
      .catch (err => {
        res.status(500).json({
          status: 'failed',
          message: 'failed when deleting data'
        })
      })
  }

}

module.exports = TransactionController