// models/creditAchat.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const creditAchatSchema = new Schema({
    commande: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Commande_achat',  // Updated to the correct model name
        required: true
    },
    
    resteAPayer: { type: Number, required: true },
});

creditAchatSchema.pre('save', function(next) {
    if (this.isNew) {
        // Initialize resteAPayer with the total of the order minus the initial payment
        this.resteAPayer = this.commande.totalCommande - this.commande.versement;  // Assuming these fields exist in CommandeAchat and are populated beforehand
    }
    next();
});

const CreditAchat = mongoose.model('CreditAchat', creditAchatSchema);
module.exports = CreditAchat;
