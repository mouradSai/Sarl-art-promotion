const mongoose = require('mongoose');

const formulaSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required:true
        },
        quantity: {
            type: Number,
            required: true
        }
    }]
});


const Formula = mongoose.model('Formula', formulaSchema);
module.exports = Formula;
