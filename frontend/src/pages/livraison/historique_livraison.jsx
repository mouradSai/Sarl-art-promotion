import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './sidebar';
import Header from '../../components/Main/Header';
import CustomAlert from '../../components/costumeAlert/costumeAlert';

function App() {
    const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
    const [deliveries, setDeliveries] = useState([]);
    const [filteredDeliveries, setFilteredDeliveries] = useState([]);
    const [selectedDelivery, setSelectedDelivery] = useState(null);
    const [alert, setAlert] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const deliveriesPerPage = 5;

    const OpenSidebar = () => {
        setOpenSidebarToggle(!openSidebarToggle);
    };

    useEffect(() => {
        fetchDeliveries();
    }, []);

    useEffect(() => {
        const lowercasedFilter = searchText.toLowerCase();
        const filteredData = deliveries.filter(delivery =>
            (delivery.client_id && delivery.client_id.name.toLowerCase().includes(lowercasedFilter)) ||
            delivery.etat_livraison.toLowerCase().includes(lowercasedFilter)
        );
        setFilteredDeliveries(filteredData);
        setCurrentPage(1); // Reset to first page when search changes
    }, [searchText, deliveries]);

    const fetchDeliveries = async () => {
        try {
            const response = await axios.get('http://localhost:8080/livraison');
            console.log('Data fetched from API:', response.data);
            setDeliveries(response.data.data.reverse());
        } catch (error) {
            console.error('Erreur lors de la récupération des livraisons:', error);
            showAlert('Une erreur s\'est produite lors de la récupération des livraisons. Veuillez réessayer plus tard.', 'Erreur');
        }
    };

    const showAlert = (message, type) => {
        setAlert({ message, type });
    };

    const handleView = (delivery) => {
        setSelectedDelivery(delivery);
    };

    // Pagination Logic
    const indexOfLastDelivery = currentPage * deliveriesPerPage;
    const indexOfFirstDelivery = indexOfLastDelivery - deliveriesPerPage;
    const currentDeliveries = filteredDeliveries.slice(indexOfFirstDelivery, indexOfLastDelivery);

    const handlePageChange = (pageOffset) => {
        setCurrentPage(prevPage => prevPage + pageOffset);
    };

    return (
        <div className="grid-container">
            <Header OpenSidebar={() => setOpenSidebarToggle(!openSidebarToggle)} />
            <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={() => setOpenSidebarToggle(!openSidebarToggle)} />
            <div className="container">
                <h1 className="title-all">Historique des Livraisons</h1>
                <input
                    type="text"
                    placeholder="Rechercher des livraisons..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
                <table className="table">
                    <thead>
                        <tr>
                            <th>Code Livraison</th>
                            <th>Code Vente</th> {/* Ajouter l'entête Code Vente */}
                            <th>Date Livraison</th>
                            <th>Adresse Livraison</th>
                            <th>Client</th>
                            <th>État</th>
                            <th>Volume</th>
                            <th>Camion</th>
                            <th>Chauffeur</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentDeliveries.map((delivery) => (
                            <tr key={delivery._id}>
                                <td>{delivery.codeLivraison}</td>
                                <td>{delivery.vente_id ? delivery.vente_id.code_commande : 'N/A'}</td> {/* Afficher le Code Vente */}
                                <td>{new Date(delivery.date_livraison).toISOString().slice(0, 10)}</td>
                                <td>{delivery.adresse_livraison}</td>
                                <td>{delivery.client_id.name}</td>
                                <td>{delivery.etat_livraison}</td>
                                <td>{delivery.quantite}</td>
                                <td>{delivery.camion_id.numero_plaque}</td>
                                <td>{delivery.chauffeur_id.nom}</td>
                                <td>
                                    <button className='view-button' onClick={() => handleView(delivery)}>Détails</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="pagination">
                    <button onClick={() => handlePageChange(-1)} disabled={currentPage === 1}>Précédent</button>
                    <span>Page {currentPage} sur {Math.ceil(filteredDeliveries.length / deliveriesPerPage)}</span>
                    <button onClick={() => handlePageChange(1)} disabled={currentPage === Math.ceil(filteredDeliveries.length / deliveriesPerPage)}>Suivant</button>
                </div>
                {selectedDelivery && (
                    <>
                    <div className="overlay"></div>                     
                    <div className="popup">
                        <div className="popup-content">
                            <span className="close-button" onClick={() => setSelectedDelivery(null)}>&times;</span>
                            <h2>Détails de la Livraison</h2>
                            <p><strong>Code Livraison:</strong> {selectedDelivery.codeLivraison}</p>
                            <p><strong>Code Vente:</strong> {selectedDelivery.vente_id ? selectedDelivery.vente_id.code_commande : 'N/A'}</p> {/* Ajouter le Code Vente */}
                            <p><strong>Date Livraison:</strong> {new Date(selectedDelivery.date_livraison).toISOString().slice(0, 10)}</p>
                            <p><strong>Adresse Livraison:</strong> {selectedDelivery.adresse_livraison}</p>
                            <p><strong>Client:</strong> {selectedDelivery.client_id.name}</p>
                            <p><strong>État Livraison:</strong> {selectedDelivery.etat_livraison}</p>
                            <p><strong>Volume:</strong> {selectedDelivery.quantite}</p>
                            <p><strong>Camion:</strong> {selectedDelivery.camion_id.numero_plaque}</p>
                            <p><strong>Chauffeur:</strong> {selectedDelivery.chauffeur_id.nom}</p>
                            <p><strong>Détails de la Vente:</strong></p>
                            {selectedDelivery.vente_id && selectedDelivery.vente_id.produits.map((produit, index) => (
                                <div key={index}>
                                    <p><strong>Quantité:</strong> {produit.quantity}</p>
                                   
                                </div>
                            ))}
                        </div>
                    </div>
                    </>
                )}
                {alert && <CustomAlert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
            </div>
        </div>
    );
}

export default App;
