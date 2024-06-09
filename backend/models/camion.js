const mongoose = require('mongoose');

const camionSchema = new mongoose.Schema({
  numero_plaque: { type: String, required: true },
  capacite: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  chauffeur: { type: mongoose.Schema.Types.ObjectId, ref: 'Chauffeur', required: true } // Ajout de la référence au chauffeur
});

const Camion = mongoose.model('Camion', camionSchema);
module.exports = Camion;
