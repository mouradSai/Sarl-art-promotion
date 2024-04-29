const express = require("express");
const Client = require ("../models/client");

const router = express.Router();

// Route pour créer un nouveau client
router.post('/', async (request, response) => {
    try {
        if (
            !request.body.name ||
            !request.body.prenom ||
            !request.body.address ||
            !request.body.phoneNumber
        ) {
            return response.status(400).send({
                message: 'Veuillez fournir tous les champs requis : name, prenom, address, phoneNumber',
            });
        }

        const newClient = {
            name: request.body.name,
            prenom: request.body.prenom,
            description: request.body.description,
            address: request.body.address,
            phoneNumber: request.body.phoneNumber,
            isActive: request.body.isActive || true,
        };

        const client = await Client.create(newClient);
        return response.status(201).send(client);

    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route pour obtenir tous les clients de la base de données
router.get('/', async (request, response) => {
    try {
        const clients = await Client.find({});
        return response.status(200).json({
            count: clients.length,
            data: clients
        });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route pour obtenir un client spécifique de la base de données
router.get('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const client = await Client.findById(id);
        return response.status(200).json(client);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route pour mettre à jour un client
router.put('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const updatedClient = request.body;
        const result = await Client.findByIdAndUpdate(id, updatedClient);
        if (!result) {
            return response.status(404).json({ message: 'Client non trouvé' });
        }
        return response.status(200).send({ message: 'Client mis à jour avec succès' });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route pour supprimer un client
router.delete('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const result = await Client.findByIdAndDelete(id);
        if (!result) {
            return response.status(404).json({ message: 'Client non trouvé' });
        }
        return response.status(200).send({ message: 'Client supprimé avec succès' });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

module.exports = router;
