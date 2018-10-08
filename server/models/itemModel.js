const mongoose = require('mongoose')
const Schema = mongoose.Schema

const itemSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Firstname required']
  },
  description : {
    type : String,
    required: [true, 'description required']
  },
  quantity: {
    type: Number,
    required: [true, 'quantity required']
  },
  shopId: { type: Schema.Types.ObjectId, ref: 'Shop' },
  categoryId: [{
    type: Schema.Types.ObjectId,
    ref: 'Category'
  }]
}, {
  timestamps: true
})

const Item = mongoose.model('Item', itemSchema)

module.exports = Item