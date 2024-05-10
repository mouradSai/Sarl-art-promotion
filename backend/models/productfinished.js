const mongoose = require('mongoose');

const productFinishedSchema = new mongoose.Schema({
    productionCode: {
        type: String,
        required: true
    },
    volumeProduced: {
        type: Number,
        required: true
    },
    formulaName: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const ProductFinished = mongoose.model('ProductFinished', productFinishedSchema);

module.exports = ProductFinished;
