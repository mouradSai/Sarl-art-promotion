// Importation de mongoose
const mongoose = require('mongoose');

// Schéma du modèle BonProduction
const BonProductionSchema = new mongoose.Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId, // Référence vers le modèle Client
        ref: 'Client', // Nom du modèle référencé
    },
    product: {
        type: mongoose.Schema.Types.ObjectId, // Référence vers le modèle Product
        ref: 'Product', // Nom du modèle référencé
    },
    quantity: {
        type: Number
    },
    date: {
        type: Date,
        default: Date.now // Date par défaut, peut être changée
    },
    heure: {
        type: String,
    },
    lieuLivraison: {
        type: String,
    }
});

// Création du modèle BonProduction à partir du schéma
const BonProduction = mongoose.model('BonProduction', BonProductionSchema);

// Export du modèle pour l'utiliser ailleurs dans l'application
module.exports = BonProduction;
