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

    const fetchCredits = async () => {
        try {
            const response = await axios.get('http://localhost:8080/credit_vente');
            setCredits(response.data.reverse());
        } catch (error) {
            console.error('Erreur lors de la récupération des crédits :', error);
            showAlert('Une erreur s est produite lors de la récupération des crédits. Veuillez réessayer plus tard.', 'Erreur');
        }
    };
    
    useEffect(() => {
        const lowercasedFilter = searchText.toLowerCase();
        const filteredData = credits.filter(credit => {
            return credit.commande.code_commande.toLowerCase().includes(lowercasedFilter) ||
                   (credit.commande.provider_id && credit.commande.provider_id.name.toLowerCase().includes(lowercasedFilter));
        });
    
        // Sort filteredData by time of creation
        filteredData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setFilteredCredits(filteredData);
        setCurrentPage(1); // Reset to first page when search changes
    }, [searchText, credits]);
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
            showAlert(response.data.message, 'succès');
            // If payment is successful, refetch credits to update the data
            fetchCredits();
        } catch (error) {
            console.error('Erreur lors de l ajout du paiement:', error);
            showAlert('Échec de l ajout du paiement. Veuillez réessayer.', 'Erreur');
        }
    };
    const handleDeleteCredit = async (codeCommande) => {
        try {
            const response = await axios.delete(`http://localhost:8080/credit_vente/delete-by-commande/${codeCommande}`);
            showAlert(response.data.message, 'succès');
            fetchCredits(); // Refetch the credits to update the list after deletion
        } catch (error) {
            console.error('Erreur lors de la suppression du crédit:', error);
            showAlert('Échec de la suppression du crédit. Veuillez réessayer.', 'Erreur');
        }
    };
    
    return (
            <div className="grid-container">
                <Header OpenSidebar={() => setOpenSidebarToggle(!openSidebarToggle)} />
                <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={() => setOpenSidebarToggle(!openSidebarToggle)} />
                <div className="container">
                    <h1 className="title-all">Historique des crédits de ventes</h1>
                    <input
                        type="text"
                        placeholder="Rechercher des crédits.."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Code Commande</th>
                                <th>Fournisseur</th>
                                <th>Date commande</th>
                                <th>Total Commande</th>
                                <th>Versement </th>
                                <th>Reste à Payer</th>
                                <th>Mode de Paiement</th>
                                <th>N° cheque</th>

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
                                    <td>{credit.commande.versement ? credit.commande.versement.toFixed(2): 'N/A'} DA</td>
                                    <td>{credit.resteAPayer ? credit.resteAPayer.toFixed(2): 'N/A'} DA</td>
                                    <td>{credit.commande.modePaiement}</td>
                                    <td>{credit.commande.code_cheque || 'N/A'}</td>

                                    <td>
                                        <button className='delete-button' onClick={() => handleDeleteCredit(credit.commande.code_commande)}>Delete</button>
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
                  
                    {alert && <CustomAlert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
                </div>
            </div>
        );
        
}

export default App;
