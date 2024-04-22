const express = require("express");
const Product = require("../models/product");
const Provider = require("../models/provider");

const router = express.Router();

// Route pour créer un nouveau produit
router.post('/', async (request, response) => {
    try {
        // Vérification que tous les champs obligatoires sont remplis
        if (
            !request.body.name ||
            !request.body.category ||
            !request.body.quantity 
        ) {
            return response.status(400).send({
                message: 'Please send all required fields: name, category, price, quantity.',
            });
        }

      
        const newProduct = {
            name: request.body.name,
            description: request.body.description || '',
            category: request.body.category,
            quantity: request.body.quantity,
        };
        const product = await Product.create(newProduct);
        return response.status(201).send(product);

    } catch (error) {
        console.error(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route pour obtenir tous les produits depuis la base de données
router.get('/', async (request, response) => {
    try {
        const products = await Product.find({});
        return response.status(200).json({
            count: products.length,
            data: products,
        });
    } catch (error) {
        console.error(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route pour obtenir un produit depuis la base de données
router.get('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const product = await Product.findById(id);
        if (!product) {
            return response.status(404).json({ message: 'Product not found.' });
        }
        return response.status(200).json(product);
    } catch (error) {
        console.error(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route pour mettre à jour un produit
router.put('/:id', async (request, response) => {
    try {
        // Vérification que tous les champs obligatoires sont remplis
        if (
            !request.body.name ||
            !request.body.category ||
            !request.body.quantity 
        ) {
            return response.status(400).send({
                message: 'Please send all required fields: name, category, price, quantity, provider.',
            });
        }

        // Vérification si le fournisseur existe
        const provider = await Provider.findById(request.body.provider);
        if (!provider) {
            return response.status(404).send({
                message: 'Provider not found.',
            });
        }

        const { id } = request.params;
        const result = await Product.findByIdAndUpdate(id, request.body);
        if (!result) {
            return response.status(404).json({ message: 'Product not found.' });
        }
        return response.status(200).send({ message: 'Product updated successfully.' });
    } catch (error) {
        console.error(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route pour supprimer un produit
router.delete('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const result = await Product.findByIdAndDelete(id);
        if (!result) {
            return response.status(404).json({ message: 'Product not found.' });
        }
        return response.status(200).send({ message: 'Product deleted successfully.' });
    } catch (error) {
        console.error(error.message);
        response.status(500).send({ message: error.message });
    }
});

module.exports = router;
