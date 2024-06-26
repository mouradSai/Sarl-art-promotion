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
    }

    useEffect(() => {
        fetchProductions();
    }, []);

    useEffect(() => {
        filterProductions();
    }, [searchText, productions]);

    const fetchProductions = async () => {
        try {
            const response = await axios.get('http://localhost:8080/production_beton');
            console.log('API Response:', response.data); // Inspecter les données renvoyées par l'API
            const productionsData = response.data.productions || []; // Accéder au tableau de productions
            const sortedProductions = productionsData.sort((a, b) => new Date(b.date) - new Date(a.date)); // Trier par date décroissante
            setProductions(sortedProductions);
        } catch (error) {
            console.error('Erreur lors de la récupération des productions :', error);
            showAlert('Une erreur s est produite lors de la récupération des productions. Veuillez réessayer plus tard.', 'error');
        }
    };

    const filterProductions = () => {
        const lowercasedFilter = searchText.toLowerCase();
        const filteredData = productions.filter(production =>
            production.formula?.name.toLowerCase().includes(lowercasedFilter) ||
            production.codeProduction.toLowerCase().includes(lowercasedFilter)
        );
        setFilteredProductions(filteredData);
        setCurrentPage(1); // Reset to the first page whenever the filter changes
    };

    const showAlert = (message, type) => {
        setAlert({ message, type });
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:8080/production_beton/${id}`);
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
                <h1 className="title-all">Historique des Productions</h1>
                <input
                    type="text"
                    placeholder="Recherche par code ou formule..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
                <table className="comtab">
                    <thead>
                        <tr>
                            <th>Code Production</th>
                            <th>Formule</th>
                            <th>Date Production</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentProductions.map((production) => (
                            <tr key={production._id}>
                                <td>{production.codeProduction}</td>
                                <td>{production.formula ? production.formula.name : 'No formula'}</td>
                                <td>{new Date(production.date).toISOString().slice(0, 10)}</td>
                                <td>
                                    <button className='view-button' onClick={() => handleView(production)}>Détails</button>
                                    {/* <button className='delete-button' onClick={() => handleDelete(production._id)}>Delete</button> */}
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
                            <h2>Détails de production</h2>
                            <p><strong>Code Production:</strong> {selectedProduction.codeProduction}</p>
                            <p><strong>Date de production:</strong> {new Date(selectedProduction.date).toISOString().slice(0, 10)}</p>
                            <p><strong>Formule:</strong> {selectedProduction.formula ? selectedProduction.formula.name : 'N/A'}</p>
                            <p><strong>Description:</strong> {selectedProduction.description}</p>
                            <p><strong>Volume Produit:</strong> {selectedProduction.volumeDesired}m³</p>
                            <p><strong>Observations:</strong> {selectedProduction.observations}</p>
                            <h3>Les matériaux utilisés</h3>
                            <table>
                                <thead>
                                    <tr>
                                        <th className='titlesHis'>Product</th>
                                        <th className='titlesHis'>Quantity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedProduction.materialsUsed.map((material, index) => (
                                        <tr key={index}>
                                            <td>{material.product.name}</td>
                                            <td>{material.quantity}KG</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
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
