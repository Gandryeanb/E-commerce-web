const Item = require('../models/transactionModel')

class ItemController {

  static getItem (req, res) {
    Item.find()
      .then(data => {
        res.status(200).json({
          status: 'success',
          data: data
        })
      })
      .catch(err => {
        res.status(500).json({
          status: 'failed',
          message: 'failed when get data from database',
          err: err.message
        })
      })
  }

  static createItem (req, res) {
    let data = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      quantity: req.body.quantity,
      shopId: req.decoded.id,
      categoryId: req.body.categoryId
    }

    let item = new Item(data)

    item.save()
      .then(data => {
        res.status(201).json({
          status: 'success',
          message: 'sucess creating item'
        })
      })
      .catch(err => {
        res.status(500).json({
          status: 'failed',
          message: 'failed when create item',
          err: err.message
        })
      })
  }

  static updateItem(req, res) {
    Item.updateOne({ _id: req.params.id, shopId: req.decoded.id }, {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      quantity: req.body.quantity,
      categoryId: req.body.categoryId
    })
      .then(data => {
        res.status(201).json({
          status: 'success',
          message: 'updating data item success'
        })
      })
      .catch(err =>{
        res.status(500).json({
          status: 'failed',
          message: 'failed when updating data Item'
        })
      })
  }

  static removeItem(req, res) {
    Item.deleteOne({ _id: req.params.id, shopId: req.decoded.shopId })
      .then(data => {
        res.status(200).json({
          status: 'success',
          message: 'success when deleting data item'
        })
      })
      .catch(err => {
        res.status(500).json({
          status: 'failed',
          message: 'failed when deleting data item',
          err: err.message
        })
      })
  }

}

module.exports = ItemController