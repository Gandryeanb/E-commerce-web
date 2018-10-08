const Shop = require('../models/shopModel')

class ShopController {

  static getInfo(req, res) {
    Shop.find({ _id: req.decoded.shopId })
      .then(data => {
        res.status(200).json({
          status: 'success',
          data: data
        })
      })
      .catch(err => {
        res.status(500).json({
          status: 'failed',
          message: 'failed when get shop data',
          err: err.message
        })
      })
  }

  static createShop (req, res) {
    let data = {
      name: req.body.name,
      userId: req.decoded.id
    }

    let shop = new Shop(data)

    shop.save()
      .then(data => {
        res.status(201).json({
          status: 'success',
          message: `creating new shop with user id ${data.userId} success`
        })
      })
      .catch(err => {
        res.status(500).json({
          status: 'failed',
          message: 'failed when creating shop'
        })
      })
  }

  static updateShop (req, res) {
    Shop.updateOne({ userId: req.decoded.id },{
      name: req.body.name
    })
      .then(response => {
        res.status(201).json({
          status: 'success',
          message: 'success when updating data'
        })
      })
      .catch(err => {
        res.status(500).json({
          status: 'failed',
          message: 'failed when updating data',
          err: err.message
        })
      })
  }
}

module.exports = ShopController