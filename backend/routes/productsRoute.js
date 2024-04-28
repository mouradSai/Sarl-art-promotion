const express = require("express");
const Product = require("../models/product");

const router = express.Router();

// Route pour créer un nouveau produit
router.post('/', async (request, response) => {
    try {
        if (
            !request.body.name ||
            !request.body.category ||
            !request.body.entrepot ||
            !request.body.quantity ||
            !request.body.unit
        ) {
            return response.status(400).send({
                message: 'Veuillez fournir tous les champs requis : name, category, entrepot, quantity, unit',
            });
        }

        const newProduct = {
            name: request.body.name,
            category: request.body.category,
            entrepot: request.body.entrepot,
            quantity: request.body.quantity,
            unit: request.body.unit,
            description: request.body.description,
            IsActive: request.body.IsActive || true,
        };

        const product = await Product.create(newProduct);
        return response.status(201).send(product);

    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route pour obtenir tous les produits de la base de données
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

// Route pour obtenir un produit spécifique de la base de données
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
        const updatedProduct = request.body;
        const result = await Product.findByIdAndUpdate(id, updatedProduct);
        if (!result) {
            return response.status(404).json({ message: 'Produit non trouvé' });
        }
        return response.status(200).send({ message: 'Produit mis à jour avec succès' });
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
            return response.status(404).json({ message: 'Produit non trouvé' });
        }
        return response.status(200).send({ message: 'Produit supprimé avec succès' });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

module.exports = router;
