import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../production_beton/SidebarProduction';
import Header from '../../../components/Headers/HeaderCommande';
import CustomAlert from '../../../components/costumeAlert/costumeAlert';

function App() {
    const [productCode, setProductCode] = useState('');
    const [quantity, setQuantity] = useState('');
    const [prixUnitaire, setPrixUnitaire] = useState('');
    const [codeCommande, setCodeCommande] = useState('');
    const [observation_com, setObservationCom] = useState('');
    const [clientName, setClientName] = useState('');
    const [commandes, setCommandes] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [date, setDate] = useState('');
    const [products, setProducts] = useState([]);
    const [clients, setClients] = useState([]);
    const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
    const [alert, setAlert] = useState(null);
    const [isClientDisabled, setIsClientDisabled] = useState(false);
    const [versement, setVersement] = useState('');
    const [modePaiement, setModePaiement] = useState('');
    const [showFinalizePopup, setShowFinalizePopup] = useState(false);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await axios.get('http://localhost:8080/clients', {
                    params: {
                        IsActive: true
                    }
                });
                setClients(response.data.data || []);
            } catch (error) {
                console.error('Error fetching clients:', error);
            }
        };

        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:8080/production_beton/finished-products', {
                    params: {
                        IsActive: true
                    }
                });
                setProducts(response.data.map(item => ({
                    id: item._id,
                    codeProduction: item.productionCode
                })));
            } catch (error) {
                console.error('Error fetching products:', error);
                setProducts([]);
            }
        };

        fetchClients();
        fetchProducts();
    }, []);

    const handleAddProduct = () => {
        if (!productCode || !quantity || !prixUnitaire || !clientName || !codeCommande) {
            showAlert('Veuillez remplir tous les champs nécessaires.');
            return;
        }

        const totalLigne = parseInt(quantity, 10) * parseFloat(prixUnitaire);
        const newProduct = {
            productionCode: productCode,
            quantity: parseInt(quantity, 10),
            prixUnitaire: parseFloat(prixUnitaire)
        };

        setCommandes([...commandes, newProduct]);
        setProductCode('');
        setQuantity('');
        setPrixUnitaire('');
        setIsClientDisabled(true);
    };

    const handleShowFinalizePopup = () => {
        if (commandes.length === 0) {
            showAlert('Veuillez ajouter des produits à la commande.');
            return;
        }
        setShowPopup(false);
        setShowFinalizePopup(true);
    };

    const handleFinalizeOrder = async () => {
        if (commandes.length === 0 || !codeCommande || !clientName) {
            showAlert('Veuillez ajouter des produits et remplir tous les champs de commande.');
            return;
        }

        const orderDetails = {
            code_commande: codeCommande,
            date_commande: date,
            observation: observation_com,
            client_name: clientName,
            produits: commandes,
            versement: parseFloat(versement),
            modePaiement
        };

        try {
            const response = await axios.post('http://localhost:8080/commande_production_vente', orderDetails);
            showAlert('Commande finalisée avec succès : ' + response.data.code_commande);
            setCommandes([]);
            setCodeCommande('');
            setObservationCom('');
            setClientName('');
            setShowPopup(false);
            setIsClientDisabled(false);
        } catch (error) {
            console.error('Erreur complète:', error);
            showAlert('Erreur lors de la finalisation de la commande : ' + (error.response ? error.response.data.message : error.message));
        }
    };

    const handleValidateOrder = () => {
        setShowPopup(true);
        setDate(new Date().toISOString().slice(0, 10));
    };

    const showAlert = (message, type) => {
        setAlert({ message, type });
    };

    return (
        <div className="grid-container">
            <Header OpenSidebar={() => setOpenSidebarToggle(!openSidebarToggle)} />
            <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={() => setOpenSidebarToggle(!openSidebarToggle)} />
            <div className='container'>
                <h1 className="title-all">Commande de vente</h1>
                <div className="form-container">
                    <div className='bloc'>
                        <div className='bloc1'>
                            <select value={clientName} onChange={(e) => setClientName(e.target.value)} disabled={isClientDisabled}>
                                <option value="">Sélectionnez un client</option>
                                {clients.map(client => (
                                    <option key={client.id} value={client.name}>{client.name}</option>
                                ))}
                            </select>
                            <input type="text" value={codeCommande} onChange={(e) => setCodeCommande(e.target.value)} placeholder="Code Commande" />
                            <input type="text" value={observation_com} onChange={(e) => setObservationCom(e.target.value)} placeholder="Observation" />
                        </div>
                        <div className='bloc2'>
                            <select value={productCode} onChange={(e) => setProductCode(e.target.value)}>
                                <option value="">Sélectionnez un produit</option>
                                {products.map(product => (
                                    <option key={product.id} value={product.codeProduction}>{product.codeProduction}</option>
                                ))}
                            </select>
                            <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="Quantité" />
                            <input type="number" value={prixUnitaire} onChange={(e) => setPrixUnitaire(e.target.value)} placeholder="Prix Unitaire" />
                        </div>
                    </div>
                    <div className='bloc3'>
                        <button onClick={handleAddProduct}> + Ajouter Produit</button>
                    </div>
                </div>
                {showPopup && (
                    <div className="popup">
                        <h2>Informations de Commande</h2>
                        <p>Client: {clientName}</p>
                        <p>Code de Commande: {codeCommande}</p>
                        <p>Date :{date}</p>
                        <p>Observation :{observation_com}</p>
                        <h3>Produits ajoutés :</h3>
                        <table>
                            <thead className="table-header">
                                <tr>
                                    <th>Code Production</th>
                                    <th>Quantité</th>
                                    <th>Prix Unitaire</th>
                                    <th>Total Ligne</th>
                                </tr>
                            </thead>
                            <tbody>
                                {commandes.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.productionCode}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.prixUnitaire}</td>
                                        <td>{(item.quantity * item.prixUnitaire).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="popup-buttons">
                            <button className='delete-button' onClick={() => setShowPopup(false)}>Fermer</button>
                            <button className='next-button' onClick={handleShowFinalizePopup}>Suivant</button>
                        </div>
                    </div>
                )}
                <div>
                    <h2>Produits ajoutés :</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Code Production</th>
                                <th>Quantité</th>
                                <th>Prix Unitaire</th>
                                <th>Total Ligne</th>
                            </tr>
                        </thead>
                        <tbody>
                            {commandes.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.productionCode}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.prixUnitaire}</td>
                                    <td>{(item.quantity * item.prixUnitaire).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button className='print-button' onClick={handleValidateOrder}>Valider</button>
                </div>
                {showFinalizePopup && (
                    <div className="popup">
                        <h2>Détails de Paiement</h2>
                        <div>
                            <label>Mode de Paiement:</label>
                            <select value={modePaiement} onChange={(e) => setModePaiement(e.target.value)}>
                                <option value="">Choisir un mode de paiement</option>
                                <option value="chéque">Chèque</option>
                                <option value="espèce">Espèce</option>
                                <option value="crédit">Crédit</option>
                            </select>
                        </div>
                        <div>
                            <label>Versement (facultatif):</label>
                            <input type="number" value={versement} onChange={(e) => setVersement(e.target.value)} placeholder="Entrer un montant" />
                        </div>
                        <div className="popup-buttons">
                            <button onClick={() => setShowFinalizePopup(false)}>Retour</button>
                            <button onClick={handleFinalizeOrder}>Finaliser la Commande</button>
                        </div>
                    </div>
                )}
                {alert && <CustomAlert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
            </div>
        </div>
    );
}

export default App;
