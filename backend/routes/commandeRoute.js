// routes/commandes.js
const express = require('express');
const router = express.Router();
const Commande = require('../models/commande'); // Correction du nom du modèle

// Route pour créer une commande
router.post('/', async (req, res) => {
    try {
        const { code_commande, provider_id,date_commande, produits } = req.body;
        if (!code_commande || !provider_id ||date_commande|| produits.length === 0) {
            return res.status(400).json({ message: 'Données manquantes pour créer la commande' });
        }
        const newCommande = new Commande({
            code_commande,
            provider_id,
            date_commande,
            produits

        });
        const savedCommande = await newCommande.save();
        res.status(201).json(savedCommande);
    } catch (error) {
        console.error('Erreur lors de la création de la commande:', error);
        res.status(500).json({ message: 'Erreur lors de la création de la commande', error: error.message });
    }
});
// Route pour récupérer toutes les commandes avec uniquement l'ID du fournisseur
router.get('/', async (req, res) => {
    try {
        const commandes = await Commande.find().populate('provider_id', '_id'); // Utilisation de la projection pour inclure uniquement l'ID du fournisseur
        res.status(200).json(commandes);
    } catch (error) {
        console.error('Erreur lors de la récupération des commandes:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des commandes', error: error.message });
    }
});


module.exports = router;


