import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../../components/Main/Sidebar';
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
            const response = await axios.get('http://localhost:8080/commandes');
            setCommandes(response.data.commandes);
        } catch (error) {
            console.error('Error fetching commandes:', error);
            showAlert('An error occurred while fetching commandes. Please try again later.', 'error');
        }
    };

    const filterCommandes = () => {
        const lowercasedFilter = searchText.toLowerCase();
        const filteredData = commandes.filter(commande =>
            commande.provider_id.name.toLowerCase().includes(lowercasedFilter) ||
            commande.code_commande.toLowerCase().includes(lowercasedFilter)
        );
        setFilteredCommandes(filteredData);
        setCurrentPage(1); // Reset to first page when filter changes
    };

    const showAlert = (message, type) => {
        setAlert({ message, type });
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:8080/commandes/${id}`);
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

    const handleGeneratePDF = async () => {
        if (!selectedCommande) {
            showAlert('Please select a commande to generate a PDF.');
            return;
        }
        if (!selectedCommande.produits || selectedCommande.produits.length === 0) {
            showAlert('No products in the commande.');
            return;
        }
    
        const orderDetails = {
            providerName: selectedCommande.provider_id ? selectedCommande.provider_id.name : '',
            codeCommande: selectedCommande.code_commande,
            date: new Date(selectedCommande.date_commande).toISOString().slice(0, 10),
            observation_com: selectedCommande.observation,
            commandes: selectedCommande.produits.map(prod => ({
                product_name: prod.product ? prod.product.name : 'Product name not available',
                quantity: prod.quantity
            }))
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
            link.setAttribute('download', `bon-de-commande-${orderDetails.codeCommande}.pdf`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Erreur lors de la génération du PDF :', error);
            showAlert('Erreur lors de la génération du PDF. Veuillez réessayer plus tard.');
        }
    };
    
    // Pagination Logic
    const indexOfLastCommande = currentPage * commandesPerPage;
    const indexOfFirstCommande = indexOfLastCommande - commandesPerPage;
    const currentCommandes = filteredCommandes.slice(indexOfFirstCommande, indexOfLastCommande);

    return (
        <div className="grid-container">
            <Header />
            <Sidebar />
            <div className="container">
                <h1 className="title-all">Historique des bons</h1>
                <input
                    type="text"
                    placeholder="Search by code or provider..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
                <table className="table">
                    <thead>
                        <tr>
                            <th>Code Commande</th>
                            <th>Provider</th>
                            <th>Date Commande</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentCommandes.map((commande) => (
                            <tr key={commande._id}>
                                <td>{commande.code_commande}</td>
                                <td>{commande.provider_id ? commande.provider_id.name : 'No provider'}</td>
                                <td>{new Date(commande.date_commande).toISOString().slice(0, 10)}</td>
                                <td>
                                    <button className='view-button' onClick={() => handleView(commande)}>View</button>
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
                            <p><strong>Code Commande:</strong> {selectedCommande.code_commande}</p>
                            <p><strong>Date Commande:</strong> {new Date(selectedCommande.date_commande).toISOString().slice(0, 10)}</p>
                            <p><strong>Provider:</strong> {selectedCommande.provider_id ? selectedCommande.provider_id.name : 'No provider'}</p>
                            <p><strong>Observation:</strong> {selectedCommande.observation}</p>
                            <table>
                                <thead>
                                    <tr>
                                        <th className='titlesHis'>Product Name</th>
                                        <th className='titlesHis'>Quantity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedCommande.produits.map((prod, index) => (
                                        <tr key={index}>
                                            <td>{prod.product.name}</td>
                                            <td>{prod.quantity}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <button onClick={handleGeneratePDF}>Download PDF</button>
                        </div>
                    </div>
                )}
                {alert && <CustomAlert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
            </div>
        </div>
    );
}

export default App;
