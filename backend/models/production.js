const mongoose = require('mongoose');

const productionSchema = new mongoose.Schema({
    codeProduction: {
        type: String,
        required: true,
        unique: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    formula: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Formula',
        required: true
    },
    volumeDesired: {
        type: Number,
        required: true
    },
    description: {
        type: String
    },
    materialsUsed: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        quantity: {
            type: Number,
            required: true
        }
    }],
    observations: {
        type: String
    }
});

const Production = mongoose.model('Production', productionSchema);

module.exports = Production;
