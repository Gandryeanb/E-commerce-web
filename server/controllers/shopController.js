const Shop = require('../models/shopModel')
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

class ShopController {

  static getInfo(req, res) {
    
    Shop.find({ userId: req.decoded.id })
      .then(data => {
        res.status(200).json({
          status: 'success',
          data: data[0]
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

    Shop.find({ userId: req.decoded.id })
      .then(data => {
        if (data.length === 0) {
          let data = {
            name: req.body.name,
            userId: req.decoded.id
          }
      
          let shop = new Shop(data)
      
          shop.save()
            .then(data => {
              User.find({ _id: data.userId })
              .then(user => {

                let token = jwt.sign({
                  id: user[0]._id,
                  fname: user[0].fname,
                  email: user[0].email,
                  shopId: user[0].shopId
                }, process.env.JWT_HASH)
  
                res.status(201).json({
                  status: 'success',
                  message: `creating new shop with user id ${data.userId} success`,
                  token: token
                })
              })
            })
            .catch(err => {
              res.status(500).json({
                status: 'failed',
                message: 'failed when creating shop',
                err: err.message
              })
            })
        } else {
          res.status(403).json({
            status: 'failed',
            message: 'you already have a shop'
          })
        }
      })
      .catch(err => {
        res.status(500).json({
          status: 'failed',
          message: 'failed when creating shop for you',
          err: err.message
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