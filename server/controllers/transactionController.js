const Transaction = require('../models/transactionModel')
const priceCalculator = require('../helpers/priceCalculator')
const Item = require('../models/itemModel')
const itemSorter = require('../helpers/itemsSorter')
const idItemsFilter = require('../helpers/idItemsFilter')
const shopIdFilter = require('../helpers/shopsIdFilter')
const User = require('../models/userModel')
const Shop = require('../models/shopModel')

class TransactionController {

  static getTransaction(req, res) {
    let query = {}
    if (req.params.target === 'user') {
      query = {
        userId: req.decoded.id,
        deletedByUser: 0
      }
    } else if (req.params.target === 'shop') {
      query = {
        shopId: req.decoded.shopId,
        deletedByShop: 0
      }
    } else {
      res.status(404).json({
        status: 'failed',
        message: 'wrong params'
      })
    }

    Transaction.find(query)
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

  static createTransaction(req, res) {
    // Format items

    // let itemA = {
    //   "id": "5bbb367476aaa7500b23adad",
    //   "price": 65000
    // }

    // let itemB = {
    //   "id": "5bbb3c5f58714453645bba63",
    //   "price": 25000
    // }

    // let itemStack = [itemA, itemB, itemB, itemA, itemB, itemB, itemA]

    let itemsArr = itemSorter(req.body.items)

    let checkStock = new Promise((resolve, reject) => {
      for (let i = 0; i < itemsArr.length; i++) {
        Item.findOne({
            _id: itemsArr[i][0].id
          })
          .then(data => {
            if (data.quantity - itemsArr[i].length - 1 < 0) {
              reject(data)
            } else if (i == itemsArr.length - 1) {
              resolve(data)
            } else {

            }
          })
          .catch(err => {
            reject(err)
          })
      }
    })

    Promise.all([checkStock])
      .then(data => {
        let itemsId = idItemsFilter(req.body.items)
        let shopsIds = shopIdFilter(req.body.items)

        let newData = {
          shopId: shopsIds,
          userId: req.decoded.id,
          item: itemsId,
          totalPrice: priceCalculator(itemsArr)
        }
        let transaction = new Transaction(newData)

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
      })
      .catch(err => {
        res.status(500).json({
          status: "can't create transaction",
          err: err.message
        })
      })

  }

  static removeTransaction(req, res) {

    let querySearch = {}
    let queryUpdate = {}
    let target = ''

    if (req.params.target === 'user') {
      querySearch = {
        _id: req.params.id,
        userId: req.decoded.id
      }
      queryUpdate = {
        deletedByUser: 1
      }
      target = 'user'
    } else if (req.params.target === 'shop') {
      querySearch = {
        _id: req.params.id,
        shopId: req.decoded.shopId
      }
      queryUpdate = {
        deletedByShop: 1
      }
      target = 'shop'
    } else {
      res.status(404).json({
        status: 'failed',
        message: 'wrong params'
      })
    }

    Transaction.updateOne(querySearch, queryUpdate)
      .then(data => {
        if (data.nModified == 1) {
          if (target == 'user') {
            User.updateOne({
                _id: req.decoded.id
              }, {
                $pull: {
                  transaction: req.params.id
                }
              })
              .then(data => {
                res.status(200).json({
                  status: 'success',
                  message: 'success when deleting data'
                })
              })
              .catch(err => {
                res.status(500).json({
                  status: 'success and failed',
                  message: 'success when deleting data but pulling transaction on doc user failed because internal system error',
                  err: err.message
                })
              })
          } else {
            Shop.updateOne({
                _id: req.decoded.shopId
              }, {
                $pull: {
                  transaction: req.params.id
                }
              })
              .then(data => {
                res.status(200).json({
                  status: 'success',
                  message: 'success when deleting data'
                })
              })
              .catch(err => {
                res.status(500).json({
                  status: 'success and failed',
                  message: 'success when deleting data but pulling transaction on doc shop failed because internal system error',
                  err: err.message
                })
              })
          }
        } else {
          res.status(304).json({
            status: 'success',
            message: 'success when deleting data'
          })
        }
      })
      .catch(err => {
        res.status(500).json({
          status: 'failed',
          message: 'failed when deleting data'
        })
      })
  }

}

module.exports = TransactionController