const express = require("express");
const Provider = require("../models/provider");

const router = express.Router();

// Route pour créer un nouveau fournisseur
router.post('/', async (request, response) => {
    try {
        if (
            !request.body.name ||
            !request.body.address ||
            !request.body.description ||
            !request.body.number
        ) {
            return response.status(400).send({
                message: 'Veuillez fournir tous les champs requis : name, address, description, number',
            });
        }
           // Vérifier si un produit avec le même nom existe déjà
           const existingProvider = await Provider.findOne({ name: request.body.name });
           if (existingProvider) {
               return response.status(409).send({ message: "Un fournisseur  avec le même nom existe déjà" });
           }

        const newProvider = {
            name: request.body.name,
            address: request.body.address,
            description: request.body.description,
            number: request.body.number,
            comment: request.body.comment,
            IsActive: request.body.IsActive || true,
        };

        const provider = await Provider.create(newProvider);
        return response.status(201).send(provider);

    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});
// Route pour obtenir tous les fournisseurs de la base de données avec possibilité de filtrage par IsActive
router.get('/', async (request, response) => {
    try {
        // Vérifie si le paramètre IsActive est présent dans la requête
        const isActiveParam = request.query.IsActive;

        // Définir le filtre en fonction de la valeur du paramètre IsActive
        const filter = isActiveParam === 'true' ? { IsActive: true } : {};

        // Récupérer les fournisseurs en utilisant le filtre
        const providers = await Provider.find(filter);
        const count = await Provider.countDocuments(filter); // Nombre total de fournisseurs en fonction du filtre

        // Retourner la réponse avec les fournisseurs filtrés
        return response.status(200).json({
            count: count,
            data: providers
        });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});


// Route pour obtenir un fournisseur spécifique de la base de données
router.get('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const provider = await Provider.findById(id);
        return response.status(200).json(provider);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route pour mettre à jour un fournisseur
router.put('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const updatedProvider = request.body;
        const result = await Provider.findByIdAndUpdate(id, updatedProvider);
        if (!result) {
            return response.status(404).json({ message: 'Fournisseur non trouvé' });
        }
        return response.status(200).send({ message: 'Fournisseur mis à jour avec succès' });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route pour supprimer un fournisseur
router.delete('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const result = await Provider.findByIdAndDelete(id);
        if (!result) {
            return response.status(404).json({ message: 'Fournisseur non trouvé' });
        }
        return response.status(200).send({ message: 'Fournisseur supprimé avec succès' });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

module.exports = router;
