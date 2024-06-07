const mongoose = require('mongoose');

const camionSchema = new mongoose.Schema({
  numero_plaque: { type: String, required: true },
  capacite: { type: Number, required: true },
  isActive: { type: Boolean, default: true }
});

const Camion = mongoose.model('Camion', camionSchema);
module.exports = Camion;
