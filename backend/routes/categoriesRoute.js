const express = require("express");
const Categorie = require ("../models/categorie"); // Import du modèle de catégorie

const router = express.Router();

// Route pour créer une nouvelle catégorie
router.post('/', async (request, response) => {
    try {
        const newCategorie = request.body;
        const categorie = await Categorie.create(newCategorie);
        return response.status(201).send(categorie);
    } catch (error) {
        console.error(error.message);
        response.status(500).send({ message: "Erreur lors de la création de la catégorie." });
    }
});
// Route pour obtenir toutes les catégories de la base de données avec possibilité de filtrage par IsActive
router.get('/', async (request, response) => {
    try {
        // Vérifie si le paramètre IsActive est présent dans la requête
        const isActiveParam = request.query.IsActive;

        // Définir le filtre en fonction de la valeur du paramètre IsActive
        const filter = isActiveParam === 'true' ? { IsActive: true } : {};

        // Récupérer les catégories en utilisant le filtre
        const categories = await Categorie.find(filter);
        const count = await Categorie.countDocuments(filter); // Nombre total de catégories en fonction du filtre

        // Retourner la réponse avec les catégories filtrées
        return response.status(200).json({
            count: count,
            data: categories
        });
    } catch (error) {
        console.error(error.message);
        response.status(500).send({ message: "Erreur lors de la récupération des catégories." });
    }
});

// Route pour obtenir une catégorie spécifique de la base de données
router.get('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const categorie = await Categorie.findById(id);
        if (!categorie) {
            return response.status(404).send({ message: "Catégorie non trouvée." });
        }
        return response.status(200).json(categorie);
    } catch (error) {
        console.error(error.message);
        response.status(500).send({ message: "Erreur lors de la récupération de la catégorie." });
    }
});

// Route pour mettre à jour une catégorie
router.put('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const updatedCategorie = request.body;
        const result = await Categorie.findByIdAndUpdate(id, updatedCategorie, { new: true });
        if (!result) {
            return response.status(404).send({ message: "Catégorie non trouvée." });
        }
        return response.status(200).send({ message: "Catégorie mise à jour avec succès." });
    } catch (error) {
        console.error(error.message);
        response.status(500).send({ message: "Erreur lors de la mise à jour de la catégorie." });
    }
});

// Route pour supprimer une catégorie
router.delete('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const result = await Categorie.findByIdAndDelete(id);
        if (!result) {
            return response.status(404).send({ message: "Catégorie non trouvée." });
        }
        return response.status(200).send({ message: "Catégorie supprimée avec succès." });
    } catch (error) {
        console.error(error.message);
        response.status(500).send({ message: "Erreur lors de la suppression de la catégorie." });
    }
});

module.exports = router;
