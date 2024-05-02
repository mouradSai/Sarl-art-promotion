const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schéma pour les produits dans la commande de vente
const produitVenteSchema = new Schema({
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
produitVenteSchema.pre('save', function(next) {
    this.totalLigne = this.quantity * this.prixUnitaire;
    next();
});

// Schéma pour la commande de vente
const commandeVenteSchema = new mongoose.Schema({
    code_commande: String,
    client_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'client' // Assurez-vous que 'client' correspond au nom de votre modèle de client
    },
    produits: [produitVenteSchema],
    totalCommande: { type: Number, required: true, default: 0 },  // Total général pour la commande
    observation: {
        type: String,
        required: false
    },
    date_commande: { type: Date, default: Date.now }
});

// Calculer le total de la commande avant de sauvegarder
commandeVenteSchema.pre('save', function(next) {
    this.totalCommande = this.produits.reduce((acc, curr) => acc + curr.totalLigne, 0);
    next();
});

const CommandeVente = mongoose.model('CommandeVente', commandeVenteSchema);
module.exports = CommandeVente;
