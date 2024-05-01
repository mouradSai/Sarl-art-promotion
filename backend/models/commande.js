// models/Commande.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const produitSchema = new Schema({
    id: Schema.Types.ObjectId,
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required: true 
    },
    quantity: { type: Number, required: true }
}, { _id: false });

const commandeSchema = new mongoose.Schema({
    code_commande: String,
    provider_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'provider' // Assurez-vous que 'Provider' correspond au nom de votre modèle de fournisseur
    },
    produits: [produitSchema], // ou tout autre type approprié
    observation:{
        type:String,
        required:false
    },
    date_commande: { type: Date, default: Date.now }
});

const Commande = mongoose.model('Commande', commandeSchema);
module.exports = Commande;
