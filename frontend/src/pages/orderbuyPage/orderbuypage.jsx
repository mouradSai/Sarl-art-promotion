import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Sidebar from '../../components/Main/Sidebar';
import Header from '../../components/Headers/HeaderCommande';
import CustomAlert from '../../components/costumeAlert/costumeAlert'; // Import du composant CustomAlert

function App() {
    const [productName, setProductName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [prixUnitaire, setPrixUnitaire] = useState('');
    const [codeCommande, setCodeCommande] = useState('');
    const [observation_com, setObservationCom] = useState('');
    const [providerName, setProviderName] = useState('');
    const [commandes, setCommandes] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [date, setDate] = useState('');
    const [products, setProducts] = useState([]);
    const [providers, setProviders] = useState([]);
    const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
    const [alert, setAlert] = useState(null);
    const [isProviderDisabled, setIsProviderDisabled] = useState(false);

    useEffect(() => {
        const fetchProviders = async () => {
            try {
                const response = await axios.get('http://localhost:8080/providers', {
                    params: {
                        IsActive: true
                    }
                });
                setProviders(response.data.data);
            } catch (error) {
                console.error('Error fetching providers:', error);
            }
        };

        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:8080/products', {
                    params: {
                        IsActive: true
                    }
                });
                setProducts(response.data.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProviders();
        fetchProducts();
    }, []);

    const handleAddProduct = () => {
        if (!productName || !quantity || !prixUnitaire || !providerName || !codeCommande) {
            showAlert('Veuillez remplir tous les champs du produit, du fournisseur, du prix unitaire et du code de commande.');
            return;
        }

        const totalLigne = parseInt(quantity, 10) * parseFloat(prixUnitaire);

        const newProduct = {
            product_name: productName,
            quantity: parseInt(quantity, 10),
            prixUnitaire: parseFloat(prixUnitaire),
            totalLigne: totalLigne.toFixed(2)
        };

        setCommandes([...commandes, newProduct]);
        setProductName('');
        setQuantity('');
        setPrixUnitaire('');

        setIsProviderDisabled(true);
    };

    const handleFinalizeOrder = async () => {
        if (commandes.length === 0 || !codeCommande || !providerName) {
            showAlert('Veuillez ajouter des produits et remplir tous les champs de commande.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/commandes_achat', {
                code_commande: codeCommande,
                provider_name: providerName,
                date_commande: date,
                observation: observation_com,
                produits: commandes
            });

            showAlert('Commande finalisée avec succès : ' + response.data.code_commande);
            setCommandes([]);
            setCodeCommande('');
            setObservationCom('');
            setProviderName('');
            setShowPopup(false);

            setIsProviderDisabled(false);
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

    // Fonction pour calculer le total de la commande principale
    const calculateTotalCommandePrincipale = () => {
        let totalCommandePrincipale = 0;
        commandes.forEach(item => {
            totalCommandePrincipale += parseFloat(item.totalLigne);
        });
        return totalCommandePrincipale.toFixed(2);
    };
    
//generating pdfs 

const handleGeneratePDF = async () => {
    if (commandes.length === 0) {
        showAlert('Veuillez ajouter des produits à la commande.');
        return;
    }
    if (!codeCommande) {
        showAlert('Veuillez entrer un code de commande.');
        return;
    }
    if (!providerName) {
        showAlert('Veuillez entrer le nom du fournisseur.');
        return;
    }

    const orderDetails = {
        providerName,
        codeCommande,
        date: new Date().toISOString().slice(0, 10),
        observation_com,
        commandes
    };

    try {
        const response = await fetch('http://localhost:8080/generatePdfachat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderDetails)
        });

        if (!response.ok) {
            throw new Error(`Erreur lors de la génération du PDF: ${response.statusText}`);
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `bon-de-commande-${codeCommande}.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Erreur lors de la génération du PDF :', error);
        showAlert('Erreur lors de la génération du PDF. Veuillez réessayer plus tard.');
    }
};

       
//suppression d'une ligne d'enregestrement tableau
const handleDelete = (index) => {
    // Crée un nouveau tableau en filtrant l'élément à l'index spécifié
    const newCommandes = commandes.filter((item, i) => i !== index);
    setCommandes(newCommandes);
};

    return (
        <div className="grid-container">
            <Header OpenSidebar={() => setOpenSidebarToggle(!openSidebarToggle)} />
            <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={() => setOpenSidebarToggle(!openSidebarToggle)} />
            <div className='container'>
                <h1 className="title-all">Commande d'achat </h1>
                <div className="form-container">
                <div className='bloc'> 
                    <div className='bloc1'> 
                        <select value={providerName} onChange={(e) => setProviderName(e.target.value)} disabled={isProviderDisabled}>
                            <option value="">Sélectionnez un fournisseur</option>
                            {providers.map(provider => (
                                <option key={provider.id} value={provider.name}>{provider.name}</option>
                            ))}
                        </select>
                        <input type="text" value={codeCommande} onChange={(e) => setCodeCommande(e.target.value)} placeholder="Code Commande" />
                        <input type="text" value={observation_com} onChange={(e) => setObservationCom(e.target.value)} placeholder="Observation" />
                    </div>
                    <div className='bloc2'>
                        <select value={productName} onChange={(e) => setProductName(e.target.value)}>
                            <option value="">Sélectionnez un produit</option>
                            {products.map(product => (
                                <option key={product.id} value={product.name}>{product.name}</option>
                            ))}
                        </select>
                        <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="Quantité" />
                    
                        <input type="number" value={prixUnitaire} onChange={(e) => setPrixUnitaire(e.target.value)} placeholder="Prix Unitaire" />
                    </div>
                    </div>

                        <div className='bloc3'>
                        <button onClick={handleAddProduct}> + Ajouter Produit</button>
                        <button className='print-button'  onClick={handleValidateOrder}>Valider</button>
                    </div>
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
                            <thead className="table-header">
                                <tr>
                                    <th>Produit</th>
                                    <th>Quantité</th>
                                    <th>Prix Unitaire</th>
                                    <th>Total Ligne</th>
                                </tr>
                            </thead>
                            <tbody>
                                {commandes.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.product_name}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.prixUnitaire}.00 DA</td>
                                        <td>{item.totalLigne} DA</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div>
                            <h3>Total Commande Principale: {calculateTotalCommandePrincipale()} DA</h3>
                        </div>
                        <div className="popup-buttons">
                            <button className='delete-button' onClick={() => setShowPopup(false)}>Fermer</button>
                            <button className='print-button' onClick={handleFinalizeOrder}>Finaliser la Commande</button>
                            <button className='pdf-button' onClick={handleGeneratePDF}>Télécharger PDF</button>

                        </div>
                    </div>
                )}
                <div>
                    <h2>Produits ajoutés :</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Produit</th>
                                <th>Quantité</th>
                                <th>Prix Unitaire</th>
                                <th>Total Ligne</th>
                                <th>Action</th>

                            </tr>
                        </thead>
                        <tbody>
                            {commandes.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.product_name}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.prixUnitaire},00 DA</td>
                                    <td>{item.totalLigne} DA</td>
                                    <td>
                            <button className='delete-button' onClick={() => handleDelete(index)}>Supprimer</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {alert && <CustomAlert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
            </div>
        </div>
    );
}

export default App;
/*******the las version of order buyyy */