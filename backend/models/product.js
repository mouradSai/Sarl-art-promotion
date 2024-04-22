const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    category: {
        type: String,
        required: true,
    },
  
    quantity: {
        type: Number,
        required: true,
        default: 0,
    },
  
}, {
    timestamps: true,
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
