const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    
    category: {
        type: mongoose.Schema.Types.ObjectId, // Clé étrangère vers le modèle Categorie
        ref: 'Categorie', // Référence au modèle Categorie
        required: true,
    },
    namecategory:{
        type:String,
        require:false
      },
    entrepot: {
        type: mongoose.Schema.Types.ObjectId, // Clé étrangère vers le modèle Entrepot
        ref: 'Entrepot', // Référence au modèle Entrepot
        required: true,
    },
    nameentrepot:{
        type:String,
        require:false
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
