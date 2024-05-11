import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../SidebarProduction';
import Header from '../../../../components/Main/Header';
import CustomAlert from '../../../../components/costumeAlert/costumeAlert';

function App() {
    const [productions, setProductions] = useState([]);
    const [filteredProductions, setFilteredProductions] = useState([]);
    const [selectedProduction, setSelectedProduction] = useState(null);
    const [alert, setAlert] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const productionsPerPage = 5;

    useEffect(() => {
        fetchProductions();
    }, []);

    useEffect(() => {
        filterProductions();
    }, [searchText, productions]);

    const fetchProductions = async () => {
        try {
            const response = await axios.get('http://localhost:8080/production_beton');
            setProductions(response.data);
        } catch (error) {
            console.error('Error fetching productions:', error);
            showAlert('An error occurred while fetching productions. Please try again later.', 'error');
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
                showAlert('Production deleted successfully.', 'success');
                fetchProductions(); // Refetch all data to update the UI accordingly
            } else {
                showAlert(response.data.message || 'An error occurred while deleting the production.', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showAlert('An error occurred. Please try again later.', 'error');
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
            <Header />
            <Sidebar />
            <div className="container">
                <h1 className="title-all">Historique des Productions</h1>
                <input
                    type="text"
                    placeholder="Search by code or formula..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
                <table className="table">
                    <thead>
                        <tr>
                            <th >Code Production</th>
                            <th>Formula</th>
                            <th>Date Production</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentProductions.map((production) => (
                            <tr key={production._id}>
                                <td>{production.codeProduction}</td>
                                <td>{production.formula ? production.formula.name : 'No formula'}</td>
                                <td>{new Date(production.date).toISOString().slice(0, 10)}</td>
                                <td>
                                    <button className='view-button' onClick={() => handleView(production)}>Details</button>
                                    {/* <button className='delete-button' onClick={() => handleDelete(production._id)}>Delete</button> */}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="pagination">
                    <button onClick={() => handlePageChange(-1)} disabled={currentPage === 1}>Previous</button>
                    <span>Page {currentPage} of {Math.ceil(filteredProductions.length / productionsPerPage)}</span>
                    <button onClick={() => handlePageChange(1)} disabled={currentPage === Math.ceil(filteredProductions.length / productionsPerPage)}>Next</button>
                </div>
                {selectedProduction && (
    <div className="popup">
        <div className="popup-content">
            <span className="close-button" onClick={() => setSelectedProduction(null)}>&times;</span>
            <h2>Production Details</h2>
            <p><strong>Code:</strong> {selectedProduction.codeProduction}</p>
            <p><strong>Date of Production:</strong> {new Date(selectedProduction.date).toISOString().slice(0, 10)}</p>
            <p><strong>Formula Name:</strong> {selectedProduction.formula ? selectedProduction.formula.name : 'N/A'}</p>
            <p><strong>Description:</strong> {selectedProduction.description}</p>
            <p><strong>Volume Desired:</strong> {selectedProduction.volumeDesired}m³</p>
            <p><strong>Observations:</strong> {selectedProduction.observations}</p>
            <h3>Materials Used</h3>
            <table>
                <thead>
                    <tr>
                        <th  className='titlesHis'>Product</th>
                        <th  className='titlesHis'>Quantity</th>
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
)}

                {alert && <CustomAlert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
            </div>
        </div>
    );
}

export default App;
