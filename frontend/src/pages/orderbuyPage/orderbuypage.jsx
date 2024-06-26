import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import axios from 'axios';
import './App.css';
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
                        onChange(e.target.value);
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
    const [commandesAchatCount, setCommandesAchatCount] = useState(0);
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
    const [versement, setVersement] = useState('');
    const [modePaiement, setModePaiement] = useState('');
    const [showFinalizePopup, setShowFinalizePopup] = useState(false);
    const [codeCheque, setCodeCheque] = useState('');

    useEffect(() => {
        const fetchProviders = async () => {
            try {
                const response = await axios.get('http://localhost:8080/providers', {
                    params: { IsActive: true }
                });
                setProviders(response.data.data);
            } catch (error) {
                console.error('Error fetching providers:', error);
            }
        };

        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:8080/products', {
                    params: { IsActive: true }
                });
                setProducts(response.data.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProviders();
        fetchProducts();
    }, []);

    useEffect(() => {
        const selectedProduct = products.find(product => product.name === productName);
        if (selectedProduct) {
            setPrixUnitaire(selectedProduct.prixUnitaire);
        }
    }, [productName, products]);

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

    const handleShowFinalizePopup = () => {
        if (commandes.length === 0) {
            showAlert('Veuillez ajouter des produits à la commande.');
            return;
        }
        setShowPopup(false);
        setShowFinalizePopup(true);
    };

    const handleFinalizeOrder = async () => {
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
            const response = await axios.post('http://localhost:8080/commandes_achat', {
                code_commande: codeCommande,
                provider_name: providerName,
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
            setProviderName('');
            setVersement('');
            setModePaiement('');
            setShowFinalizePopup(false);
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
        if (!providerName) {
            showAlert('Veuillez entrer le nom du fournisseur.');
            return;
        }

        const orderDetails = {
            providerName,
            codeCommande,
            date: new Date().toISOString().slice(0, 10),
            observation_com,
            versement,
            modePaiement,
            codeCheque,
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
                const commandes_achatResponse = await fetch('http://localhost:8080/commandes_achat');
                const commandes_achatData = await commandes_achatResponse.json();
                const incrementedCount = commandes_achatData.count + 1;
                const displayCount = `BA${incrementedCount}${currentYear}`;
                setCommandesAchatCount(displayCount);
                setCodeCommande(displayCount);
            } catch (error) {
                console.error('Erreur lors de la récupération des données :', error);
            }
        };

        fetchCounts();
    }, []);

    return (
        <div className="grid-container">
            <Header OpenSidebar={() => setOpenSidebarToggle(!openSidebarToggle)} />
            <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={() => setOpenSidebarToggle(!openSidebarToggle)} />
            <div className='container'>
                <h1 className="title-all">Commande d'achat</h1>
                <div className="form-container">
                    <div className='bloc'>
                        <div className='bloc1'>
                            <label>
                                Fournisseur:
                                <SearchableSelect
                                    options={providers}
                                    value={providerName}
                                    onChange={(e) => setProviderName(e)}
                                    placeholder="Sélectionnez un fournisseur"
                                    disabled={isProviderDisabled}
                                />
                            </label>
                            <label>
                                Code Commande:
                                <input type="text" value={codeCommande} onChange={(e) => setCodeCommande(e.target.value)} placeholder="Code Commande" />
                            </label>
                            <label>
                                Observation:
                                <input type="text" value={observation_com} onChange={(e) => setObservationCom(e.target.value)} placeholder="Observation" />
                            </label>
                        </div>
                        <div className='bloc2'>
                            <label>
                                Produit:
                                <SearchableSelect
                                    options={products}
                                    value={productName}
                                    onChange={(e) => setProductName(e)}
                                    placeholder="Sélectionnez un produit"
                                />
                            </label>
                            <label>
                                Quantité:
                                <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="Quantité" />
                            </label>
                            <label>
                                Prix Unitaire:
                                <input type="number" value={prixUnitaire} onChange={(e) => setPrixUnitaire(e.target.value)} placeholder="Prix Unitaire" />
                            </label>
                        </div>
                    </div>
                    <div className='bloc3'>
                        <button onClick={handleAddProduct}> + Ajouter Produit</button>
                    </div>
                </div>
                {showPopup && (
                    <>
                    <div className="overlay"></div>   
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
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {commandes.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.product_name}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.prixUnitaire.toFixed(2)} DA</td>
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
                            <button className='print-button ' onClick={handleGeneratePDF}>Télécharger le PDF</button>
                            <button className='view-button' onClick={handleShowFinalizePopup}>Suivant</button>

                        </div>
                    </div>
                    </>
                )}
                {showFinalizePopup && (
                    <>
                    <div className="overlay"></div>                      
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
                            <button className='delete-button' onClick={() => setShowFinalizePopup(false)}>Retour</button>
                            <button className='print-button' onClick={handleGeneratePDF}>Télécharger le PDF</button>
                            <button className='view-button' onClick={handleFinalizeOrder}>Finaliser la Commande</button>
                        </div>
                    </div>
                    </>
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
                                    <td>{item.prixUnitaire.toFixed(2)}DA</td>
                                    <td>{item.totalLigne} DA</td>
                                    <td>
                                        <button className='delete-button' onClick={() => handleDelete(index)}>Supprimer</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button className='view-button' onClick={handleValidateOrder}>Valider</button>
                </div>
                {alert && <CustomAlert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
            </div>
        </div>
    );
}

export default App;
