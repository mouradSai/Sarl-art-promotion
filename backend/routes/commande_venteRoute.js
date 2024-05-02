const express = require('express');
const router = express.Router();
const CommandeVente = require('../models/commande_vente');
const Client = require('../models/client'); // Import correct du modèle Client
const Product = require('../models/product'); // Import correct du modèle Product

// Route pour créer une commande de vente
router.post('/', async (req, res) => {
    try {
        const { code_commande, client_name, date_commande, observation, produits } = req.body;

        // Trouver l'ID du client à partir de son nom
        const client = await Client.findOne({ name: client_name });
        if (!client) {
            return res.status(404).json({ message: 'Client non trouvé' });
        }

        // Convertir les noms de produits en IDs, calculer les totaux et mettre à jour les quantités de stock
        const productDetails = await Promise.all(produits.map(async ({ product_name, quantity, prixUnitaire }) => {
            const product = await Product.findOne({ name: product_name });
            if (!product) {
                throw new Error(`Produit ${product_name} non trouvé`);
            }
            const updatedQuantity = product.quantity - quantity; // Quantité déduite pour une vente
            if (updatedQuantity < 0) {
                throw new Error(`Quantité insuffisante pour ${product_name}`);
            }
            await Product.findByIdAndUpdate(product._id, { $set: { quantity: updatedQuantity } });

            const totalLigne = quantity * prixUnitaire;
            return { product: product._id, quantity, prixUnitaire, totalLigne };
        }));

        const totalCommande = productDetails.reduce((acc, item) => acc + item.totalLigne, 0);

        const newCommandeVente = new CommandeVente({
            code_commande,
            client_id: client._id,
            date_commande: date_commande || new Date(),
            observation,
            produits: productDetails,
            totalCommande
        });

        const savedCommandeVente = await newCommandeVente.save();
        res.status(201).json(savedCommandeVente);
    } catch (error) {
        console.error('Erreur lors de la création de la commande de vente:', error);
        res.status(500).json({ message: 'Erreur lors de la création de la commande', error: error.message });
    }
});

// Route pour récupérer toutes les commandes de vente
router.get('/', async (req, res) => {
    try {
        const commandesVente = await CommandeVente.find()
            .populate({
                path: 'client_id',
                select: 'name', // Sélectionne uniquement le nom du client
                model: 'Client' // Assurez-vous que le nom du modèle correspond exactement à celui utilisé lors de l'enregistrement du modèle
            })
            .populate({
                path: 'produits.product',
                select: 'name', // Sélectionne uniquement le nom du produit
                model: 'Product' // Assurez-vous que le nom du modèle correspond exactement à celui utilisé lors de l'enregistrement du modèle
            });

        // Ajout du nombre de commandes à la réponse
        const count = commandesVente.length;

        // Retourne les commandes avec le nombre total
        res.status(200).json({
            count,
            commandesVente
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des commandes de vente:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des commandes de vente', error: error.message });
    }
});

// Route pour mettre à jour une commande de vente
router.put('/:id', async (req, res) => {
    try {
        const { produits, ...otherData } = req.body;

        // Récupérer la commande existante
        const commandeToUpdate = await CommandeVente.findById(req.params.id);
        if (!commandeToUpdate) {
            return res.status(404).json({ message: 'Commande non trouvée' });
        }

        // Mise à jour des produits et recalcul des totaux
        const updatedProducts = await Promise.all(produits.map(async (prod) => {
            const { product_name, quantity, prixUnitaire } = prod;
            const product = await Product.findOne({ name: product_name });
            if (!product) {
                throw new Error(`Produit ${product_name} non trouvé`);
            }
            const totalLigne = quantity * prixUnitaire;
            return { product: product._id, quantity, prixUnitaire, totalLigne };
        }));
        const totalCommande = updatedProducts.reduce((acc, item) => acc + item.totalLigne, 0);

        // Appliquer les mises à jour
        commandeToUpdate.set({
            ...otherData,
            produits: updatedProducts,
            totalCommande
        });

        const savedCommandeVente = await commandeToUpdate.save();
        res.status(200).json(savedCommandeVente);
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la commande de vente:', error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour de la commande', error: error.message });
    }
});

// Route pour supprimer une commande de vente
router.delete('/:id', async (req, res) => {
    try {
        const deletedCommande = await CommandeVente.findByIdAndDelete(req.params.id);
        if (!deletedCommande) {
            return res.status(404).json({ message: 'Commande non trouvée' });
        }
        res.status(200).json({ message: 'Commande supprimée avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression de la commande de vente:', error);
        res.status(500).json({ message: 'Erreur lors de la suppression de la commande', error: error.message });
    }
});

module.exports = router;
