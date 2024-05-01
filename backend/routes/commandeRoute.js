const express = require('express');
const router = express.Router();
const Commande = require('../models/commande');
const Provider = require('../models/provider'); // Import correct du modèle Provider
const Product = require('../models/product'); // Import correct du modèle Product

// Route pour créer une commande
router.post('/', async (req, res) => {
    try {
        const { code_commande, provider_name, date_commande, observation, produits } = req.body;

        // Trouver l'ID du fournisseur à partir de son nom
        const provider = await Provider.findOne({ name: provider_name });
        if (!provider) {
            return res.status(404).json({ message: 'Fournisseur non trouvé' });
        }

        // Convertir les noms de produits en IDs
        const productIdsWithQuantity = await Promise.all(produits.map(async ({ product_name, quantity }) => {
            const product = await Product.findOne({ name: product_name });
            if (!product) {
                throw new Error(`Produit ${product_name} non trouvé`);
            }
            return { product: product._id, quantity };
        }));

        const newCommande = new Commande({
            code_commande,
            provider_id: provider._id,
            date_commande: date_commande || Date.now(),
            observation,
            produits: productIdsWithQuantity
        });

        const savedCommande = await newCommande.save();
        res.status(201).json(savedCommande);
    } catch (error) {
        console.error('Erreur lors de la création de la commande:', error);
        res.status(500).json({ message: 'Erreur lors de la création de la commande', error: error.message });
    }
});

// Route pour récupérer toutes les commandes
router.get('/', async (req, res) => {
    try {
        const commandes = await Commande.find()
            .populate({
                path: 'provider_id',
                select: 'name', // Assurez-vous de sélectionner les champs requis
                model: 'provider' // Utilisez le nom exact utilisé lors de l'enregistrement du modèle
            })
            .populate({
                path: 'produits.product',
                select: 'name', // Assurez-vous de sélectionner les champs requis
                model: 'Product' // Utilisez le nom exact utilisé lors de l'enregistrement du modèle
            });

          // Ajout du nombre de commandes à la réponse
            const nombreDeCommandes = commandes.length;

            // Retourne les commandes avec le nombre total
             res.status(200).json({
             nombreDeCommandes,
             commandes
   });    } catch (error) {
        console.error('Erreur lors de la récupération des commandes:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des commandes', error: error.message });
    }
});

module.exports = router;
