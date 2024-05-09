const express = require("express");
const Formula = require("../models/Formula");
const Product = require("../models/product");

const router = express.Router();

// Route pour créer une nouvelle formule avec des noms de produits
router.post('/', async (request, response) => {
    try {
        const { name, products: productsWithNames } = request.body;

        // Convertir les noms de produits en IDs
        const productIds = await Promise.all(productsWithNames.map(async product => {
            const existingProduct = await Product.findOne({ name: product.product });
            if (existingProduct) {
                return { product: existingProduct._id, quantity: product.quantity };
            } else {
                throw new Error(`Le produit "${product.product}" n'existe pas.`);
            }
        }));

        // Créer la formule avec les IDs des produits
        const formula = new Formula({
            name,
            products: productIds
        });

        await formula.save();
        return response.status(201).json(formula);
    } catch (error) {
        console.error(error);
        response.status(500).send({ message: error.message });
    }
});

router.get('/', async (request, response) => {
    try {
        // Récupérer toutes les formules avec les IDs des produits
        const formulas = await Formula.find();

        // Utiliser populate pour obtenir les détails des produits pour chaque formule
        const populatedFormulas = await Formula.populate(formulas, {
            path: 'products.product', // Spécifier le chemin vers la propriété product
            model: 'Product', // Indiquer le modèle à utiliser pour la population
        });

        // Remplacer les IDs des produits par leurs détails dans chaque formule
        const formulasWithProductNames = populatedFormulas.map(formula => {
            // Mappez les produits pour extraire uniquement les détails nécessaires
            const productsWithNames = formula.products.map(product => {
                if (product.product && product.product.name) { // Vérifier si product.product est défini et s'il a une propriété 'name'
                    return {
                        product: {
                            _id: product.product._id,
                            name: product.product.name,
                            quantity: product.product.quantity,
                            __v: product.product.__v
                        },
                        quantity: product.quantity,
                        _id: product._id
                    };
                } else {
                    // Gérer le cas où product.product n'est pas défini ou n'a pas de propriété 'name'
                    console.error("Product details are undefined or do not have 'name' property:", product);
                    return null; // Retourner null ou un objet vide selon vos besoins
                }
            }).filter(product => product !== null); // Filtrer les produits null (optionnel)

            return {
                _id: formula._id,
                name: formula.name,
                products: productsWithNames
            };
        });

        response.status(200).json(formulasWithProductNames);
    } catch (error) {
        console.error(error);
        response.status(500).send({ message: error.message });
    }
});
// Route pour ajouter un produit à une formule existante par ID
router.put('/add-product/:id', async (request, response) => {
    try {
        const { product } = request.body;
        const { id } = request.params;

        // Trouver le produit par son nom pour obtenir son ID
        const existingProduct = await Product.findOne({ name: product.product });
        if (!existingProduct) {
            throw new Error(`Le produit "${product.product}" n'existe pas.`);
        }

        // Ajouter le nouveau produit à la formule
        const updatedFormula = await Formula.findByIdAndUpdate(
            id,
            { $push: { products: { product: existingProduct._id, quantity: product.quantity } } },
            { new: true }
        ).populate('products.product');

        if (!updatedFormula) {
            return response.status(404).send({ message: 'Formula not found' });
        }

        return response.status(200).json(updatedFormula);
    } catch (error) {
        console.error(error.message);
        response.status(500).send({ message: error.message });
    }
});


// Route pour obtenir une formule par ID
router.get('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const formula = await Formula.findById(id).populate('products.product');
        if (!formula) {
            return response.status(404).send({ message: 'Formula not found' });
        }
        response.status(200).json(formula);
    } catch (error) {
        console.error(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route pour supprimer une formule
router.delete('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const result = await Formula.findByIdAndDelete(id);
        if (!result) {
            return response.status(404).json({ message: 'Formula not found' });
        }
        return response.status(200).send({ message: 'Formula deleted successfully' });
    } catch (error) {
        console.error(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route pour mettre à jour une formule par ID
router.put('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const updatedFormula = await Formula.findByIdAndUpdate(id, request.body, { new: true });
        if (!updatedFormula) {
            return response.status(404).send({ message: 'Formula not found' });
        }
        return response.status(200).json(updatedFormula);
    } catch (error) {
        console.error(error.message);
        response.status(500).send({ message: error.message });
    }
});

module.exports = router;
