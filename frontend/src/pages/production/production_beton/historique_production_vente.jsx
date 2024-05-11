import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './SidebarProduction';
import Header from '../../../components/Main/Header';
import CustomAlert from '../../../components/costumeAlert/costumeAlert';

function App() {
    const [commandes, setCommandes] = useState([]);
    const [filteredCommandes, setFilteredCommandes] = useState([]);
    const [selectedCommande, setSelectedCommande] = useState(null);
    const [alert, setAlert] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const commandesPerPage = 5;

    useEffect(() => {
        fetchCommandes();
    }, []);

    useEffect(() => {
        filterCommandes();
    }, [searchText, commandes]);

    const fetchCommandes = async () => {
        try {
            const response = await axios.get('http://localhost:8080/commande_production_vente');
            setCommandes(response.data.commandesProductionVente);
        } catch (error) {
            console.error('Error fetching commandes:', error);
            showAlert('An error occurred while fetching commandes. Please try again later.', 'error');
        }
    };

    const filterCommandes = () => {
        const lowercasedFilter = searchText.toLowerCase();
        const filteredData = commandes.filter(commande =>
            commande.code_commande.toLowerCase().includes(lowercasedFilter)
        );
        setFilteredCommandes(filteredData);
        setCurrentPage(1); // Reset to the first page whenever the filter changes
    };

    const showAlert = (message, type) => {
        setAlert({ message, type });
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:8080/commande_production_vente/${id}`);
            if (response.status === 200) {
                showAlert('Commande deleted successfully.', 'success');
                fetchCommandes(); // Refetch all data to update the UI accordingly
            } else {
                showAlert(response.data.message || 'An error occurred while deleting the commande.', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showAlert('An error occurred. Please try again later.', 'error');
        }
    };

    const handleView = (commande) => {
        setSelectedCommande(commande);
    };

    const handlePageChange = (pageOffset) => {
        setCurrentPage(prevPage => prevPage + pageOffset);
    };

    // Calculate the current commandes to be displayed based on pagination
    const indexOfLastCommande = currentPage * commandesPerPage;
    const indexOfFirstCommande = indexOfLastCommande - commandesPerPage;
    const currentCommandes = filteredCommandes.slice(indexOfFirstCommande, indexOfLastCommande);

    return (
        <div className="grid-container">
            <Header />
            <Sidebar />
            <div className="container">
                <h1 className="title-all">Historique des Commandes de Vente</h1>
                <input
                    type="text"
                    placeholder="Search by code..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
                <table className="table">
                    <thead>
                        <tr>
                            <th>Code Commande</th>
                            <th>Date Commande</th>
                            <th>Total Commande</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentCommandes.map((commande) => (
                            <tr key={commande._id}>
                                <td>{commande.code_commande}</td>
                                <td>{new Date(commande.date_commande).toISOString().slice(0, 10)}</td>
                                <td>{commande.totalCommande.toFixed(2)}</td>
                                <td>
                                    <button className='view-button' onClick={() => handleView(commande)}>Details</button>
                                    <button className='delete-button' onClick={() => handleDelete(commande._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="pagination">
                    <button onClick={() => handlePageChange(-1)} disabled={currentPage === 1}>Previous</button>
                    <span>Page {currentPage} of {Math.ceil(filteredCommandes.length / commandesPerPage)}</span>
                    <button onClick={() => handlePageChange(1)} disabled={currentPage === Math.ceil(filteredCommandes.length / commandesPerPage)}>Next</button>
                </div>
                {selectedCommande && (
                    <div className="popup">
                        <div className="popup-content">
                            <span className="close-button" onClick={() => setSelectedCommande(null)}>&times;</span>
                            <h2>Commande Details</h2>
                            <p><strong>Code:</strong> {selectedCommande.code_commande}</p>
                            <p><strong>Date of Commande:</strong> {new Date(selectedCommande.date_commande).toISOString().slice(0, 10)}</p>
                            <p><strong>Total Commande:</strong> {selectedCommande.totalCommande.toFixed(2)}</p>
                            <p><strong>Observation:</strong> {selectedCommande.observation}</p>
                            <p><strong>Versement:</strong> {selectedCommande.versement}</p>
                            <p><strong>Mode Paiement:</strong> {selectedCommande.modePaiement}</p>
                            <h3>Produits</h3>
                            <table>
                                <thead>
                                    <tr>
                                        <th className='titlesHis'>Product</th>
                                        <th className='titlesHis'>Quantity</th>
                                        <th className='titlesHis'>Unit Price</th>
                                        <th className='titlesHis'>Total Line</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedCommande.produits.map((produit, index) => (
                                        <tr key={index}>
                                            <td>{produit.productfinished.productionCode}</td>
                                            <td>{produit.quantity}</td>
                                            <td>{produit.prixUnitaire}</td>
                                            <td>{produit.totalLigne.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                {alert && <CustomAlert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
            </div>
        </div>
    );
}

export default App;
