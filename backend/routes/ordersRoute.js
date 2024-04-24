// Backend
const express = require("express");
const Order = require("../models/Order");

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const requiredFields = ['provider', 'date', 'product', 'description', 'quantity', 'unitPrice', 'subtotal'];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).send({ message: `Missing required field: ${field}` });
            }
        }

        const newOrder = req.body;
        const order = await Order.create(newOrder);
        return res.status(201).send(order);
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const orders = await Order.find({});
        return res.status(200).json({ count: orders.length, data: orders });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        return res.status(200).json(order);
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const result = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!result) {
            return res.status(404).json({ message: 'Order not found' });
        }
        return res.status(200).send({ message: 'Order updated successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const result = await Order.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).json({ message: 'Order not found' });
        }
        return res.status(200).send({ message: 'Order deleted successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
});

module.exports = router;
