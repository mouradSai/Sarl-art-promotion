const express = require('express');
const router = express.Router();
const CommandeProductionVente = require('../models/commande_production_vente');
const Client = require('../models/client');
const ProductFinished = require('../models/productfinished');
router.post('/', async (req, res) => {
    try {
        const { code_commande, date_commande, observation, client_name, produits, versement, modePaiement } = req.body;

        // Finding the client by name
        const client = await Client.findOne({ name: client_name });
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }

        const productDetails = [];
        for (const { productionCode, quantity, prixUnitaire } of produits) {
            const product = await ProductFinished.findOne({ productionCode });
            if (!product) {
                return res.status(404).json({ message: `Finished product not found for production code: ${productionCode}` });
            }

            // Vérifier si la quantité commandée est disponible en stock
            if (product.volumeProduced < quantity) {
                return res.status(400).json({ message: `La quantité demandée de ${product.productionCode} est supérieure à celle en stock. Quantité disponible: ${product.volumeProduced}` });
            }

            // Soustraire la quantité commandée du volume produit
            product.volumeProduced -= quantity;
            await product.save();

            const totalLigne = quantity * prixUnitaire;
            productDetails.push({
                productfinished: product._id,
                quantity,
                prixUnitaire,
                totalLigne
            });
        }

        const totalCommande = productDetails.reduce((acc, item) => acc + item.totalLigne, 0);

        const newCommandeProductionVente = new CommandeProductionVente({
            code_commande,
            client_id: client._id,
            date_commande,
            observation,
            produits: productDetails,
            totalCommande,
            versement,
            modePaiement
        });

        const savedCommandeProductionVente = await newCommandeProductionVente.save();
        res.status(201).json(savedCommandeProductionVente);
    } catch (error) {
        console.error('Error creating production sale order:', error);
        res.status(500).json({ message: 'Error creating production sale order', error: error.message });
    }
});


// Route to retrieve all production sale orders
router.get('/', async (req, res) => {
    try {
        const commandesProductionVente = await CommandeProductionVente.find()
            .populate('client_id', 'name') // Selecting only the name of the client
            .populate('produits.productfinished', 'productionCode formulaName'); // Selecting productionCode and formulaName

        res.status(200).json({ count: commandesProductionVente.length, commandesProductionVente });
    } catch (error) {
        console.error('Error retrieving production sale orders:', error);
        res.status(500).json({ message: 'Error retrieving production sale orders', error: error.message });
    }
});

// Route to update a production sale order
router.put('/:id', async (req, res) => {
    try {
        const { produits, ...otherData } = req.body;
        const commandeToUpdate = await CommandeProductionVente.findById(req.params.id);
        if (!commandeToUpdate) {
            return res.status(404).json({ message: 'Production sale order not found' });
        }

        const updatedProducts = produits.map(({ productfinished_id, quantity, prixUnitaire }) => {
            const totalLigne = quantity * prixUnitaire;
            return {
                productfinished: productfinished_id,
                quantity,
                prixUnitaire,
                totalLigne
            };
        });

        commandeToUpdate.set({
            ...otherData,
            produits: updatedProducts,
            totalCommande: updatedProducts.reduce((acc, item) => acc + item.totalLigne, 0)
        });

        const savedCommandeProductionVente = await commandeToUpdate.save();
        res.status(200).json(savedCommandeProductionVente);
    } catch (error) {
        console.error('Error updating production sale order:', error);
        res.status(500).json({ message: 'Error updating production sale order', error: error.message });
    }
});

// Route to delete a production sale order
router.delete('/:id', async (req, res) => {
    try {
        const deletedCommande = await CommandeProductionVente.findByIdAndDelete(req.params.id);
        if (!deletedCommande) {
            return res.status(404).json({ message: 'Production sale order not found' });
        }
        res.status(200).json({ message: 'Production sale order deleted successfully' });
    } catch (error) {
        console.error('Error deleting production sale order:', error);
        res.status(500).json({ message: 'Error deleting production sale order', error: error.message });
    }
});

module.exports = router;
