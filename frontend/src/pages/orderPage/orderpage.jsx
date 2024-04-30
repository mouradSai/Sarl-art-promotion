import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Sidebar from '../../components/Main/Sidebar';
import Header from '../../components/Main/Header';

function App() {
    const [productName, setProductName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [codeCommande, setCodeCommande] = useState('');
    const [observation_com, setObservationCom] = useState('');
    const [providerName, setProviderName] = useState('');
    const [commandes, setCommandes] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [date, setDate] = useState('');
    const [products, setProducts] = useState([]);
    const [providers, setProviders] = useState([]);
    const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

    useEffect(() => {
        const fetchProviders = async () => {
            try {
                const response = await axios.get('http://localhost:8080/providers');
                setProviders(response.data.data);
            } catch (error) {
                console.error('Error fetching providers:', error);
            }
        };

        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:8080/products');
                setProducts(response.data.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProviders();
        fetchProducts();
    }, []);

    const handleAddProduct = () => {
        if (!productName || !quantity || !providerName || !codeCommande) {
            alert('Veuillez remplir tous les champs du produit, du fournisseur et du code de commande.');
            return;
        }

        const newProduct = {
            product_name: productName,
            quantity: parseInt(quantity, 10)
        };

        setCommandes([...commandes, newProduct]);
        setProductName('');
        setQuantity('');
    };

    const handleFinalizeOrder = async () => {
        if (commandes.length === 0 || !codeCommande || !providerName) {
            alert('Veuillez ajouter des produits et remplir tous les champs de commande.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/commandes', {
                code_commande: codeCommande,
                provider_name: providerName,
                date_commande: date, // Ajouté pour correspondre au champ attendu
                observation: observation_com,
                produits: commandes
            });

            alert('Commande finalisée avec succès : ' + response.data.code_commande);
            setCommandes([]);
            setCodeCommande('');
            setObservationCom('');
            setProviderName('');
            setShowPopup(false);
        } catch (error) {
            console.error('Erreur complète:', error);
            alert('Erreur lors de la finalisation de la commande : ' + (error.response ? error.response.data.message : error.message));
        }
    };

    const handleValidateOrder = () => {
        setShowPopup(true);
        setDate(new Date().toISOString().slice(0, 10)); // Format de la date YYYY-MM-DD
    };

    return (
        <div className="grid-container">
            <Header OpenSidebar={() => setOpenSidebarToggle(!openSidebarToggle)} />
            <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={() => setOpenSidebarToggle(!openSidebarToggle)} />
            <div className='container'>
                <h1>Gestion de Commande</h1>
                <div className="form-container">
                    <div>
                        <select value={providerName} onChange={(e) => setProviderName(e.target.value)}>
                            <option value="">Sélectionnez un fournisseur</option>
                            {providers.map(provider => (
                                <option key={provider.id} value={provider.name}>{provider.name}</option>
                            ))}
                        </select>
                        <input type="text" value={codeCommande} onChange={(e) => setCodeCommande(e.target.value)} placeholder="Code Commande" />
                        <input type="text" value={observation_com} onChange={(e) => setObservationCom(e.target.value)} placeholder="Observation" />
                    </div>
                    <div>
                        <select value={productName} onChange={(e) => setProductName(e.target.value)}>
                            <option value="">Sélectionnez un produit</option>
                            {products.map(product => (
                                <option key={product.id} value={product.name}>{product.name}</option>
                            ))}
                        </select>
                        <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="Quantité" />
                        <button onClick={handleAddProduct}>Ajouter Produit</button>
                    </div>
                    <button onClick={handleValidateOrder}>Valider</button>
                </div>
                {showPopup && (
                    <div className="popup">
                        <h2>Informations de Commande</h2>
                        <p>Fournisseur: {providerName}</p>
                        <p>Code de Commande: {codeCommande}</p>
                        <p>Date :{date}</p>
                        <p>Observation :{observation_com}</p>
                        <h3>Produits ajoutés :</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Produit</th>
                                    <th>Quantité</th>
                                </tr>
                            </thead>
                            <tbody>
                                {commandes.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.product_name}</td>
                                        <td>{item.quantity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button onClick={() => setShowPopup(false)}>Fermer</button>
                        <button onClick={handleFinalizeOrder}>Finaliser la Commande</button>
                    </div>
                )}
                <div>
                    <h2>Produits ajoutés :</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Produit</th>
                                <th>Quantité</th>
                            </tr>
                        </thead>
                        <tbody>
                            {commandes.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.product_name}</td>
                                    <td>{item.quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default App;
