const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Provider'
  },
  date: {
    type: Date,
    default: Date.now
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  nameproduct:{
    type:String,
    require:false
  },
  nameprovider:{
    type:String,
    require:false
  },
  description: String,
  quantity: Number,
  unitPrice: Number,
  subtotal: Number
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
