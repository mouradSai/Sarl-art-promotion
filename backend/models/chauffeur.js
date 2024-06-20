const mongoose = require('mongoose');

const chauffeurSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  telephone: { type: String, required: true },
  email: { type: String, required: true },
  isActive: { type: Boolean, default: true } // Ajout de la propriété isActive
});

const Chauffeur = mongoose.model('Chauffeur', chauffeurSchema);
module.exports = Chauffeur;
