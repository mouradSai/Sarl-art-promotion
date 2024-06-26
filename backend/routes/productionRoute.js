const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Production = require('../models/production');
const ProductFinished = require('../models/productfinished');
const Formula = require('../models/Formula');
const Product = require('../models/product');

// Endpoint to create a production
router.post('/', async (req, res) => {
    try {
        const { formulaId, volumeDesired, codeProduction, description, observations } = req.body;

        // Find the formula by ID and populate the products
        const formula = await Formula.findById(formulaId).populate('products.product');
        if (!formula) {
            return res.status(404).send({ message: 'Formula not found' });
        }

        // Calculate the quantities needed for each product
        const materialsUsed = formula.products.map(p => ({
            product: p.product._id,
            quantity: p.quantity * volumeDesired
        }));

        // Check stock availability for each product
        for (const material of materialsUsed) {
            const product = await Product.findById(material.product);
            if (product.quantity < material.quantity) {
                return res.status(400).send({
                    message: `Not enough stock for ${product.name}. Required: ${material.quantity}, Available: ${product.quantity}`
                });
            }
        }

        // Calculate the average unit price of the materials used
        const totalUnitPrice = await Promise.all(materialsUsed.map(async material => {
            const product = await Product.findById(material.product);
            return product.prixUnitaire * material.quantity;
        }));
        const totalQuantity = materialsUsed.reduce((sum, material) => sum + material.quantity, 0);
        const averageUnitPrice = totalUnitPrice.reduce((sum, price) => sum + price, 0) / totalQuantity;

        // Create the production if all materials are available in sufficient quantities
        const production = new Production({
            codeProduction,
            formula: formulaId,
            volumeDesired,
            materialsUsed,
            observations,
            prixUnitaire: averageUnitPrice // Stocking the calculated average unit price
        });
        await production.save();

        // Deduct the used quantities from the product stock
        for (const material of materialsUsed) {
            await Product.findByIdAndUpdate(material.product, {
                $inc: { quantity: -material.quantity }
            });
        }

        // Create an entry in ProductFinished collection
        const productFinished = new ProductFinished({
            productionCode: codeProduction,
            volumeProduced: volumeDesired,
            formulaName: formula.name, // Assuming the formula has a 'name' field
            prixUnitaire: averageUnitPrice // Adding the average unit price to finished product
        });
        await productFinished.save();

        res.status(201).json(production);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: error.message });
    }
});

// Endpoint pour obtenir tous les produits finis
router.get('/finished-products', async (req, res) => {
    try {
        const finishedProducts = await ProductFinished.find();
        res.status(200).json(finishedProducts);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: error.message });
    }
});

// Endpoint pour supprimer un produit fini par son ID
router.delete('/finished-products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await ProductFinished.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).send({ message: 'Product not found' });
        }
        res.status(200).send({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: error.message });
    }
});

// Endpoint pour obtenir toutes les productions
router.get('/', async (req, res) => {
    try {
        const productions = await Production.find().populate('formula').populate('materialsUsed.product');
        res.status(200).json({
            count: productions.length,
            productions
        });
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
