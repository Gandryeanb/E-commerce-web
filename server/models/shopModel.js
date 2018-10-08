const mongoose = require('mongoose')
const Schema = mongoose.Schema
const User = require('./userModel')

const shopSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Firstname required']
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'userId required']
  },
  items: [{
    type: Schema.Types.ObjectId,
    ref: 'Item'
  }],
  transaction: [{
    type: Schema.Types.ObjectId,
    ref: 'Transaction'
  }]
}, {
  timestamps: true
})

shopSchema.post('save', function (doc) {
  User.updateOne({ _id:doc.userId }, { shopId: doc._id })
    .then(data => {

    })
    .catch(err => {
      res.status(500).json({
        status: 'failed',
        message: 'you need to relogin',
        err: err.message
      })
    })
})

const Shop = mongoose.model('Shop', shopSchema)

module.exports = Shop