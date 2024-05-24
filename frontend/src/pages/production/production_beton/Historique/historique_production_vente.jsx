import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../SidebarProduction';
import Header from '../../../../components/Main/Header';
import CustomAlert from '../../../../components/costumeAlert/costumeAlert';

function App() {
    const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
    const [commandes, setCommandes] = useState([]);
    const [clients, setClients] = useState([]);
    const [filteredCommandes, setFilteredCommandes] = useState([]);
    const [selectedCommande, setSelectedCommande] = useState(null);
    const [alert, setAlert] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const commandesPerPage = 5;

    const OpenSidebar = () => {
        setOpenSidebarToggle(!openSidebarToggle);
    };


    useEffect(() => {
        fetchCommandes();
        fetchClients();
    }, []);

    useEffect(() => {
        filterCommandes();
    }, [searchText, commandes]);

    const fetchCommandes = async () => {
        try {
            const response = await axios.get('http://localhost:8080/commande_production_vente');
            const reversedCommandes = response.data.commandesProductionVente.reverse();
            setCommandes(reversedCommandes);
        } catch (error) {
            console.error('Error fetching commandes:', error);
            showAlert('An error occurred while fetching commandes. Please try again later.', 'error');
        }
    };

    const fetchClients = async () => {
        try {
            const response = await axios.get('http://localhost:8080/clients', {
                params: { IsActive: true }
            });
            setClients(response.data.data || []);
        } catch (error) {
            console.error('Error fetching clients:', error);
        }
    };

    const getClientNameById = (clientId) => {
        const client = clients.find(client => client._id === clientId);
        return client ? client.name : 'Unknown Client';
    };

    const filterCommandes = () => {
        const lowercasedFilter = searchText.toLowerCase();
        const filteredData = commandes.filter(commande =>
            commande.code_commande.toLowerCase().includes(lowercasedFilter)
        );
        setFilteredCommandes(filteredData);
        setCurrentPage(1);
    };

    const showAlert = (message, type) => {
        setAlert({ message, type });
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:8080/commande_production_vente/${id}`);
            if (response.status === 200) {
                showAlert('Commande deleted successfully.', 'success');
                fetchCommandes();
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

    const handleGeneratePDF = async () => {
        if (!selectedCommande) {
            showAlert('Please select a commande to generate a PDF.', 'error');
            return;
        }

        const orderDetails = {
            clientName: selectedCommande.client_id.name,
            codeCommande: selectedCommande.code_commande,
            date: new Date(selectedCommande.date_commande).toISOString().slice(0, 10),
            versement: selectedCommande.versement,
            modePaiement: selectedCommande.modePaiement,
            codeCheque: selectedCommande.code_cheque,
            observation_com: selectedCommande.observation,
            commandes: selectedCommande.produits.map(prod => ({
                productionCode: prod.productfinished.productionCode,
                quantity: prod.quantity,
                prixUnitaire: prod.prixUnitaire
            }))
        };

        try {
            const response = await fetch('http://localhost:8080/generatePdfproductionvente', {
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
            link.setAttribute('download', `bon-de-commande-${selectedCommande.code_commande}.pdf`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Erreur lors de la génération du PDF :', error);
            showAlert('Erreur lors de la génération du PDF. Veuillez réessayer plus tard.');
        }
    };

    const indexOfLastCommande = currentPage * commandesPerPage;
    const indexOfFirstCommande = indexOfLastCommande - commandesPerPage;
    const currentCommandes = filteredCommandes.slice(indexOfFirstCommande, indexOfLastCommande);

    return (
        <div className="grid-container">
            <Header OpenSidebar={() => setOpenSidebarToggle(!openSidebarToggle)} />
            <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={() => setOpenSidebarToggle(!openSidebarToggle)} />
            <div className="container">
                <h1 className="title-all">Historique des Commandes de Vente</h1>
                <input
                    type="text"
                    placeholder="Search by code..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
                <table className='tabrespo'>
                    <thead>
                        <tr>
                          
                            <th>Code Commande</th>
                            <th>Client</th>
                            <th>Date Commande</th>
                            <th>Total Commande</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentCommandes.map((commande) => (
                            <tr key={commande._id}>
                                <td>{commande.code_commande}</td>
                                <td>{commande.client_id.name}</td>
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
                    <>
                    <div className="overlay"></div>                        
                    <div className="popup">
                        <div className="popup-content">
                            <span className="close-button" onClick={() => setSelectedCommande(null)}>&times;</span>
                            <h2>Commande Details</h2>
                            <p><strong>Client:</strong> {selectedCommande.client_id.name}</p>
                            <p><strong>Code:</strong> {selectedCommande.code_commande}</p>
                            <p><strong>Date of Commande:</strong> {new Date(selectedCommande.date_commande).toISOString().slice(0, 10)}</p>
                            <p><strong>Total Commande:</strong> {selectedCommande.totalCommande.toFixed(2)} DA</p>
                            <p><strong>Observation:</strong> {selectedCommande.observation}</p>
                            <p><strong>Versement:</strong> {selectedCommande.versement} DA</p>
                            <p><strong>Mode Paiement:</strong> {selectedCommande.modePaiement}</p>
                            <h3>Produits</h3>
                            <table >
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
                                            <td>{produit.quantity} m³</td>
                                            <td>{produit.prixUnitaire} DA</td>
                                            <td>{(produit.quantity * produit.prixUnitaire).toFixed(2)} DA</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <button className='pdf-button' onClick={handleGeneratePDF}>Télécharger PDF</button>
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
