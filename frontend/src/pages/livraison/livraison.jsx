import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import axios from 'axios';
import Sidebar from './sidebar';
import Header from '../../components/Headers/Headerlivraison';
import CustomAlert from '../../components/costumeAlert/costumeAlert'; // Import du composant CustomAlert

const SearchableSelect = ({ options = [], value, onChange, placeholder, disabled, onSelect }) => {
    const [search, setSearch] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef(null);

    const filteredOptions = useMemo(() => {
        if (!Array.isArray(options)) return [];
        return options.filter(option => {
            const optionValue = option.name || option.numero_plaque || option.nom || option.code_commande;
            return optionValue && optionValue.toLowerCase().includes(search.toLowerCase());
        });
    }, [search, options]);

    const handleFocus = useCallback(() => {
        setIsOpen(true);
    }, []);

    const handleBlur = useCallback((e) => {
        if (selectRef.current && !selectRef.current.contains(e.relatedTarget)) {
            setIsOpen(false);
        }
    }, []);

    const handleSelectChange = (e) => {
        onChange(e);
        setIsOpen(false);
        setSearch('');
        const selectedOption = options.find(option => option.name === e.target.value || option.numero_plaque === e.target.value || option.nom === e.target.value || option.code_commande === e.target.value);
        if (onSelect && selectedOption) {
            onSelect(selectedOption);
        }
    };

    return (
        <div className="searchable-select" ref={selectRef}>
            <input
                type="text"
                placeholder={placeholder}
                value={value ? options.find(option => (option.name === value || option.numero_plaque === value || option.nom === value || option.code_commande === value))?.name || options.find(option => option.numero_plaque === value)?.numero_plaque || options.find(option => option.nom === value)?.nom || options.find(option => option.code_commande === value)?.code_commande : search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={handleFocus}
                onBlur={handleBlur}
                disabled={disabled}
            />
            {isOpen && (
                <select
                    value={value}
                    onChange={handleSelectChange}
                    size={Math.min(5, filteredOptions.length)}
                    onBlur={handleBlur}
                >
                    <option value="">{placeholder}</option>
                    {filteredOptions.map(option => (
                        <option key={option._id} value={option.name || option.numero_plaque || option.nom || option.code_commande}>
                            {option.name || option.numero_plaque || option.nom || option.code_commande}
                        </option>
                    ))}
                </select>
            )}
        </div>
    );
};

function App() {
    const [deliveryDate, setDeliveryDate] = useState('');
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [clientName, setClientName] = useState('');
    const [deliveryStatus, setDeliveryStatus] = useState('');
    const [quantity, setQuantity] = useState('');
    const [truckCode, setTruckCode] = useState('');
    const [driverName, setDriverName] = useState('');
    const [deliveries, setDeliveries] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [clients, setClients] = useState([]);
    const [trucks, setTrucks] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [sales, setSales] = useState([]); // Ajouter l'état pour les ventes
    const [selectedSale, setSelectedSale] = useState(''); // Ajouter l'état pour la vente sélectionnée
    const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
    const [alert, setAlert] = useState(null);
    const [showFinalizePopup, setShowFinalizePopup] = useState(false);
    const [deliveryCode, setDeliveryCode] = useState(''); // Ajouter l'état pour le code livraison

    // Fonction pour générer le code livraison
    useEffect(() => {
        const fetchDeliveryCode = async () => {
            try {
                const currentYear = new Date().getFullYear();
                const livraisonResponse = await axios.get('http://localhost:8080/livraison');
                const livraisonData = livraisonResponse.data;
                const incrementedCount = livraisonData.count + 1;
                const displayCode = `BL${incrementedCount}${currentYear}`;
                setDeliveryCode(displayCode);
            } catch (error) {
                console.error('Erreur lors de la récupération des données:', error);
            }
        };

        fetchDeliveryCode();
    }, []); // Se déclenche au montage du composant

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await axios.get('http://localhost:8080/clients', { params: { IsActive: true } });
                setClients(Array.isArray(response.data.data) ? response.data.data : []);
            } catch (error) {
                console.error('Error fetching clients:', error);
            }
        };

        const fetchTrucks = async () => {
            try {
                const response = await axios.get('http://localhost:8080/camions');
                const activeTrucks = Array.isArray(response.data.data) ? response.data.data.filter(truck => truck.isActive) : [];
                setTrucks(activeTrucks);
            } catch (error) {
                console.error('Error fetching trucks:', error);
            }
        };

        const fetchDrivers = async () => {
            try {
                const response = await axios.get('http://localhost:8080/chauffeur');
                const activeDrivers = Array.isArray(response.data.data) ? response.data.data.filter(driver => driver.isActive) : [];
                setDrivers(activeDrivers);
            } catch (error) {
                console.error('Error fetching drivers:', error);
            }
        };

        const fetchSales = async () => {
            try {
                const response = await axios.get('http://localhost:8080/commande_production_vente');
                setSales(Array.isArray(response.data.commandesProductionVente) ? response.data.commandesProductionVente : []);
            } catch (error) {
                console.error('Error fetching sales:', error);
            }
        };

        fetchClients();
        fetchTrucks();
        fetchDrivers();
        fetchSales(); // Récupérer les ventes
    }, []);

    const handleAddDelivery = () => {
        if (!deliveryDate || !deliveryAddress || !clientName || !deliveryStatus || !quantity || !truckCode || !driverName || !selectedSale) {
            showAlert('Veuillez remplir tous les champs nécessaires.');
            return;
        }

        const newDelivery = {
            date_livraison: deliveryDate,
            adresse_livraison: deliveryAddress,
            client_name: clientName,
            etat_livraison: deliveryStatus,
            quantite: parseInt(quantity, 10),
            camion_code: truckCode,
            chauffeur_name: driverName,
            codeLivraison: deliveryCode, // Ajouter le code livraison
            vente_code: selectedSale // Ajouter le code de commande de vente
        };

        setDeliveries([...deliveries, newDelivery]);
        setDeliveryDate('');
        setDeliveryAddress('');
        setClientName('');
        setDeliveryStatus('');
        setQuantity('');
        setTruckCode('');
        setDriverName('');
        setDeliveryCode(''); // Réinitialiser le code livraison après ajout
        setSelectedSale(''); // Réinitialiser la vente sélectionnée
    };

    const handleShowFinalizePopup = () => {
        if (deliveries.length === 0) {
            showAlert('Veuillez ajouter des livraisons.');
            return;
        }
        setShowPopup(false);
        setShowFinalizePopup(true);
    };

    const handleFinalizeDelivery = async () => {
        try {
            const response = await axios.post('http://localhost:8080/livraison', {
                date_livraison: deliveries[0].date_livraison,
                adresse_livraison: deliveries[0].adresse_livraison,
                client_name: deliveries[0].client_name,
                etat_livraison: deliveries[0].etat_livraison,
                quantite: deliveries[0].quantite,
                camion_code: deliveries[0].camion_code,
                chauffeur_name: deliveries[0].chauffeur_name,
                codeLivraison: deliveries[0].codeLivraison, // Envoyer le code livraison au backend
                vente_code: deliveries[0].vente_code // Envoyer le code de commande de vente au backend
            });

            showAlert('Livraison finalisée avec succès');
            setDeliveries([]);
            setShowFinalizePopup(false);
        } catch (error) {
            console.error('Erreur lors de la finalisation :', error);
            showAlert('Erreur lors de la finalisation : ' + (error.response ? error.response.data.message : error.message));
        }
    };

    const handleValidateDelivery = () => {
        setShowPopup(true);
    };

    const showAlert = (message, type) => {
        setAlert({ message, type });
        setTimeout(() => {
            setAlert(null);
        }, 5000);
    };

    const handleDelete = (index) => {
        const newDeliveries = deliveries.filter((item, i) => i !== index);
        setDeliveries(newDeliveries);
    };

    const handleTruckSelect = (selectedTruck) => {
        setTruckCode(selectedTruck.numero_plaque);
        setDriverName(selectedTruck.chauffeur ? selectedTruck.chauffeur.nom : '');
    };

    return (
        <div className="grid-container">
            <Header OpenSidebar={() => setOpenSidebarToggle(!openSidebarToggle)} />
            <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={() => setOpenSidebarToggle(!openSidebarToggle)} />
            <div className='container'>
                <h1 className="title-all">Gestion des Livraisons</h1>
                <div className="form-container">
                    <div className='bloc'>
                        <div className='bloc1'>
                            <label>Code Livraison: <input type="text" value={deliveryCode} placeholder="Code Livraison" disabled /></label>
                            <label>Vente: 
                                <SearchableSelect
                                    options={sales}
                                    value={selectedSale}
                                    onChange={(e) => setSelectedSale(e.target.value)}
                                    placeholder="Sélectionnez une vente"
                                />
                            </label>
                            <label>Adresse de Livraison: <input type="text" value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} placeholder="Adresse de Livraison" /></label>
                            <label>Client: 
                                <SearchableSelect
                                    options={clients}
                                    value={clientName}
                                    onChange={(e) => setClientName(e.target.value)}
                                    placeholder="Sélectionnez un client"
                                />
                            </label>
                          
                        </div>
                        <div className='bloc2'>
                                <div className='datebon'>
                                    <label>Date : 
                                <input type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} placeholder="Date de Livraison" />  </label>
                                </div>

                            <label>Volume: <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="Volume" /></label>
                            <label>Camion: 
                                <SearchableSelect
                                    options={trucks}
                                    value={truckCode}
                                    onChange={(e) => setTruckCode(e.target.value)}
                                    onSelect={handleTruckSelect}
                                    placeholder="Sélectionnez un camion"
                                />
                            </label>
                            <label>Chauffeur: 
                                <SearchableSelect
                                    options={drivers}
                                    value={driverName}
                                    onChange={(e) => setDriverName(e.target.value)}
                                    placeholder="Sélectionnez un chauffeur"
                                />
                            </label>
                            <label>État de Livraison: 
                                <select value={deliveryStatus} onChange={(e) => setDeliveryStatus(e.target.value)}>
                                    <option value="">Sélectionnez l'état de livraison</option>
                                    <option value="En cours">En cours</option>
                                    <option value="Retard">Retard</option>
                                    <option value="Complétée">Complétée</option>
                                </select>
                            </label>
                        </div>
                    </div>
                    <div className='bloc3'>
                        <button onClick={handleAddDelivery}> + Ajouter Livraison</button>
                    </div>
                </div>
                {showPopup && (
                    <>
                    <div className="overlay"></div>   
                    <div className="popup">
                        <h2>Informations de Livraison</h2>
                        <h3>Livraisons ajoutées :</h3>
                        <table>
                            <thead className="table-header">
                                <tr>
                                    <th>Code Livraison</th>
                                    <th>Date</th>
                                    <th>Adresse</th>
                                    <th>Client</th>
                                    <th>État</th>
                                    <th>Quantité</th>
                                    <th>Camion</th>
                                    <th>Chauffeur</th>
                                    <th>Vente</th>
                                </tr>
                            </thead>
                            <tbody>
                                {deliveries.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.codeLivraison}</td>
                                        <td>{item.date_livraison}</td>
                                        <td>{item.adresse_livraison}</td>
                                        <td>{item.client_name}</td>
                                        <td>{item.etat_livraison}</td>
                                        <td>{item.quantite}</td>
                                        <td>{item.camion_code}</td>
                                        <td>{item.chauffeur_name}</td>
                                        <td>{item.vente_code}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="popup-buttons">
                            <button className='delete-button' onClick={() => setShowPopup(false)}>Fermer</button>
                            <button className='view-button' onClick={handleShowFinalizePopup}>Suivant</button>
                        </div>
                    </div>
                    </>
                )}
                {showFinalizePopup && (
                    <>
                    <div className="overlay"></div>                      
                    <div className="popup">
                        <h2>Finaliser les Livraisons</h2>
                        <div className="popup-buttons">
                            <button className='delete-button' onClick={() => setShowFinalizePopup(false)}>Retour</button>
                            <button className='view-button' onClick={handleFinalizeDelivery}>Finaliser les Livraisons</button>
                        </div>
                    </div>
                    </>
                )}
                <div>
                    <h2>Livraisons ajoutées :</h2>
                    <table className='comtab'>
                        <thead>
                            <tr>
                                <th>Code Livraison</th>
                                <th>Vente</th>
                                <th>Date</th>
                                <th>Adresse</th>
                                <th>Client</th>
                                <th>État</th>
                                <th>Quantité</th>
                                <th>Camion</th>
                                <th>Chauffeur</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {deliveries.map((item, index) => (
                                <tr key={index}> 
                                    <td>{item.codeLivraison}</td>
                                    <td>{item.vente_code}</td>
                                    <td>{item.date_livraison}</td>
                                    <td>{item.adresse_livraison}</td>
                                    <td>{item.client_name}</td>
                                    <td>{item.etat_livraison}</td>
                                    <td>{item.quantite}</td>
                                    <td>{item.camion_code}</td>
                                    <td>{item.chauffeur_name}</td>
                                    <td>
                                        <button className='delete-button' onClick={() => handleDelete(index)}>Supprimer</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button className='view-button' onClick={handleValidateDelivery}>Valider</button>
                </div>
                {alert && <CustomAlert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
            </div>
        </div>
    );
}

export default App;
