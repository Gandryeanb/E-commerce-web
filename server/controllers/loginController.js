const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

class LoginController {
  
  static loginWeb (req, res) {
    User.find({ email: req.body.email })
      .then(data => {
        if (data.length === 1) {
          
          if (bcrypt.compareSync(req.body.password, data[0].password)) {
            let token = jwt.sign({
              fname: data[0].fname,
              email: data[0].email
            }, process.env.JWT_HASH)

            res.status(200).json({
              status: 'success',
              token: token
            })
          } else {
            res.status(500).json({
              status: 'failed',
              message: 'wrong email or password'
            })
          }
        } else {
          res.status(500).json({
            status: 'failed',
            message: 'wrong email or password'
          })    
        }
      })
      .catch(err => {
        res.status(500).json({
          status: 'failed',
          message: 'failed when logging your account'
        })
      })
  }

}

module.exports = LoginController