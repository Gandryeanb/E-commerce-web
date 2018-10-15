const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Shop = require('../models/shopModel')

const itemSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Firstname required']
  },
  photo: {
    type: 'String'
  },
  description: {
    type: String,
    required: [true, 'description required']
  },
  price: {
    type: Number,
    required: [true, 'price required']
  },
  quantity: {
    type: Number,
    required: [true, 'quantity required']
  },
  shopId: {
    type: Schema.Types.ObjectId,
    ref: 'Shop',
    required: [true, 'shopId required']
  },
  deleted: {
    type: Number,
    default: 0
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'shodId required']
  }
}, {
  timestamps: true
})

itemSchema.post('save', function (doc) {
  Shop.updateOne({
      _id: doc.shopId
    }, {
      $push: {
        items: doc._id
      }
    })
    .then(data => {

    })
    .catch(err => {
      console.log('error when adding item to shop list')
    })
})

const Item = mongoose.model('Item', itemSchema)

module.exports = Item