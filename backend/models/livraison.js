const mongoose = require('mongoose');

const livraisonSchema = new mongoose.Schema({
  date_livraison: { type: Date, required: true },
  adresse_livraison: { type: String, required: true },
  client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  etat_livraison: { type: String, required: true },
  quantite: { type: Number, required: true },
  camion_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Camion', required: true },
  chauffeur_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Chauffeur', required: true },
  codeLivraison: { type: String, required: true },
  vente_id: { type: mongoose.Schema.Types.ObjectId, ref: 'CommandeProductionVente', required: false }  // Ajout de la clé étrangère vers la vente
});

const Livraison = mongoose.model('Livraison', livraisonSchema);
module.exports = Livraison;
