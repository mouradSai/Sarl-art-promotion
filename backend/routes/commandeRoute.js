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
            const count = commandes.length;

            // Retourne les commandes avec le nombre total
             res.status(200).json({
             count,
             commandes
   });    } catch (error) {
        console.error('Erreur lors de la récupération des commandes:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des commandes', error: error.message });
    }
});
// Route pour mettre à jour une commande
router.put('/:id', async (req, res) => {
    try {
        const { code_commande, provider_name, date_commande, observation, produits } = req.body;
        const commandeId = req.params.id;

        // Trouver et mettre à jour la commande
        let updatedCommande = await Commande.findById(commandeId);
        if (!updatedCommande) {
            return res.status(404).json({ message: 'Commande non trouvée' });
        }

        if (provider_name) {
            const provider = await Provider.findOne({ name: provider_name });
            if (!provider) {
                return res.status(404).json({ message: 'Fournisseur non trouvé' });
            }
            updatedCommande.provider_id = provider._id;
        }

        if (produits) {
            const productIdsWithQuantity = await Promise.all(produits.map(async ({ product_name, quantity }) => {
                const product = await Product.findOne({ name: product_name });
                if (!product) {
                    throw new Error(`Produit ${product_name} non trouvé`);
                }
                return { product: product._id, quantity };
            }));
            updatedCommande.produits = productIdsWithQuantity;
        }

        updatedCommande.code_commande = code_commande || updatedCommande.code_commande;
        updatedCommande.date_commande = date_commande || updatedCommande.date_commande;
        updatedCommande.observation = observation || updatedCommande.observation;

        await updatedCommande.save();

        res.json(updatedCommande);
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la commande:', error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour de la commande', error: error.message });
    }
});

// Route pour récupérer une commande par son ID
router.get('/:id', async (req, res) => {
    try {
        const commande = await Commande.findById(req.params.id)
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

        if (!commande) {
            return res.status(404).json({ message: 'Commande non trouvée' });
        }
        res.json(commande);
    } catch (error) {
        console.error('Erreur lors de la récupération de la commande:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération de la commande', error: error.message });
    }
});

// Route pour supprimer une commande
router.delete('/:id', async (req, res) => {
    try {
        const commandeId = req.params.id;
        const commande = await Commande.findByIdAndDelete(commandeId);
        if (!commande) {
            return res.status(404).json({ message: 'Commande non trouvée' });
        }
        res.json({ message: 'Commande supprimée' });
    } catch (error) {
        console.error('Erreur lors de la suppression de la commande:', error);
        res.status(500).json({ message: 'Erreur lors de la suppression de la commande', error: error.message });
    }
});

module.exports = router;
