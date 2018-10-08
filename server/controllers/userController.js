const User = require('../models/userModel')

class UserController {
  
  static getDatauser (req, res) {
    User.find({ _id: req.decoded.id })
      .then(data => {
        res.status(200).json({
          status: 'success',
          data: data[0]
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

  static update (req, res) {

    User.updateOne({ _id: req.decoded.id }, {
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