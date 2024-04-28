const express = require("express");
const Entrepot = require("../models/entrepot"); // Import du modèle d'entrepôt

const router = express.Router();

// Route pour créer un nouvel entrepôt
router.post('/', async (req, res) => {
    try {
        const newEntrepot = req.body;
        const entrepot = await Entrepot.create(newEntrepot);
        res.status(201).send(entrepot);
    } catch (error) {
        console.error("Erreur lors de la création de l'entrepôt :", error);
        res.status(500).send({ message: "Erreur lors de la création de l'entrepôt." });
    }
});

// Route pour obtenir tous les entrepôts de la base de données
router.get('/', async (req, res) => {
    try {
        const entrepots = await Entrepot.find({});
        const count = await Entrepot.countDocuments(); // Nombre total d'entrepôts
        res.status(200).json({
            count: count,
            data: entrepots
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des entrepôts :", error);
        res.status(500).send({ message: "Erreur lors de la récupération des entrepôts." });
    }
});

// Route pour obtenir un entrepôt spécifique par son ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const entrepot = await Entrepot.findById(id);
        if (!entrepot) {
            return res.status(404).send({ message: "Entrepôt non trouvé." });
        }
        res.status(200).json(entrepot);
    } catch (error) {
        console.error("Erreur lors de la récupération de l'entrepôt :", error);
        res.status(500).send({ message: "Erreur lors de la récupération de l'entrepôt." });
    }
});

// Route pour mettre à jour un entrepôt par son ID
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedEntrepot = req.body;
        const result = await Entrepot.findByIdAndUpdate(id, updatedEntrepot, { new: true });
        if (!result) {
            return res.status(404).send({ message: "Entrepôt non trouvé." });
        }
        res.status(200).send({ message: "Entrepôt mis à jour avec succès." });
    } catch (error) {
        console.error("Erreur lors de la mise à jour de l'entrepôt :", error);
        res.status(500).send({ message: "Erreur lors de la mise à jour de l'entrepôt." });
    }
});

// Route pour supprimer un entrepôt par son ID
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Entrepot.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).send({ message: "Entrepôt non trouvé." });
        }
        res.status(200).send({ message: "Entrepôt supprimé avec succès." });
    } catch (error) {
        console.error("Erreur lors de la suppression de l'entrepôt :", error);
        res.status(500).send({ message: "Erreur lors de la suppression de l'entrepôt." });
    }
});

module.exports = router;
