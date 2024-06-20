const express = require('express');
const router = express.Router();
const CommandeAchat = require('../models/commande_achat');
const Provider = require('../models/provider'); // Import correct du modèle Provider
const Product = require('../models/product'); // Import correct du modèle Product
router.post('/', async (req, res) => {
    try {
        const { code_commande, provider_name, date_commande, observation, produits, versement, modePaiement, code_cheque } = req.body;

        const provider = await Provider.findOne({ name: provider_name });
        if (!provider) {
            return res.status(404).json({ message: 'Fournisseur non trouvé' });
        }

        const productDetails = await Promise.all(produits.map(async ({ product_name, quantity, prixUnitaire }) => {
            const product = await Product.findOne({ name: product_name });
            if (!product) {
                throw new Error(`Produit ${product_name} non trouvé`);
            }

            const updatedQuantity = product.quantity + quantity;
            let updatedPrixUnitaire;

            // Arrondir prixUnitaire à deux décimales
            const roundedPrixUnitaire = parseFloat(prixUnitaire.toFixed(2));

            if (product.prixUnitaire === 0) {
                updatedPrixUnitaire = roundedPrixUnitaire;
            } else {
                // Calcul de la moyenne pondérée selon les quantités et les prix unitaires
                updatedPrixUnitaire = ((product.prixUnitaire * product.quantity) + (roundedPrixUnitaire * quantity)) / updatedQuantity;
                updatedPrixUnitaire = parseFloat(updatedPrixUnitaire.toFixed(2)); // Arrondir le résultat à deux décimales
            }

            await Product.findByIdAndUpdate(product._id, { $set: { quantity: updatedQuantity, prixUnitaire: updatedPrixUnitaire } });

            const totalLigne = quantity * roundedPrixUnitaire;
            return { product: product._id, quantity, prixUnitaire: roundedPrixUnitaire, totalLigne: parseFloat(totalLigne.toFixed(2)) };
        }));

        const totalCommande = productDetails.reduce((acc, item) => acc + item.totalLigne, 0);

        const newCommandeAchat = new CommandeAchat({
            code_commande,
            provider_id: provider._id,
            date_commande: date_commande || new Date(),
            observation,
            produits: productDetails,
            totalCommande: parseFloat(totalCommande.toFixed(2)),
            versement,
            modePaiement,
            code_cheque
        });

        const savedCommandeAchat = await newCommandeAchat.save();
        res.status(201).json(savedCommandeAchat);
    } catch (error) {
        console.error('Erreur lors de la création de la commande dachat:', error);
        res.status(500).json({ message: 'Erreur lors de la création de la commande', error: error.message });
    }
});

// Route pour récupérer toutes les commandes d'achat
router.get('/', async (req, res) => {
    try {
        const commandesAchat = await CommandeAchat.find()
            .populate({
                path: 'provider_id',
                select: 'name', // Sélectionne uniquement le nom du fournisseur
                model: 'provider' // Assurez-vous que le nom du modèle correspond exactement à celui utilisé lors de l'enregistrement du modèle
            })
            .populate({
                path: 'produits.product',
                select: 'name', // Sélectionne uniquement le nom du produit
                model: 'Product' // Assurez-vous que le nom du modèle correspond exactement à celui utilisé lors de l'enregistrement du modèle
            });

        // Ajout du nombre de commandes à la réponse
        const count = commandesAchat.length;

        // Retourne les commandes avec le nombre total
        res.status(200).json({
            count,
            commandesAchat
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des commandes d achat:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des commandes d achat', error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { produits, ...otherData } = req.body;

        // Récupérer la commande existante
        const commandeToUpdate = await CommandeAchat.findById(req.params.id);
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

        const savedCommandeAchat = await commandeToUpdate.save();
        res.status(200).json(savedCommandeAchat);
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la commande:', error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour de la commande', error: error.message });
    }
});


// Route pour supprimer une commande d'achat
router.delete('/:id', async (req, res) => {
    try {
        const deletedCommande = await CommandeAchat.findByIdAndDelete(req.params.id);
        if (!deletedCommande) {
            return res.status(404).json({ message: 'Commande non trouvée' });
        }
        res.status(200).json({ message: 'Commande supprimée avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression de la commande:', error);
        res.status(500).json({ message: 'Erreur lors de la suppression de la commande', error: error.message });
    }
});

module.exports = router;
