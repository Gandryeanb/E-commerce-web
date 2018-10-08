const User = require('../models/userModel')

class SignUpControler {

  static signUp (req, res) {
    let data = {
      fname: req.body.fname,
      lname: req.body.lname,
      email: req. body.email,
      password: req.body.password
    }

    let user = new User(data)

    user.save()
      .then(data => {
        res.status(201).json({
          status: 'success',
          message: 'creating new user success'
        })
      })
      .catch(err => {
        res.status(500).json({
          status: 'failed',
          message: err.message
        })
      })
      
  }

}

module.exports = SignUpControler