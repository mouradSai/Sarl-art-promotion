const express = require('express');
const router = express.Router();
const CreditProductionVente = require('../models/credit_production_vente'); 
const CommandeProductionVente = require('../models/commande_production_vente'); 
const Client = require('../models/client'); 

router.get('/', async (req, res) => {
    try {
        const credits = await CreditProductionVente.find()
            .populate({
                path: 'vente',
                model: 'CommandeProductionVente', 
                select: 'code_commande totalCommande versement modePaiement client_id code_cheque', 
                populate: {
                    path: 'client_id', 
                    model: 'Client', 
                    select: 'name'
                }
            });

        const results = credits.map(credit => {
            const vente = credit.vente;
            const resteAPayer = vente.totalCommande - (vente.versement || 0);
            return {
                ...credit.toJSON(),
                vente: {
                    ...vente.toJSON(),
                    resteAPayer: resteAPayer
                }
            };
        });

        res.status(200).json(results);
    } catch (error) {
        console.error('Error retrieving production credits:', error);
        res.status(500).json({ message: 'Error retrieving production credits', error: error.message });
    }
});

// POST route to add a payment
router.post('/add-payment/:id', async (req, res) => {
    try {
        const creditId = req.params.id;
        const { newPayment } = req.body;

        const credit = await CreditProductionVente.findById(creditId).populate({
            path: 'vente',
            model: 'CommandeProductionVente' 
        });

        if (!credit) {
            return res.status(404).json({ message: 'Credit not found' });
        }

        const currentPayment = credit.vente.versement || 0;
        const totalDue = credit.vente.totalCommande;
        const newTotalPayment = currentPayment + newPayment;

        if (newTotalPayment > totalDue) {
            return res.status(400).json({ message: 'Payment exceeds the total due amount' });
        }

        credit.vente.versement = newTotalPayment;
        const resteAPayer = totalDue - newTotalPayment;

        if (resteAPayer <= 0) {
            credit.isPaid = true; 
        }

        await credit.vente.save();
        await credit.save();

        res.status(200).json({ message: 'Payment added successfully', resteAPayer });
    } catch (error) {
        console.error('Error adding payment:', error);
        res.status(500).json({ message: 'Error adding payment', error: error.message });
    }
});

// DELETE route to delete credits by commande code
router.delete('/delete-by-commande/:codeCommande', async (req, res) => {
    try {
        const { codeCommande } = req.params;

        // Find all CommandeProductionVente documents with the provided code_commande
        const commandes = await CommandeProductionVente.find({ code_commande: codeCommande });
        const commandeIds = commandes.map(cmd => cmd._id);

        // Delete all CreditProductionVente documents linked to these CommandeProductionVente IDs
        const result = await CreditProductionVente.deleteMany({ vente: { $in: commandeIds } });

        res.status(200).json({ message: 'Production credits deleted successfully', deletedCount: result.deletedCount });
    } catch (error) {
        console.error('Error deleting production credits:', error);
        res.status(500).json({ message: 'Error deleting production credits', error: error.message });
    }
});

module.exports = router;
