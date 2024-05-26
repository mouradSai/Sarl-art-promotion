import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Main/Sidebar';
import Header from '../../components/Headers/HeaderCommande';
import CustomAlert from '../../components/costumeAlert/costumeAlert'; // Import du composant CustomAlert

const SearchableSelect = ({ options, value, onChange, placeholder, disabled }) => {
    const [search, setSearch] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef(null);

    const filteredOptions = useMemo(() => {
        return options.filter(option =>
            option.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [search, options]);

    const handleFocus = useCallback(() => {
        setIsOpen(true);
    }, []);

    const handleBlur = useCallback((e) => {
        if (selectRef.current && !selectRef.current.contains(e.relatedTarget)) {
            setIsOpen(false);
        }
    }, []);

    return (
        <div className="searchable-select" ref={selectRef}>
            <input
                type="text"
                placeholder={placeholder}
                value={value ? options.find(option => option.name === value)?.name : search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={handleFocus}
                onBlur={handleBlur}
                disabled={disabled}
            />
            {isOpen && (
                <select
                    value={value}
                    onChange={(e) => {
                        onChange(e);
                        setIsOpen(false);
                        setSearch('');
                    }}
                    size={Math.min(5, filteredOptions.length)}
                    onBlur={handleBlur}
                >
                    <option value="">{placeholder}</option>
                    {filteredOptions.map(option => (
                        <option key={option.id} value={option.name}>
                            {option.name}
                        </option>
                    ))}
                </select>
            )}
        </div>
    );
};

function App() {
    const [commandesVenteCount, setCommandesVenteCount] = useState(0); 
    const [productName, setProductName] = useState('');
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
    const [codeCheque, setCodeCheque] = useState('');

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await axios.get('http://localhost:8080/clients', { params: { IsActive: true } });
                setClients(response.data.data);
            } catch (error) {
                console.error('Error fetching clients:', error);
            }
        };

        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:8080/products', { params: { IsActive: true } });
                setProducts(response.data.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchClients();
        fetchProducts();
    }, []);

    useEffect(() => {
        const selectedProduct = products.find(product => product.name === productName);
        if (selectedProduct) {
            setPrixUnitaire(selectedProduct.prixUnitaire);
        }
    }, [productName, products]);

    const handleAddProduct = () => {
        if (!productName || !quantity || !prixUnitaire || !clientName || !codeCommande) {
            showAlert('Veuillez remplir tous les champs du produit, du client, du prix unitaire et du code de commande.');
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
        if (commandes.length === 0 || !codeCommande || !clientName || !modePaiement) {
            showAlert('Veuillez ajouter des produits, remplir tous les champs de commande et sélectionner un mode de paiement.');
            return;
        }
        const finalVersement = versement === '' ? 0 : parseFloat(versement);
        if (finalVersement < 0) {
            showAlert('Le versement ne peut pas être inférieur à zéro.');
            return;
        }
        const totalCommande = calculateTotalCommandePrincipale();
        if (finalVersement > totalCommande) {
            showAlert('Le versement ne peut pas être supérieur au total de la commande.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/commandes_vente', {
                code_commande: codeCommande,
                client_name: clientName,
                date_commande: date,
                observation: observation_com,
                produits: commandes,
                versement: finalVersement,
                modePaiement,
                code_cheque: codeCheque 
            });

            showAlert('Commande finalisée avec succès : ' + response.data.code_commande);
            setCommandes([]);
            setCodeCommande('');
            setObservationCom('');
            setClientName('');
            setModePaiement('');
            setVersement('');
            setShowPopup(false);
            setShowFinalizePopup(false);
            setCodeCheque('');
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
        setTimeout(() => {
            setAlert(null);
        }, 5000);
    };

    const calculateTotalCommandePrincipale = () => {
        let totalCommandePrincipale = 0;
        commandes.forEach(item => {
            totalCommandePrincipale += parseFloat(item.totalLigne);
        });
        return totalCommandePrincipale.toFixed(2);
    };

    const handleGeneratePDF = async () => {
        if (commandes.length === 0) {
            showAlert('Veuillez ajouter des produits à la commande.');
            return;
        }
        if (!codeCommande) {
            showAlert('Veuillez entrer un code de commande.');
            return;
        }
        if (!clientName) {
            showAlert('Veuillez entrer le nom du fournisseur.');
            return;
        }

        const orderDetails = {
            clientName,
            codeCommande,
            date: new Date().toISOString().slice(0, 10),
            observation_com,
            versement,
            modePaiement,
            codeCheque,
            commandes
        };

        try {
            const response = await fetch('http://localhost:8080/generatePdfvente', {
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

    const handleModePaiementChange = (e) => {
        const selectedModePaiement = e.target.value;
        setModePaiement(selectedModePaiement);

        if (selectedModePaiement === 'chéque' || selectedModePaiement === 'espèce') {
            const totalCommande = calculateTotalCommandePrincipale();
            setVersement(totalCommande);
        } else {
            setVersement(0);
        }
    };

    const handleDelete = (index) => {
        const newCommandes = commandes.filter((item, i) => i !== index);
        setCommandes(newCommandes);
    };

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const currentYear = new Date().getFullYear();
                const commandes_venteResponse = await fetch('http://localhost:8080/commandes_vente');
                const commandes_venteData = await commandes_venteResponse.json();
                const incrementedCount = commandes_venteData.count + 1;
                const displayCount = `BV${incrementedCount}${currentYear}`;
                setCommandesVenteCount(displayCount);
                setCodeCommande(displayCount);
            } catch (error) {
                console.error('Erreur lors de la récupération des données:', error);
            }
        };

        fetchCounts();
    }, []);

    return (
        <div className="grid-container">
            <Header OpenSidebar={() => setOpenSidebarToggle(!openSidebarToggle)} />
            <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={() => setOpenSidebarToggle(!openSidebarToggle)} />
            <div className='container'>
                <h1 className="title-all">Commande de vente</h1>
                <div className="form-container">
                    <div className='bloc'>
                        <div className='bloc1'>
                            <SearchableSelect
                                options={clients}
                                value={clientName}
                                onChange={(e) => setClientName(e.target.value)}
                                placeholder="Sélectionnez un client"
                                disabled={isClientDisabled}
                            />
                            <input type="text" value={codeCommande} onChange={(e) => setCodeCommande(e.target.value)} placeholder="Code Commande" />
                            <input type="text" value={observation_com} onChange={(e) => setObservationCom(e.target.value)} placeholder="Observation" />
                        </div>
                        <div className='bloc2'>
                            <SearchableSelect
                                options={products}
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                                placeholder="Sélectionnez un produit"
                            />
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
                                    <th>Produit</th>
                                    <th>Quantité</th>
                                    <th>Prix Unitaire</th>
                                    <th>Total </th>
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
                            <button className='next-button' onClick={handleShowFinalizePopup}>Suivant</button>
                            <button className='pdf-button' onClick={handleGeneratePDF}>Télécharger le PDF</button>
                        </div>
                    </div>
                )}
                {showFinalizePopup && (
                    <div className="popup">
                        <h2>Détails de Paiement</h2>
                        <div>
                            <label>Mode de Paiement:</label>
                            <select value={modePaiement} onChange={handleModePaiementChange}>
                                <option value="">Choisir un mode de paiement</option>
                                <option value="chéque">Chèque</option>
                                <option value="espèce">Espèce</option>
                                <option value="crédit">Crédit</option>
                            </select>
                        </div>
                        {modePaiement === 'chéque' && (
                            <div>
                                <label>Code Chèque:</label>
                                <input type="text" value={codeCheque} onChange={(e) => setCodeCheque(e.target.value)} placeholder="Code Chèque" />
                            </div>
                        )}
                        <div>
                            <label>Versement:</label>
                            <input type="number" value={versement} onChange={(e) => setVersement(e.target.value)} placeholder="Entrer un montant" />
                        </div>
                        <div className="popup-buttons">
                            <button onClick={() => setShowFinalizePopup(false)}>Retour</button>
                            <button className='pdf-button' onClick={handleGeneratePDF}>Télécharger le PDF</button>
                            <button onClick={handleFinalizeOrder}>Finaliser la Commande</button>
                        </div>
                    </div>
                )}
                <div>
                    <h2>Produits ajoutés :</h2>
                    <table className='comtab'>
                        <thead>
                            <tr>
                                <th>Produit</th>
                                <th>Quantité</th>
                                <th>Prix Unitaire</th>
                                <th>Total </th>
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
                    <button className='print-button' onClick={handleValidateOrder}>Valider</button>
                </div>
                {alert && <CustomAlert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
            </div>
        </div>
    );
}

export default App;
