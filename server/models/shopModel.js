const mongoose = require('mongoose')
const Schema = mongoose.Schema

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

const Shop = mongoose.model('Shop', shopSchema)

module.exports = Shop