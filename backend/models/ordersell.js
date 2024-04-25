const mongoose = require('mongoose');

const ordersellSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client'
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
  nameclient:{
    type:String,
    require:false
  },
  description: String,
  quantity: Number,
  unitPrice: Number,
  subtotal: Number
});

const Ordersell = mongoose.model('Ordersell', ordersellSchema);

module.exports = Ordersell;
