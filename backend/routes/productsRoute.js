const express = require("express");
const Product = require ("../models/product"); // Importe le modèle de produit

const router = express.Router();

// Route pour ajouter un nouveau produit
router.post('/', async (request, response) => {
    try {
        if (
            !request.body.name ||
            !request.body.description ||
            !request.body.category ||
            !request.body.quantity ||
            !request.body.unit
        ) {
            return response.status(400).send({
                message: 'Send all required fields: name, description, category, quantity, unit',
            });
        }

        const newProduct = {
            name: request.body.name,
            description: request.body.description,
            category: request.body.category,
            quantity: request.body.quantity,
            unit: request.body.unit,
        };
        const product = await Product.create(newProduct);
        return response.status(201).send(product);

    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route pour obtenir tous les produits depuis la base de données
router.get('/', async (request, response) => {
    try {
        const products = await Product.find({});
        return response.status(200).json({
            count: products.length,
            data: products
        });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route pour obtenir un produit depuis la base de données
router.get('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const product = await Product.findById(id);
        return response.status(200).json(product);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route pour mettre à jour un produit
router.put('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const result = await Product.findByIdAndUpdate(id, request.body);
        if (!result) {
            return response.status(404).json({ message: 'Product not found' });
        }
        return response.status(200).send({ message: 'Product updated successfully' });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route pour supprimer un produit
router.delete('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const result = await Product.findByIdAndDelete(id);
        if (!result) {
            return response.status(404).json({ message: 'Product not found' });
        }
        return response.status(200).send({ message: 'Product deleted successfully' });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

module.exports = router;
