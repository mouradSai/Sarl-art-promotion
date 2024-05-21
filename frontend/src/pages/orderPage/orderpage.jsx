import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import axios from 'axios';
import './App.css';
import Header from '../../components/Headers/HeaderCommande';
import Sidebar from '../../components/Main/Sidebar';
import CustomAlert from '../../components/costumeAlert/costumeAlert';

const SearchableSelect = ({ options, value, onChange, placeholder, disabled }) => {
    const [search, setSearch] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef(null);

    const filteredOptions = useMemo(() => {
        return options.filter(option =>
            option.name && option.name.toLowerCase().includes(search.toLowerCase())
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

    useEffect(() => {
        if (value) {
            const selectedOption = options.find(option => option.name === value);
            setSearch(selectedOption ? selectedOption.name : '');
        }
    }, [value, options]);

    return (
        <div className="searchable-select" ref={selectRef}>
            <input
                type="text"
                placeholder={placeholder}
                value={search}
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
    const [commandesCount, setCommandesCount] = useState(0);
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
    const [alert, setAlert] = useState(null);
    const [isProviderDisabled, setIsProviderDisabled] = useState(false);

    useEffect(() => {
        const fetchProviders = async () => {
            try {
                const response = await axios.get('http://localhost:8080/providers', {
                    params: { IsActive: true }
                });
                setProviders(response.data.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des Fournisseurs:', error);
            }
        };

        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:8080/products', {
                    params: { IsActive: true }
                });
                setProducts(response.data.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des produits :', error);
            }
        };

        fetchProviders();
        fetchProducts();
    }, []);

    const handleAddProduct = () => {
        if (!productName || !quantity || !providerName || !codeCommande) {
            showAlert('Veuillez remplir tous les champs du produit, du fournisseur et du code de commande.');
            return;
        }

        const newProduct = {
            product_name: productName,
            quantity: parseInt(quantity, 10)
        };

        setCommandes([...commandes, newProduct]);
        setProductName('');
        setQuantity('');
        setIsProviderDisabled(true);
    };

    const handleFinalizeOrder = async () => {
        if (commandes.length === 0 || !codeCommande || !providerName) {
            showAlert('Veuillez ajouter des produits et remplir tous les champs de commande.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/commandes', {
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
        setTimeout(() => {
            setAlert(null);
        }, 5000);
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
            commandes
        };

        try {
            const response = await fetch('http://localhost:8080/generatePdfcommande', {
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

    const handleDelete = (index) => {
        const newCommandes = commandes.filter((item, i) => i !== index);
        setCommandes(newCommandes);
    };

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const currentYear = new Date().getFullYear();
                const commandesResponse = await fetch('http://localhost:8080/commandes');
                const commandesData = await commandesResponse.json();
                const incrementedCount = commandesData.count + 1;
                const displayCount = `BC${incrementedCount}${currentYear}`;
                setCommandesCount(displayCount);
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
                <h1 className="title-all">Bon de commande</h1>
                <div className="form-container">
                    <div className='bloc'>
                        <div className='bloc1'>
                            <SearchableSelect
                                options={providers}
                                value={providerName}
                                onChange={(e) => setProviderName(e.target.value)}
                                placeholder="Sélectionnez un fournisseur"
                                disabled={isProviderDisabled}
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
                        </div>
                    </div>
                    <div className='bloc3'>
                        <button onClick={handleAddProduct}>+ Ajouter Produit</button>
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
                        <button className='delete-button' onClick={() => setShowPopup(false)}>Fermer</button>
                        <button className='print-button' onClick={handleFinalizeOrder}>Finaliser la Commande</button>
                        <button className='pdf-button' onClick={handleGeneratePDF}>Télécharger le PDF</button>
                    </div>
                )}
                <div>
                    <h2>Produits ajoutés :</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Produit</th>
                                <th>Quantité</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {commandes.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.product_name}</td>
                                    <td>{item.quantity}</td>
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
