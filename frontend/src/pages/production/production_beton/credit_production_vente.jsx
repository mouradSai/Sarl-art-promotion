import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../production_beton/SidebarProduction';
import Header from '../../../components/Main/Header';
import CustomAlert from '../../../components/costumeAlert/costumeAlert';

function App() {
    const [credits, setCredits] = useState([]);
    const [filteredCredits, setFilteredCredits] = useState([]);
    const [selectedCredit, setSelectedCredit] = useState(null);
    const [alert, setAlert] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
    const [paymentAmount, setPaymentAmount] = useState(0);

    const creditsPerPage = 5;

    const OpenSidebar = () => {
        setOpenSidebarToggle(!openSidebarToggle);
    };

    useEffect(() => {
        fetchCredits();
    }, []);

    useEffect(() => {
        const lowercasedFilter = searchText.toLowerCase();
        const filteredData = credits.filter(credit =>
            credit.vente.code_commande.toLowerCase().includes(lowercasedFilter) ||
            (credit.vente.client_id && credit.vente.client_id.name.toLowerCase().includes(lowercasedFilter))
        );
        // Sort filteredData by time of creation (assuming it's a valid date)
        filteredData.sort((a, b) => {
            const timeA = new Date(a.createdAt);
            const timeB = new Date(b.createdAt);
            if (timeA > timeB) return -1; // Sort descending for most recent first
            if (timeA < timeB) return 1;
            return 0;
        });
        setFilteredCredits(filteredData);
        setCurrentPage(1); // Reset to first page when search changes
    }, [searchText, credits]);

    const fetchCredits = async () => {
        try {
            const response = await axios.get('http://localhost:8080/credit_production_vente');
            const creditsData = response.data;
    
            // Filter credits to retrieve only those with minimum remaining payment (except if it's zero)
            const filteredData = creditsData.filter(credit => {
                const restAPayer = credit.resteAPayer;
                const sameCommandCredits = creditsData.filter(c => c.vente.code_commande === credit.vente.code_commande);
                const minRestAPayer = Math.min(...sameCommandCredits.map(c => c.resteAPayer));
    
                return restAPayer === minRestAPayer && restAPayer !== 0;
            });
    
            setCredits(filteredData.reverse());
        } catch (error) {
            console.error('Error fetching production credits:', error);
            showAlert('An error occurred while fetching production credits. Please try again later.', 'error');
        }
    };
    
    
    const showAlert = (message, type) => {
        setAlert({ message, type });
    };

    const handleView = (credit) => {
        setSelectedCredit(credit);
    };

    // Pagination Logic
    const indexOfLastCredit = currentPage * creditsPerPage;
    const indexOfFirstCredit = indexOfLastCredit - creditsPerPage;
    const currentCredits = filteredCredits.slice(indexOfFirstCredit, indexOfLastCredit);

    const handlePageChange = (pageOffset) => {
        setCurrentPage(prevPage => prevPage + pageOffset);
    };

    const handleAddPayment = async (creditId, paymentAmount) => {
        try {
            const response = await axios.post(`http://localhost:8080/credit_production_vente/add-payment/${creditId}`, { newPayment: paymentAmount });
            showAlert(response.data.message, 'success');
            // If payment is successful, refetch credits to update the data
            fetchCredits();
        } catch (error) {
            console.error('Error adding payment:', error);
            showAlert('Failed to add payment. Please try again.', 'error');
        }
    };
    
    return (
        <div className="grid-container">
            <Header OpenSidebar={() => setOpenSidebarToggle(!openSidebarToggle)} />
            <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={() => setOpenSidebarToggle(!openSidebarToggle)} />
            <div className="container">
                <h1 className="title-all">Crédits des ventes de production</h1>
                <input
                    type="text"
                    placeholder="Search credits..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
                <table className="table">
                    <thead>
                        <tr>
                            <th>Code Commande</th>
                            <th>Client</th>
                            <th>Date commande</th>
                            <th>Total Commande</th>
                            <th>Versement Initial</th>
                            <th>Reste à Payer</th>
                            <th>Mode de Paiement</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentCredits.map((credit) => (
                            <tr key={credit._id}>
                                <td>{credit.vente.code_commande}</td>
                                <td>{credit.vente.client_id ? credit.vente.client_id.name : 'No client'}</td>
                                <td>{credit.vente.date_commande}</td>

                                <td>{credit.vente.totalCommande.toFixed(2)} DA</td>
                                <td>{credit.vente.versement.toFixed(2)} DA</td>
                                <td>{credit.resteAPayer.toFixed(2)} DA</td>
                                <td>{credit.vente.modePaiement}</td>
                                <td>
                                    <button className='add-payment-button' onClick={() => setSelectedCredit(credit)}>Ajouter Paiement</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="pagination">
                    <button onClick={() => handlePageChange(-1)} disabled={currentPage === 1}>Previous</button>
                    <span>Page {currentPage} of {Math.ceil(filteredCredits.length / creditsPerPage)}</span>
                    <button onClick={() => handlePageChange(1)} disabled={currentPage === Math.ceil(filteredCredits.length / creditsPerPage)}>Next</button>
                </div>
                {selectedCredit && (
                    <div className="popup">
                        {/* Popup content to display credit details */}
                        <span className="close-button" onClick={() => setSelectedCredit(null)}>&times;</span>
                        <h2>Credit Details</h2>
                        <p><strong>Code Commande:</strong> {selectedCredit.vente.code_commande}</p>
                        <p><strong>Client:</strong> {selectedCredit.vente.client_id ? selectedCredit.vente.client_id.name : 'No client'}</p>
                        <p><strong>Total Commande:</strong> {selectedCredit.vente.totalCommande.toFixed(2)} DA</p>
                        <p><strong>Versement Initial:</strong> {selectedCredit.vente.versement.toFixed(2)} DA</p>
                        <p><strong>Reste à Payer:</strong> {selectedCredit.resteAPayer.toFixed(2)} DA</p>
                        <p><strong>Mode de Paiement:</strong> {selectedCredit.vente.modePaiement}</p>
                        <input
                            type="number"
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(parseFloat(e.target.value))}
                            placeholder="Enter payment amount"
                        />
                        <button onClick={() => handleAddPayment(selectedCredit._id, paymentAmount)}>Ajouter </button>
                    </div>
                )}
                {alert && <CustomAlert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
            </div>
        </div>
    );
}

export default App;
