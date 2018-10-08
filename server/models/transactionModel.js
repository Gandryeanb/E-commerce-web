const mongoose = require('mongoose')
const Schema = mongoose.Schema

const transactionSchema = new Schema({
  item: [{
    type: Schema.Types.ObjectId,
    ref: 'Item',
    require: [true, 'item required']
  }],
  totalPrice: {
    type: Number,
    required: [true, 'total price required']
  },
  shopId: { type: Schema.Types.ObjectId, ref: 'Shop' },
  userId: { type: Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true
})

const Transaction = mongoose.model('Transaction', transactionSchema)

module.exports = Transaction