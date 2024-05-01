const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schéma pour les produits dans la commande d'achat
const produitAchatSchema = new Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',  // Assurez-vous que 'product' correspond au nom de votre modèle de produit
        required: true
    },
    quantity: { type: Number, required: true },
    prixUnitaire: { type: Number, required: true },  // Prix unitaire du produit
    totalLigne: { type: Number, required: true }  // Total pour cette ligne (quantité * prix unitaire)
}, { _id: false });

// Calculer le total de la ligne avant de sauvegarder
produitAchatSchema.pre('save', function(next) {
    this.totalLigne = this.quantity * this.prixUnitaire;
    next();
});

// Schéma pour la commande d'achat
const commandeAchatSchema = new mongoose.Schema({
    code_commande: String,
    provider_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'provider' // Assurez-vous que 'provider' correspond au nom de votre modèle de fournisseur
    },
    produits: [produitAchatSchema],
    totalCommande: { type: Number, required: true, default: 0 },  // Total général pour la commande
    observation: {
        type: String,
        required: false
    },
    date_commande: { type: Date, default: Date.now }
});

// Calculer le total de la commande avant de sauvegarder
commandeAchatSchema.pre('save', function(next) {
    this.totalCommande = this.produits.reduce((acc, curr) => acc + curr.totalLigne, 0);
    next();
});

const CommandeAchat = mongoose.model('CommandeAchat', commandeAchatSchema);
module.exports = CommandeAchat;
