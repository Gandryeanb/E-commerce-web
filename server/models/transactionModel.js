const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Item = require('../models/itemModel')
const User = require('../models/userModel')
const Shop = require('../models/shopModel')

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
  deletedByUser: {
    type: Number,
    default: 0
  },
  deletedByShop: {
    type: Number,
    default: 0
  },
  shopId: { type: Schema.Types.ObjectId, ref: 'Shop' },
  userId: { type: Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true
})

transactionSchema.post('save', doc => {
  let fixFormatItem = []
  let newItems = []
  
  for (let i = 0; i < doc.item.length; i++) {
    if (newItems.length == 0) {
      newItems.push(doc.item[i])
    } else if (String(newItems[0]) !== String(doc.item[i])) {
      fixFormatItem.push(newItems)
      newItems = []
      newItems.push(doc.item[i])
    } else {
      newItems.push(doc.item[i])
    }
  }
  fixFormatItem.push(newItems)
  
  for (let i = 0; i < fixFormatItem.length; i++) {
    Item.findOne({ _id: fixFormatItem[i] })
      .then(data => {
        Item.updateOne({ _id: data._id }, { quantity: data.quantity-(fixFormatItem[i].length) })
          .then(data => {
            
          })
          .catch(err => {
            throw new Error(err)
          })
      })
      .catch(err => {
        throw new Error(err)
      })
  }

  User.updateOne({ _id: doc.userId }, { $push: { transaction: doc._id } })
    .then(data => {

    })
    .catch(err => {
      throw new Error(err)
    })

  Shop.updateOne({ _id: doc.shopId }, { $push: { transaction: doc._id } })
    .then(data => {

    })
    .catch(err => {
      throw new Error(err)
    })

})

const Transaction = mongoose.model('Transaction', transactionSchema)

module.exports = Transaction