const express = require("express");
const Order = require ("../models/Order"); // Importer le modèle Order

const router = express.Router();

// Route pour ajouter une nouvelle commande
router.post('/', async (request, response) => {
    try {
        if (
            !request.body.provider ||
            !request.body.date ||
            !request.body.product ||
            !request.body.description ||
            !request.body.quantity ||
            !request.body.unitPrice ||
            !request.body.subtotal
        ) {
            return response.status(400).send({
                message: 'Send all required fields: provider, date, product, description, quantity, unitPrice, subtotal',
            });
        }

        const newOrder = {
            provider: request.body.provider,
            date: request.body.date,
            product: request.body.product,
            description: request.body.description,
            quantity: request.body.quantity,
            unitPrice: request.body.unitPrice,
            subtotal: request.body.subtotal
        };
        const order = await Order.create(newOrder);
        return response.status(201).send(order);

    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route pour obtenir toutes les commandes depuis la base de données
router.get('/', async (request, response) => {
    try {
        const orders = await Order.find({});
        return response.status(200).json({
            count: orders.length,
            data: orders
        });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route pour obtenir une commande depuis la base de données
router.get('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const order = await Order.findById(id);
        return response.status(200).json(order);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route pour mettre à jour une commande
router.put('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const result = await Order.findByIdAndUpdate(id, request.body);
        if (!result) {
            return response.status(404).json({ message: 'Order not found' });
        }
        return response.status(200).send({ message: 'Order updated successfully' });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route pour supprimer une commande
router.delete('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const result = await Order.findByIdAndDelete(id);
        if (!result) {
            return response.status(404).json({ message: 'Order not found' });
        }
        return response.status(200).send({ message: 'Order deleted successfully' });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

module.exports = router;
