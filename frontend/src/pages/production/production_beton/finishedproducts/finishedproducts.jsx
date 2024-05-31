import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../SidebarProduction';
import Header from '../../../../components/Main/Header';
import CustomAlert from '../../../../components/costumeAlert/costumeAlert';

function App() {
    const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
    const [productions, setProductions] = useState([]);
    const [filteredProductions, setFilteredProductions] = useState([]);
    const [selectedProduction, setSelectedProduction] = useState(null);
    const [alert, setAlert] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const productionsPerPage = 5;

    const OpenSidebar = () => {
        setOpenSidebarToggle(!openSidebarToggle);
    };

    useEffect(() => {
        fetchProductions();
    }, []);

    useEffect(() => {
        filterProductions();
    }, [searchText, productions]);

    const fetchProductions = async () => {
        try {
            const response = await axios.get('http://localhost:8080/production_beton/finished-products');
            const filteredData = response.data.filter(production => production.volumeProduced > 0);
            // Inverse l'ordre des productions pour afficher les plus récentes en premier
            setProductions(filteredData.reverse());
        } catch (error) {
            console.error('Erreur lors de la récupération des productions :', error);
            showAlert('Une erreur s est produite lors de la récupération des productions. Veuillez réessayer plus tard.', 'error');
        }
    };

    const filterProductions = () => {
        const lowercasedFilter = searchText.toLowerCase();
        const filteredData = productions.filter(production =>
            (production.formulaName && production.formulaName.toLowerCase().includes(lowercasedFilter)) ||
            (production.productionCode && production.productionCode.toLowerCase().includes(lowercasedFilter))
        );
        setFilteredProductions(filteredData);
        setCurrentPage(1); // Reset to the first page whenever the filter changes
    };

    const showAlert = (message, type) => {
        setAlert({ message, type });
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:8080/production_beton/finished-products/${id}`);
            if (response.status === 200) {
                showAlert('Production supprimée avec succès.', 'success');
                fetchProductions(); // Refetch all data to update the UI accordingly
            } else {
                showAlert(response.data.message || 'Une erreur s est produite lors de la suppression de la production.', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showAlert('Une erreur s est produite. Veuillez réessayer plus tard.', 'error');
        }
    };

    const handleView = (production) => {
        setSelectedProduction(production);
    };

    const handlePageChange = (pageOffset) => {
        setCurrentPage(prevPage => prevPage + pageOffset);
    };

    // Calculate the current productions to be displayed based on pagination
    const indexOfLastProduction = currentPage * productionsPerPage;
    const indexOfFirstProduction = indexOfLastProduction - productionsPerPage;
    const currentProductions = filteredProductions.slice(indexOfFirstProduction, indexOfLastProduction);

    return (
        <div className="grid-container">
            <Header OpenSidebar={() => setOpenSidebarToggle(!openSidebarToggle)} />
            <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={() => setOpenSidebarToggle(!openSidebarToggle)} />
            <div className="container">
                <h1 className="title-all">Stock fini</h1>
                <input
                    type="text"
                    placeholder="Recherche par code ou formule..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
                <table className="">
                    <thead>
                        <tr>
                            <th>Code Production</th>
                            <th>Formule</th>
                            <th>Date Production</th>
                            <th>Volume produit</th>
                            <th>Prix Unitaire</th> {/* Ajout de la colonne Prix Unitaire */}
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentProductions.map((production) => (
                            <tr key={production._id}>
                                <td>{production.productionCode}</td>
                                <td>{production.formulaName}</td>
                                <td>{new Date(production.date).toISOString().slice(0, 10)}</td>
                                <td>{production.volumeProduced}m³</td>
                                <td>{production.prixUnitaire.toFixed(2)} DA</td> {/* Affichage du Prix Unitaire */}
                                <td>
                                    <button className='view-button' onClick={() => handleView(production)}>Détails</button>
                                    <button className='delete-button' onClick={() => handleDelete(production._id)}>Supprimer</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="pagination">
                    <button onClick={() => handlePageChange(-1)} disabled={currentPage === 1}>Précédent</button>
                    <span>Page {currentPage} of {Math.ceil(filteredProductions.length / productionsPerPage)}</span>
                    <button onClick={() => handlePageChange(1)} disabled={currentPage === Math.ceil(filteredProductions.length / productionsPerPage)}>Suivant</button>
                </div>
                {selectedProduction && (
                    <>
                    <div className="overlay"></div>                     
                    <div className="popup">
                        <div className="popup-content">
                            <span className="close-button" onClick={() => setSelectedProduction(null)}>&times;</span>
                            <h2>Détails de Produit fini</h2>
                            <p><strong>Code:</strong> {selectedProduction.productionCode}</p>
                            <p><strong>Date de production:</strong> {new Date(selectedProduction.date).toISOString().slice(0, 10)}</p>
                            <p><strong>Formule:</strong> {selectedProduction.formulaName}</p>
                            <p><strong>Volume produit:</strong> {selectedProduction.volumeProduced}m³</p>
                            <p><strong>Prix Unitaire:</strong> {selectedProduction.prixUnitaire.toFixed(2)} DA</p> {/* Affichage du Prix Unitaire */}
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
