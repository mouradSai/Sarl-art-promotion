const express = require("express");
const Product = require("../models/product");
const Categorie = require("../models/categorie"); // Importer le modèle de catégorie
const Entrepot = require("../models/entrepot"); // Importer le modèle d'entrepôt

const router = express.Router();

// Route pour créer un nouveau produit
router.post('/', async (request, response) => {
    try {
        // Vérifier si tous les champs requis sont fournis
        if (
            !request.body.name ||
            !request.body.namecategory ||
            !request.body.nameentrepot ||
            !request.body.quantity ||
            !request.body.unit
        ) {
            return response.status(400).send({
                message: 'Veuillez fournir tous les champs requis : name, namecategory, nameentrepot, quantity, unit',
            });
        }

        // Rechercher l'ID de la catégorie en fonction du nom
        const category = await Categorie.findOne({ name: request.body.namecategory });
        if (!category) {
            return response.status(400).send({ message: "Catégorie non trouvée" });
        }

        // Rechercher l'ID de l'entrepôt en fonction du nom
        const entrepot = await Entrepot.findOne({ name: request.body.nameentrepot });
        if (!entrepot) {
            return response.status(400).send({ message: "Entrepôt non trouvé" });
        }

        // Créer un nouveau produit avec les IDs des catégories et des entrepôts trouvés
        const newProduct = {
            name: request.body.name,
            category: category._id,
            namecategory: request.body.namecategory,
            entrepot: entrepot._id,
            nameentrepot: request.body.nameentrepot,
            quantity: request.body.quantity,
            unit: request.body.unit,
            description: request.body.description,
            IsActive: request.body.IsActive || true,
        };

        // Enregistrer le nouveau produit dans la base de données
        const product = await Product.create(newProduct);

        // Répondre avec le produit créé
        return response.status(201).send(product);

    } catch (error) {
        // Gérer les erreurs et répondre avec un message d'erreur approprié
        console.error(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route pour obtenir tous les produits de la base de données avec possibilité de filtrage par IsActive
router.get('/', async (request, response) => {
    try {
        // Vérifie si le paramètre IsActive est présent dans la requête
        const isActiveParam = request.query.IsActive;

        // Définir le filtre en fonction de la valeur du paramètre IsActive
        const filter = isActiveParam === 'true' ? { IsActive: true } : {};

        // Récupérer les produits en utilisant le filtre
        const products = await Product.find(filter);
        const count = await Product.countDocuments(filter); // Nombre total de produits en fonction du filtre

        // Retourner la réponse avec les produits filtrés
        return response.status(200).json({
            count: count,
            data: products
        });
    } catch (error) {
        console.error(error.message);
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
        console.error(error.message);
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
            return response.status(404).json({ message: 'Produit non trouvé' });
        }
        return response.status(200).send({ message: 'Produit supprimé avec succès' });
    } catch (error) {
        console.error(error.message);
        response.status(500).send({ message: error.message });
    }
});

module.exports = router;
