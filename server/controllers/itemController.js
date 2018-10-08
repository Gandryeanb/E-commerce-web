const Item = require('../models/itemModel')
const Shop = require('../models/shopModel')

class ItemController {

  static getItem (req, res) {
    Item.find({ deleted: 0 })
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
    console.log(req.decoded)
    let data = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      quantity: req.body.quantity,
      shopId: req.decoded.shopId,
      categoryId: req.body.categoryId
    }

    let item = new Item(data)

    item.save()
      .then(data => {
        res.status(201).json({
          status: 'success',
          message: 'success creating item'
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
    Item.updateOne({ _id: req.params.id, shopId: req.decoded.shopId }, {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      quantity: req.body.quantity,
      categoryId: req.body.categoryId
    })
      .then(data => {
        if (data.nModified != 0) {
          res.status(200).json({
            status: 'success',
            message: 'updating data item success'
          })
        } else {
          res.status(304).json()
        }
      })
      .catch(err =>{
        res.status(500).json({
          status: 'failed',
          message: 'failed when updating data Item'
        })
      })
  }

  static removeItem(req, res) {
    
  Shop.update({ _id: req.decoded.shopId }, {$pull: { items: req.params.id }})
    .then(data => {
      if (data.nModified == 1) {
        res.status(200).json({
          status: 'success',
          message: 'deleting data item success'
        })
      } else {
        res.status(304).json()
      }
    })
    .catch(err => [
      res.status(500).json({
        status: 'failed',
        message: 'deleting data item failed',
        err: err.message
      })
    ])
  }

}

module.exports = ItemController