const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

class UserController {

  static getDatauser(req, res) {
    User.find({
        _id: req.decoded.id
      })
      .populate('shopId')
      .populate('transaction')
      .then(data => {
        let token = jwt.sign({
          id: data[0]._id,
          fname: data[0].fname,
          email: data[0].email,
          shopId: data[0].shopId,
          role: data[0].role
        }, process.env.JWT_HASH)

        res.status(200).json({
          status: 'success',
          user: {
            id: data[0]._id,
            fname: data[0].fname,
            transaction: data[0].transaction,
            shop: data[0].shopId,
            avatar: data[0].avatar,
            role: data[0].role
          },
          token
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

  static update(req, res) {

    User.updateOne({
        _id: req.decoded.id
      }, {
        fname: req.body.fname,
        lname: req.body.lname,
      })
      .then(data => {
        res.status(201).json({
          status: 'success',
          message: 'updating data user success'
        })
      })
      .catch(err => {
        res.status(500).json({
          status: 'failed',
          message: 'failed when updayting data user',
          err: err.message
        })
      })
  }

}

module.exports = UserController