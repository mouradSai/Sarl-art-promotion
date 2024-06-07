const express = require('express');
const Chauffeur = require('../models/chauffeur');

const router = express.Router();

// Route pour créer un nouveau chauffeur
router.post('/', async (req, res) => {
    try {
        const { nom, telephone, email } = req.body;
        if (!nom || !telephone || !email) {
            return res.status(400).send({
                message: 'Veuillez fournir tous les champs requis : nom, telephone, email',
            });
        }

        const newChauffeur = new Chauffeur({
            nom,
            telephone,
            email,
        });

        const chauffeur = await newChauffeur.save();
        return res.status(201).send(chauffeur);

    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
});

// Route pour obtenir tous les chauffeurs
router.get('/', async (req, res) => {
    try {
        const chauffeurs = await Chauffeur.find();
        return res.status(200).json({ data: chauffeurs });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
});

// Route pour mettre à jour un chauffeur
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedChauffeur = req.body;
        const result = await Chauffeur.findByIdAndUpdate(id, updatedChauffeur, { new: true });
        if (!result) {
            return res.status(404).send({ message: 'Chauffeur non trouvé' });
        }
        return res.status(200).send({ message: 'Chauffeur mis à jour avec succès', data: result });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
});

// Route pour mettre à jour l'état actif d'un chauffeur
router.put('/:id/active', async (req, res) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;
        const chauffeur = await Chauffeur.findByIdAndUpdate(id, { isActive }, { new: true });
        if (!chauffeur) {
            return res.status(404).send({ message: 'Chauffeur non trouvé' });
        }
        return res.status(200).send(chauffeur);
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
});

// Route pour supprimer un chauffeur
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Chauffeur.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).send({ message: 'Chauffeur non trouvé' });
        }
        return res.status(200).send({ message: 'Chauffeur supprimé avec succès' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
});

module.exports = router;
