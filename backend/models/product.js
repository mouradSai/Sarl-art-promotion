const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categorie',
        required: true,
    },
    namecategory: {
        type: String,
        required: true,
    },
    entrepot: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Entrepot',
        required: true,
    },
    nameentrepot: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        default: 0,
    },
    unit: {
        type: String,
        required: true,
        enum: ['kg', 'g', 'L', 'ml', 'unit']
    },
    description: {
        type: String,
        required: false,
    },
    IsActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
