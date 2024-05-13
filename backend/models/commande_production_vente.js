const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CreditProductionVente = require('./credit_production_vente'); // Import the CreditProductionVente model

// Schema for finished products in the production sale order
const produitVenteSchema = new Schema({
    productfinished: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductFinished',  // Ensure this is the correct model name for your finished products
        required: true
    },
    quantity: { type: Number, required: true },
    prixUnitaire: { type: Number, required: true },  // Unit price of the product
    totalLigne: { type: Number, required: true }  // Total for this line item (quantity * unit price)
}, { _id: false });

// Pre-save hook to calculate the line total before saving
produitVenteSchema.pre('save', function(next) {
    this.totalLigne = this.quantity * this.prixUnitaire;
    next();
});

// Schema for the production sale order
const commandeProductionVenteSchema = new mongoose.Schema({
    code_commande: String,
    client_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',  // Confirm that 'Client' matches your client model name
    },
    produits: [produitVenteSchema],
    totalCommande: { type: Number, required: true, default: 0 },  // Total amount for the order
    observation: {
        type: String,
        required: false
    },
    date_commande: { type: Date, default: Date.now },
    versement: { type: Number, required: false },  // Down payment not required for the order
    modePaiement: {
        type: String,
        enum: ['chéque', 'espèce', 'crédit'],  // Choices for payment mode
        required: true
    },
    code_cheque: { type: String, required: false } // Nouvelle propriété code_cheque

});

// Pre-save hook to calculate the total order before saving
commandeProductionVenteSchema.pre('save', function(next) {
    this.totalCommande = this.produits.reduce((acc, curr) => acc + curr.totalLigne, 0);
    next();
});

// Middleware to create a CreditProductionVente after saving a CommandeProductionVente
commandeProductionVenteSchema.post('save', async function(doc) {
    try {
        const resteAPayer = doc.totalCommande - (doc.versement || 0); // Calculate resteAPayer

        // Create the CreditProductionVente record
        const creditProductionVente = new CreditProductionVente({
            vente: doc._id,
            resteAPayer: resteAPayer
        });

        await creditProductionVente.save();
    } catch (error) {
        console.error('Error creating credit production vente:', error);
        throw error; // Throw the error to ensure it's caught by the caller
    }
});

const CommandeProductionVente = mongoose.model('CommandeProductionVente', commandeProductionVenteSchema);
module.exports = CommandeProductionVente;
