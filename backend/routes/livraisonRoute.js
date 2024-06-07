const express = require('express');
const Client = require("../models/client");
const Camion = require("../models/camion");
const Chauffeur = require("../models/chauffeur");
const Livraison = require("../models/livraison");

const router = express.Router();

// Route pour créer une nouvelle livraison
router.post('/', async (req, res) => {
    try {
        const { date_livraison, adresse_livraison, client_name, etat_livraison, quantite, camion_code, chauffeur_name } = req.body;

        if (!date_livraison || !adresse_livraison || !client_name || !etat_livraison || !quantite || !camion_code || !chauffeur_name) {
            return res.status(400).send({
                message: 'Veuillez fournir tous les champs requis : date_livraison, adresse_livraison, client_name, etat_livraison, quantite, camion_code, chauffeur_name',
            });
        }

        // Rechercher les identifiants correspondants
        const client = await Client.findOne({ name: client_name });
        if (!client) {
            console.error('Client non trouvé:', client_name);
            return res.status(400).send({ message: 'Client non trouvé' });
        }

        const camion = await Camion.findOne({ numero_plaque: camion_code });
        if (!camion) {
            console.error('Camion non trouvé:', camion_code);
            return res.status(400).send({ message: 'Camion non trouvé' });
        }

        const chauffeur = await Chauffeur.findOne({ nom: chauffeur_name });
        if (!chauffeur) {
            console.error('Chauffeur non trouvé:', chauffeur_name);
            return res.status(400).send({ message: 'Chauffeur non trouvé' });
        }

        // Génération du code livraison
        const currentYear = new Date().getFullYear();
        const livraisonCount = await Livraison.countDocuments();
        const codeLivraison = `BL${livraisonCount + 1}${currentYear}`;

        const newLivraison = new Livraison({
            date_livraison,
            adresse_livraison,
            client_id: client._id,
            etat_livraison,
            quantite,
            camion_id: camion._id,
            chauffeur_id: chauffeur._id,
            codeLivraison
        });

        const livraison = await newLivraison.save();
        return res.status(201).send(livraison);

    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
});

// Route pour obtenir toutes les livraisons
router.get('/', async (req, res) => {
    try {
        const livraisons = await Livraison.find().populate('client_id').populate('camion_id').populate('chauffeur_id');
        const count = await Livraison.countDocuments();
        return res.status(200).json({
            count,
            data: livraisons
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
});

module.exports = router;
router.get('/stats', async (req, res) => {
    try {
        const total = await Livraison.countDocuments();
        const enCours = await Livraison.countDocuments({ etat_livraison: 'En cours' });
        const complete = await Livraison.countDocuments({ etat_livraison: 'Complétée' });
        const enRetard = await Livraison.countDocuments({ etat_livraison: 'En retard' });

        res.json({ total, enCours, complete, enRetard });
    } catch (error) {
        res.status(500).send(error.message);
    }
});
// Route pour obtenir une livraison spécifique par ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const livraison = await Livraison.findById(id).populate('client_id').populate('camion_id').populate('chauffeur_id');
        if (!livraison) {
            return res.status(404).send({ message: 'Livraison non trouvée' });
        }
        return res.status(200).json(livraison);
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
});

// Route pour mettre à jour une livraison
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedLivraison = req.body;
        const result = await Livraison.findByIdAndUpdate(id, updatedLivraison, { new: true });
        if (!result) {
            return res.status(404).send({ message: 'Livraison non trouvée' });
        }
        return res.status(200).send({ message: 'Livraison mise à jour avec succès', data: result });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
});

// Route pour supprimer une livraison
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Livraison.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).send({ message: 'Livraison non trouvée' });
        }
        return res.status(200).send({ message: 'Livraison supprimée avec succès' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
});
// Route pour mettre à jour l'état de la livraison
router.put('/:id/etat', async (req, res) => {
    try {
        const { id } = req.params;
        const { etat_livraison } = req.body;
        const result = await Livraison.findByIdAndUpdate(id, { etat_livraison }, { new: true });
        if (!result) {
            return res.status(404).send({ message: 'Livraison non trouvée' });
        }
        return res.status(200).send({ message: 'État de la livraison mis à jour avec succès', data: result });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
});

module.exports = router;
