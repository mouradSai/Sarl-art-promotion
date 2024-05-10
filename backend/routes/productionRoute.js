const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Production = require('../models/production');
const Formula = require('../models/Formula');
const Product = require('../models/product'); // Assuming this is the model for your products


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

        // Create the production if all materials are available in sufficient quantities
        const production = new Production({
            codeProduction,
            formula: formulaId,
            volumeDesired,
            // description,
            materialsUsed,
            observations
        });
        await production.save();

        // Deduct the used quantities from the product stock
        for (const material of materialsUsed) {
            await Product.findByIdAndUpdate(material.product, {
                $inc: { quantity: -material.quantity }
            });
        }

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
