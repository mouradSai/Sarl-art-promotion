// Backend
const express = require("express");
const Ordersell = require("../models/ordersell");

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const requiredFields = ['client', 'date', 'product', 'description', 'quantity', 'unitPrice', 'subtotal'];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).send({ message: `Missing required field: ${field}` });
            }
        }

        const newOrdersell = req.body;
        const ordersell = await Ordersell.create(newOrdersell);
        return res.status(201).send(ordersell);
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const ordersells = await Ordersell.find({});
        return res.status(200).json({ count: ordersells.length, data: ordersells });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const ordersell = await Ordersell.findById(req.params.id);
        return res.status(200).json(ordersell);
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const result = await Ordersell.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!result) {
            return res.status(404).json({ message: 'Ordersell not found' });
        }
        return res.status(200).send({ message: 'Ordersell updated successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const result = await Ordersell.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).json({ message: 'Ordersell not found' });
        }
        return res.status(200).send({ message: 'Ordersell deleted successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
});

module.exports = router;
