const express = require('express');
const Camion = require('../models/camion');

const router = express.Router();

// Route pour créer un nouveau camion
router.post('/', async (req, res) => {
    try {
        if (!req.body.numero_plaque || !req.body.capacite) {
            return res.status(400).send({
                message: 'Veuillez fournir tous les champs requis : numero_plaque, capacite',
            });
        }
        
        const existingCamion = await Camion.findOne({ numero_plaque: req.body.numero_plaque });
        if (existingCamion) {
            return res.status(409).send({ message: "Un camion avec le même numéro de plaque existe déjà" });
        }

        const newCamion = new Camion({
            numero_plaque: req.body.numero_plaque,
            capacite: req.body.capacite,
        });

        const camion = await newCamion.save();
        return res.status(201).send(camion);

    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
});

// Route pour obtenir tous les camions
router.get('/', async (req, res) => {
    try {
        const camions = await Camion.find();
        const count = await Camion.countDocuments();
        return res.status(200).json({
            count: count,
            data: camions
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
});

// Route pour obtenir un camion spécifique par ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const camion = await Camion.findById(id);
        if (!camion) {
            return res.status(404).send({ message: 'Camion non trouvé' });
        }
        return res.status(200).json(camion);
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
});
// Route pour mettre à jour l'état actif d'un camion
router.put('/:id/active', async (req, res) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;
        const camion = await Camion.findByIdAndUpdate(id, { isActive }, { new: true });
        if (!camion) {
            return res.status(404).send({ message: 'Camion non trouvé' });
        }
        return res.status(200).send(camion);
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
});
// Route pour mettre à jour un camion
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedCamion = req.body;
        const result = await Camion.findByIdAndUpdate(id, updatedCamion, { new: true });
        if (!result) {
            return res.status(404).send({ message: 'Camion non trouvé' });
        }
        return res.status(200).send({ message: 'Camion mis à jour avec succès', data: result });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
});

// Route pour supprimer un camion
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Camion.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).send({ message: 'Camion non trouvé' });
        }
        return res.status(200).send({ message: 'Camion supprimé avec succès' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
});

module.exports = router;
