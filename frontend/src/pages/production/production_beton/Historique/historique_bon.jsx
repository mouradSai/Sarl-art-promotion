import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../SidebarProduction';
import Header from '../../../../components/Main/Header';
import CustomAlert from '../../../../components/costumeAlert/costumeAlert';

function HistoriqueBon() {
    const [bonsProduction, setBonsProduction] = useState([]);
    const [filteredBonsProduction, setFilteredBonsProduction] = useState([]);
    const [selectedBonProduction, setSelectedBonProduction] = useState(null);
    const [alert, setAlert] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const bonsProductionPerPage = 5;

    useEffect(() => {
        fetchBonsProduction();
    }, []);

    useEffect(() => {
        filterBonsProduction();
    }, [searchText, bonsProduction]);


    const fetchBonsProduction = async () => {
        try {
            const response = await axios.get('http://localhost:8080/bon_production');
            const bonsProductionWithFormulas = response.data.bonsProduction.map(bon => {
                // Assuming you have the formula name available in 'formula' object
                const formulaName = bon.formules.length > 0 ? bon.formules[0].formula.name : "";
                return {...bon, formulaName };
            });
    
            // Sort the bons production by date in descending order
            bonsProductionWithFormulas.sort((a, b) => new Date(b.date) - new Date(a.date));
    
            setBonsProduction(bonsProductionWithFormulas);
        } catch (error) {
            console.error('Error fetching bons production:', error);
            showAlert('An error occurred while fetching bons production. Please try again later.', 'error');
        }
    };
    


    const filterBonsProduction = () => {
        if (!bonsProduction) {
            return; // Quitter la fonction si bonsProduction est undefined ou null
        }
    
        const lowercasedFilter = searchText.toLowerCase();
        const filteredData = bonsProduction.filter(bonProduction =>
            (bonProduction.client_name && bonProduction.client_name.toLowerCase().includes(lowercasedFilter)) ||
            (bonProduction.code_bon && bonProduction.code_bon.toLowerCase().includes(lowercasedFilter))
        );
        setFilteredBonsProduction(filteredData);
        setCurrentPage(1); // Reset to the first page whenever the filter changes
    };

    
    

    const showAlert = (message, type) => {
        setAlert({ message, type });
    };

    const handleView = (bonProduction) => {
        setSelectedBonProduction(bonProduction);
    };

    const handlePageChange = (pageOffset) => {
        setCurrentPage(prevPage => prevPage + pageOffset);
    };

    // Calculate the current bons production to be displayed based on pagination
    const indexOfLastBonProduction = currentPage * bonsProductionPerPage;
    const indexOfFirstBonProduction = indexOfLastBonProduction - bonsProductionPerPage;
    const currentBonsProduction = filteredBonsProduction.slice(indexOfFirstBonProduction, indexOfLastBonProduction);

    return (
        <div className="grid-container">
            <Header />
            <Sidebar />
            <div className="container">
                <h1 className="title-all">Historique des Bons de Production</h1>
                <input
                    type="text"
                    placeholder="Rechercher par code ou client..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
                <table className="table">
                    <thead>
                        <tr>
                            <th>Code Bon</th>
                            <th>Formule</th>
                            <th>Client</th>
                            <th>Date</th>
                            <th>Heure</th>
                            <th>Quantité</th>
                            <th>Lieu de livraison</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                    {currentBonsProduction.map((bonProduction) => (
                        <tr key={bonProduction._id}>
                            <td>{bonProduction.code_bon}</td>
                            <td>{bonProduction.formulaName}</td>
                            <td>{bonProduction.client_id.name}</td>
                            <td>{new Date(bonProduction.date).toISOString().slice(0, 10)}</td>
                            <td>{bonProduction.heure}</td>
                            <td>{bonProduction.quantite}</td>
                            <td>{bonProduction.lieu_livraison}</td>
                            <td>
                                <button className='view-button' onClick={() => handleView(bonProduction)}>Détails</button>
                                {/* <button className='delete-button' onClick={() => handleDelete(bonProduction._id)}>Supprimer</button> */}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <div className="pagination">
                    <button onClick={() => handlePageChange(-1)} disabled={currentPage === 1}>Précédent</button>
                    <span>Page {currentPage} sur {Math.ceil(filteredBonsProduction.length / bonsProductionPerPage)}</span>
                    <button onClick={() => handlePageChange(1)} disabled={currentPage === Math.ceil(filteredBonsProduction.length / bonsProductionPerPage)}>Suivant</button>
                </div>
                {selectedBonProduction && (
                    <div className="popup">
                        <div className="popup-content">
                            <span className="close-button" onClick={() => setSelectedBonProduction(null)}>&times;</span>
                            <h2>Détails du Bon de Production</h2>
                            <p><strong>Code Bon:</strong> {selectedBonProduction.code_bon}</p>
                            <p><strong>Formule:</strong> {selectedBonProduction.formulaName}</p>
                            <p><strong>Client:</strong> {selectedBonProduction.client_id.name}</p>
                            <p><strong>Date:</strong> {new Date(selectedBonProduction.date).toISOString().slice(0, 10)}</p>
                            <p><strong>Heure:</strong> {selectedBonProduction.heure}</p>
                            <p><strong>Quantité:</strong> {selectedBonProduction.quantite}</p>
                            <p><strong>Lieu de livraison:</strong> {selectedBonProduction.lieu_livraison}</p>
                            {/* Ajoutez d'autres détails du bon de production ici si nécessaire */}
                        </div>
                    </div>
                )}
                {alert && <CustomAlert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
            </div>
        </div>
    );
}

export default HistoriqueBon;
