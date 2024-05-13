const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CreditVente = require('./credit_vente'); // Import the CreditVente model

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
    date_commande: { type: Date, default: Date.now },
    versement: { type: Number, required: false },  // Versement non requis pour la commande
    modePaiement: {
        type: String,
        enum: ['chéque', 'espèce', 'crédit'],  // Sélection des options de mode de paiement
        required: true
    },
    code_cheque: { type: String, required: false } // Nouvelle propriété code_cheque
});


// Calculer le total de la commande avant de sauvegarder
commandeVenteSchema.pre('save', function(next) {
    this.totalCommande = this.produits.reduce((acc, curr) => acc + curr.totalLigne, 0);
    next();
});

// Middleware to create a CreditVente after saving a CommandeVente
commandeVenteSchema.post('save', async function(doc) {
    try {
        const resteAPayer = doc.totalCommande - (doc.versement || 0); // Calculate resteAPayer

        // Create the CreditVente record
        const creditVente = new CreditVente({
            commande: doc._id,
            resteAPayer: resteAPayer
        });

        await creditVente.save();
    } catch (error) {
        console.error('Error creating credit vente:', error);
        throw error; // Throw the error to ensure it's caught by the caller
    }
});

const CommandeVente = mongoose.model('CommandeVente', commandeVenteSchema);
module.exports = CommandeVente;
