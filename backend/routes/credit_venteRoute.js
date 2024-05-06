const express = require('express');
const router = express.Router();
const CreditVente = require('../models/credit_vente'); // Updated to CreditVente
const CommandeVente = require('../models/commande_vente'); // Updated to CommandeVente
const Client = require('../models/client'); // Updated to Client

router.get('/', async (req, res) => {
    try {
        const credits = await CreditVente.find()
            .populate({
                path: 'commande',
                model: 'CommandeVente', // Updated to CommandeVente
                select: 'code_commande totalCommande versement modePaiement client_id', // Updated to client_id
                populate: {
                    path: 'client_id', // Updated to client_id
                    model: 'Client', // Updated to Client
                    select: 'name'
                }
            });

        const results = credits.map(credit => {
            const commande = credit.commande;
            const resteAPayer = commande.totalCommande - (commande.versement || 0);
            return {
                ...credit.toJSON(),
                commande: {
                    ...commande.toJSON(),
                    resteAPayer: resteAPayer
                }
            };
        });

        res.status(200).json(results);
    } catch (error) {
        console.error('Error retrieving credits:', error);
        res.status(500).json({ message: 'Error retrieving credits', error: error.message });
    }
});

// POST route to add a payment
router.post('/add-payment/:id', async (req, res) => {
    try {
        const creditId = req.params.id;
        const { newPayment } = req.body;

        const credit = await CreditVente.findById(creditId).populate({
            path: 'commande',
            model: 'CommandeVente' // Updated to CommandeVente
        });

        if (!credit) {
            return res.status(404).json({ message: 'Credit not found' });
        }

        const currentPayment = credit.commande.versement || 0;
        const totalDue = credit.commande.totalCommande;
        const newTotalPayment = currentPayment + newPayment;

        if (newTotalPayment > totalDue) {
            return res.status(400).json({ message: 'Payment exceeds the total due amount' });
        }

        credit.commande.versement = newTotalPayment;
        const resteAPayer = totalDue - newTotalPayment;

        if (resteAPayer <= 0) {
            credit.isPaid = true; // Assuming you have a flag to indicate completion
        }

        await credit.commande.save();
        await credit.save();

        res.status(200).json({ message: 'Payment added successfully', resteAPayer });
    } catch (error) {
        console.error('Error adding payment:', error);
        res.status(500).json({ message: 'Error adding payment', error: error.message });
    }
});
//delet 


router.delete('/delete-by-commande/:codeCommande', async (req, res) => {
    try {
        const { codeCommande } = req.params;

        // Find all CommandeVente documents with the provided code_commande
        const commandes = await CommandeVente.find({ code_commande: codeCommande });
        const commandeIds = commandes.map(cmd => cmd._id);

        // Delete all CreditVente documents linked to these CommandeVente IDs
        const result = await CreditVente.deleteMany({ commande: { $in: commandeIds } });

        res.status(200).json({ message: 'Credits deleted successfully', deletedCount: result.deletedCount });
    } catch (error) {
        console.error('Error deleting credits:', error);
        res.status(500).json({ message: 'Error deleting credits', error: error.message });
    }
});
module.exports = router;
