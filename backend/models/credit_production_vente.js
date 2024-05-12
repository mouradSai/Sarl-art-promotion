const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const creditProductionVenteSchema = new Schema({
    vente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CommandeProductionVente',  // Assuming there's a Vente model for sales
        required: true
    },
    
    resteAPayer: { type: Number, required: true },
});

creditProductionVenteSchema.pre('save', function(next) {
    if (this.isNew) {
        // Initialize resteAPayer with the total of the sale minus any initial payment
        this.resteAPayer = this.vente.totalVente - this.vente.versement;  // Assuming these fields exist in Vente and are populated beforehand
    }
    next();
});

const CreditProductionVente = mongoose.model('CreditProductionVente', creditProductionVenteSchema);
module.exports = CreditProductionVente;
