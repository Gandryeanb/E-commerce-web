const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

class LoginController {

  static loginWeb(req, res) {
    User.find({
        email: req.body.email
      })
      .then(data => {
        if (data.length === 1) {
          if (data[0].verified === 0) {
            if (bcrypt.compareSync(req.body.password, data[0].password)) {
              let token = jwt.sign({
                id: data[0]._id,
                fname: data[0].fname,
                email: data[0].email,
                shopId: data[0].shopId,
                role: data[0].role
              }, process.env.JWT_HASH)

              res.status(200).json({
                status: 'success',
                token: token,
                currentUser: {
                  id: data[0]._id,
                  fname: data[0].fname,
                }
              })
            } else {
              res.status(500).json({
                status: 'failed',
                message: 'Wrong email or password'
              })
            }
          } else {
            res.status(500).json({
              status: 'failed',
              message: 'You need to verify your email first'
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
          message: 'Failed when logging your account'
        })
      })
  }

}

module.exports = LoginController