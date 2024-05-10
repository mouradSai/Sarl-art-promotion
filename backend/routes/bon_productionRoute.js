// Importation des dépendances
const express = require('express');
const router = express.Router();
const BonProduction = require('../models/BonProduction'); // Importation du modèle BonProduction

// Route pour créer un nouveau bon de production
router.post('/', (req, res) => {
  const nouveauBonProduction = new BonProduction(req.body);
  nouveauBonProduction.save()
    .then((bonProduction) => {
      res.status(201).json(bonProduction);
    })
    .catch((err) => {
      res.status(400).json({ error: err.message });
    });
});

// Route pour récupérer tous les bons de production
router.get('/', (req, res) => {
  BonProduction.find()
    .populate('client') // Population des références client
    .populate('product') // Population des références produit
    .then((bonsProductions) => {
      res.status(200).json(bonsProductions);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

// Route pour récupérer un bon de production par son ID
router.get('/:id', (req, res) => {
  BonProduction.findById(req.params.id)
    .populate('client') // Population des références client
    .populate('product') // Population des références produit
    .then((bonProduction) => {
      if (!bonProduction) {
        return res.status(404).json({ error: 'Bon de production non trouvé' });
      }
      res.status(200).json(bonProduction);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

// Route pour mettre à jour un bon de production par son ID
router.put('/:id', (req, res) => {
  BonProduction.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((bonProduction) => {
      if (!bonProduction) {
        return res.status(404).json({ error: 'Bon de production non trouvé' });
      }
      res.status(200).json(bonProduction);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

// Route pour supprimer un bon de production par son ID
router.delete('/:id', (req, res) => {
  BonProduction.findByIdAndDelete(req.params.id)
    .then((bonProduction) => {
      if (!bonProduction) {
        return res.status(404).json({ error: 'Bon de production non trouvé' });
      }
      res.status(200).json({ message: 'Bon de production supprimé avec succès' });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

// Exportation du routeur pour l'utiliser dans d'autres fichiers
module.exports = router;
