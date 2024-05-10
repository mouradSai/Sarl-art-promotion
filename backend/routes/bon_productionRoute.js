const express = require('express');
const router = express.Router();
const BonProduction = require('../models/BonProduction');
const Client = require('../models/client');
const Formula = require('../models/Formula'); // Import correct du modèle Formula

// Créer un bon de production
router.post('/', async (req, res) => {
    try {
        const { code_bon, client_name, formules, quantite, lieu_livraison, heure, date, observation } = req.body;

        // Trouver l'ID du client à partir de son nom
        const client = await Client.findOne({ name: client_name });
        if (!client) {
            return res.status(404).json({ message: 'Client non trouvé' });
        }

        // Convertir les noms de formules en IDs
        const formulaDetails = await Promise.all(formules.map(async ({ formula_name }) => {
            const formula = await Formula.findOne({ name: formula_name });
            if (!formula) {
                throw new Error(`Formule ${formula_name} non trouvée`);
            }
            return { formula: formula._id };
        }));

        const newBonProduction = new BonProduction({
            code_bon,
            client_id: client._id,
            formules: formulaDetails,
            quantite,
            lieu_livraison,
            heure,
            date,
            observation
        });

        const savedBonProduction = await newBonProduction.save();
        res.status(201).json(savedBonProduction);
    } catch (error) {
        console.error('Erreur lors de la création du bon de production:', error);
        res.status(500).json({ message: 'Erreur lors de la création du bon de production', error: error.message });
    }
});

// Obtenir tous les bons de production
router.get('/', async (req, res) => {
    try {
        const bonsProduction = await BonProduction.find()
              .populate({
                path: 'client_id',
                select: 'name',
                model: 'Client'
            })
            .populate({
                path: 'formules.formula',
                select: 'name', // Sélectionne uniquement le nom de la formule
                model: 'Formula' // Assurez-vous que le nom du modèle correspond exactement à celui utilisé lors de l'enregistrement du modèle
            });

        // Ajout du nombre de bons de production à la réponse
        const count = bonsProduction.length;

        // Retourne les bons de production avec le nombre total
        res.status(200).json({
            count,
            bonsProduction
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des bons de production:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des bons de production', error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    // Ajoutez ici le code pour la mise à jour d'un bon de production
});

router.delete('/:id', async (req, res) => {
    // Ajoutez ici le code pour la suppression d'un bon de production
});

router.put('/:id', async (req, res) => {
  try {
      const updatedBonProduction = await BonProduction.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedBonProduction) {
          return res.status(404).json({ message: 'Bon de production non trouvé' });
      }
      res.status(200).json(updatedBonProduction);
  } catch (error) {
      console.error('Erreur lors de la mise à jour du bon de production:', error);
      res.status(500).json({ message: 'Erreur lors de la mise à jour du bon de production', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
      const deletedBonProduction = await BonProduction.findByIdAndDelete(req.params.id);
      if (!deletedBonProduction) {
          return res.status(404).json({ message: 'Bon de production non trouvé' });
      }
      res.status(200).json({ message: 'Bon de production supprimé avec succès' });
  } catch (error) {
      console.error('Erreur lors de la suppression du bon de production:', error);
      res.status(500).json({ message: 'Erreur lors de la suppression du bon de production', error: error.message });
  }
});

module.exports = router;