const express = require('express');
const router = express.Router();
const Production = require('../models/production');
const Formula = require('../models/Formula');

// Endpoint pour créer une production
router.post('/', async (req, res) => {
    try {
        const { formulaId, volumeDesired, codeProduction, description, observations } = req.body;

        // Trouver la formule par ID et peupler les produits
        const formula = await Formula.findById(formulaId).populate('products.product');
        if (!formula) {
            return res.status(404).send({ message: 'Formula not found' });
        }

        // Calculer les quantités nécessaires pour chaque produit
        const materialsUsed = formula.products.map(p => ({
            product: p.product._id,  // Sauvegarde l'ID du produit
            quantity: p.quantity * volumeDesired  // Calcule la quantité basée sur le volume désiré
        }));

        // Créer la production
        const production = new Production({
            codeProduction,
            formula: formulaId,
            volumeDesired,
            description,
            materialsUsed,
            observations
        });

        await production.save();

        res.status(201).json(production);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: error.message });
    }
});
// Endpoint pour obtenir toutes les productions
router.get('/', async (req, res) => {
    try {
        const productions = await Production.find().populate('formula').populate('materialsUsed.product');
        res.status(200).json(productions);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: error.message });
    }
});
// Endpoint pour obtenir une production spécifique par ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const production = await Production.findById(id).populate('formula').populate('materialsUsed.product');
        if (!production) {
            return res.status(404).send({ message: 'Production not found' });
        }
        res.status(200).json(production);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: error.message });
    }
});
// Endpoint pour supprimer une production par ID
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const production = await Production.findByIdAndDelete(id);
        if (!production) {
            return res.status(404).send({ message: 'Production not found' });
        }
        res.status(200).send({ message: 'Production deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: error.message });
    }
});

module.exports = router;
