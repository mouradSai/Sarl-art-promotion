const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schéma pour les formules dans le bon de production
const formulaProdSchema = new Schema({
    formula: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Formula', // Assurez-vous que 'Formula' correspond au nom de votre modèle de formule
    }
});

// Schéma pour le bon de production
const bonProductionSchema = new mongoose.Schema({
    code_bon: String,
    client_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'client' // Assurez-vous que 'client' correspond au nom de votre modèle de client
    },
    formules: [formulaProdSchema],
    quantite: { type: Number, required: true },  // Quantité totale pour la production
    lieu_livraison: { type: String, required: true },  // Lieu de livraison
    heure: { type: String, required: true }, // Heure de production
    date: { type: Date, default: Date.now }, // Date de production
    status: { type: String, default: 'En cours' } // Statut de production
});

const BonProduction = mongoose.model('BonProduction', bonProductionSchema);
module.exports = BonProduction;
