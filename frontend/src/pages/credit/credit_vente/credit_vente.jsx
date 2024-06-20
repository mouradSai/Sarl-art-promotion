import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../../components/Main/Sidebar';
import Header from '../../../components/Headers/HeaderCommande';
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
            credit.commande.code_commande.toLowerCase().includes(lowercasedFilter) ||
            (credit.commande.client_id && credit.commande.client_id.name.toLowerCase().includes(lowercasedFilter))
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
            const response = await axios.get('http://localhost:8080/credit_vente');
            const creditsData = response.data;
    
            // Filtrer les crédits pour récupérer uniquement ceux avec le reste à payer minimum (sauf s'il est égal à zéro)
            const filteredData = creditsData.filter(credit => {
                const restAPayer = credit.resteAPayer;
                const sameCommandCredits = creditsData.filter(c => c.commande.code_commande === credit.commande.code_commande);
                const minRestAPayer = Math.min(...sameCommandCredits.map(c => c.resteAPayer));
    
                return restAPayer === minRestAPayer && restAPayer !== 0;
            });
    
            setCredits(filteredData.reverse());
        } catch (error) {
            console.error('Erreur lors de la récupération des crédits:', error);
            showAlert('Une erreur s est produite lors de la récupération des crédits. Veuillez réessayer plus tard.', 'Erreur');
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
            const response = await axios.post(`http://localhost:8080/credit_vente/add-payment/${creditId}`, { newPayment: paymentAmount });
            showAlert(response.data.message, 'success');
            // If payment is successful, refetch credits to update the data
            fetchCredits();
        } catch (error) {
            console.error('Erreur lors de l ajout du paiement:', error);
            showAlert('Échec de l ajout du paiement. Veuillez réessayer.', 'Erreur');
        }
    };
    
    return (
        <div className="grid-container">
            <Header OpenSidebar={() => setOpenSidebarToggle(!openSidebarToggle)} />
            <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={() => setOpenSidebarToggle(!openSidebarToggle)} />
            <div className="container">
                <h1 className="title-all">Crédits des ventes</h1>
                <input
                    type="text"
                    placeholder="Search credits..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
                <table className='tabrespo'>
                    <thead>
                        <tr>
                            <th>Code Commande</th>
                            <th>Client</th>
                            <th>Date commande</th>
                            <th>Total Commande</th>
                            <th>Versement </th>
                            <th>Reste à Payer</th>
                            <th>Mode de Paiement</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentCredits.map((credit) => (
                            <tr key={credit._id}>
                                <td>{credit.commande.code_commande}</td>
                                <td>{credit.commande.client_id ? credit.commande.client_id.name : 'No client'}</td>
                                <td>{credit.commande.date_commande}</td>
                                <td>{credit.commande.totalCommande.toFixed(2)} DA</td>
                                <td>{credit.commande.versement} DA</td>
                                <td>{credit.resteAPayer.toFixed(2)} DA</td>
                                <td>{credit.commande.modePaiement}</td>
                                <td>
                                    <button className='add-payment-button' onClick={() => setSelectedCredit(credit)}>Ajouter Paiement</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="pagination">
                    <button onClick={() => handlePageChange(-1)} disabled={currentPage === 1}>Précédent</button>
                    <span>Page {currentPage} of {Math.ceil(filteredCredits.length / creditsPerPage)}</span>
                    <button onClick={() => handlePageChange(1)} disabled={currentPage === Math.ceil(filteredCredits.length / creditsPerPage)}>Suivant</button>
                </div>
                {selectedCredit && (
                     <>
                     <div className="overlay"></div>                        
                    <div className="popup">
                        {/* Popup content to display credit details */}
                        <span className="close-button" onClick={() => setSelectedCredit(null)}>&times;</span>
                        <h2>Détails du crédit</h2>
                        <p><strong>Code Commande:</strong> {selectedCredit.commande.code_commande}</p>
                        <p><strong>Client:</strong> {selectedCredit.commande.client_id ? selectedCredit.commande.client_id.name : 'No client'}</p>
                        <p><strong>Total Commande:</strong> {selectedCredit.commande.totalCommande.toFixed(2)} DA</p>
                        <p><strong>Versement :</strong> {selectedCredit.commande.versement.toFixed(2)} DA</p>
                        <p><strong>Reste à Payer:</strong> {selectedCredit.resteAPayer.toFixed(2)} DA</p>
                        <p><strong>Mode de Paiement:</strong> {selectedCredit.commande.modePaiement}</p>
                        <input
                            type="number"
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(parseFloat(e.target.value))}
                            placeholder="Enter payment amount"
                        />
                        <button onClick={() => handleAddPayment(selectedCredit._id, paymentAmount)}>Ajouter </button>
                    </div>
                       </>
                )}
                {alert && <CustomAlert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
            </div>
        </div>
    );
}

export default App;
