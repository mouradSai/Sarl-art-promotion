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
                const formulaName = bon.formules.length > 0 ? bon.formules[0].formula.name : "";
                return { ...bon, formulaName };
            });

            bonsProductionWithFormulas.sort((a, b) => new Date(b.date) - new Date(a.date));
            setBonsProduction(bonsProductionWithFormulas);
        } catch (error) {
            console.error('Error fetching bons production:', error);
            showAlert('An error occurred while fetching bons production. Please try again later.', 'error');
        }
    };

    const filterBonsProduction = () => {
        if (!bonsProduction) return;

        const lowercasedFilter = searchText.toLowerCase();
        const filteredData = bonsProduction.filter(bonProduction =>
            (bonProduction.client_id.name && bonProduction.client_id.name.toLowerCase().includes(lowercasedFilter)) ||
            (bonProduction.code_bon && bonProduction.code_bon.toLowerCase().includes(lowercasedFilter))
        );
        setFilteredBonsProduction(filteredData);
        setCurrentPage(1);
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

    const handleGeneratePDF = async () => {
        if (!selectedBonProduction) {
            showAlert('Please select a bon de production to generate a PDF.', 'error');
            return;
        }

        const bonDetails = {
            codeBon: selectedBonProduction.code_bon,
            formulaName: selectedBonProduction.formulaName,
            clientName: selectedBonProduction.client_id.name,
            date: new Date(selectedBonProduction.date).toISOString().slice(0, 10),
            heure: selectedBonProduction.heure,
            quantite: selectedBonProduction.quantite,
            lieuLivraison: selectedBonProduction.lieu_livraison,
            produits: selectedBonProduction.produits // Assurez-vous que les produits sont inclus ici
        };

        try {
            const response = await fetch('http://localhost:8080/generatePdfBonProduction', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bonDetails)
            });

            if (!response.ok) {
                throw new Error(`Erreur lors de la génération du PDF: ${response.statusText}`);
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `bon-de-production-${selectedBonProduction.code_bon}.pdf`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Erreur lors de la génération du PDF :', error);
            showAlert('Erreur lors de la génération du PDF. Veuillez réessayer plus tard.');
        }
    };

    const indexOfLastBonProduction = currentPage * bonsProductionPerPage;
    const indexOfFirstBonProduction = indexOfLastBonProduction - bonsProductionPerPage;
    const currentBonsProduction = filteredBonsProduction.slice(indexOfFirstBonProduction, indexOfLastBonProduction);

    return (
        <div className="grid-container">
            <Header />
            <Sidebar />
            <div className="container">
                <h1 className="title-all">Historique des Bons</h1>
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
                                <td>{bonProduction.quantite} m³</td>
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
                            <p><strong>Quantité:</strong> {selectedBonProduction.quantite} m³</p>
                            <p><strong>Lieu de livraison:</strong> {selectedBonProduction.lieu_livraison}</p>
                            <button className='pdf-button' onClick={handleGeneratePDF}>Télécharger PDF</button>
                        </div>
                    </div>
                )}
                {alert && <CustomAlert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
            </div>
        </div>
    );
}

export default HistoriqueBon;
