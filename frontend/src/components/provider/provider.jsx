import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../Main/Sidebar';
import Header from '../Main/Header';
import './Appprovider.css';
import CustomAlert from '../costumeAlert/costumeAlert'; // Import du composant CustomAlert

function App() {
    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.reload();
    };

    const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

    const OpenSidebar = () => {
        setOpenSidebarToggle(!openSidebarToggle);
    };

    const [providers, setProviders] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        description: '',
        number: '',
        comment: '',
        isActive: true
    });
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editProviderId, setEditProviderId] = useState('');
    const [selectedProvider, setSelectedProvider] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [alert, setAlert] = useState(null); 
    const providersPerPage = 8; // Nombre de fournisseurs à afficher par page
    const showAlert = (message, type) => {
        setAlert({ message, type });
      };
    useEffect(() => {
        fetchProviders();
    }, []);

    const fetchProviders = async () => {
        try {
            const response = await axios.get('http://localhost:8080/providers');
            setProviders(response.data.data);
        } catch (error) {
            console.error('Error:', error);
            showAlert('An error occurred while fetching providers. Please try again later.');
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!formData.name || !formData.address || !formData.description || !formData.number || !formData.comment) {
            showAlert('Please fill in all required fields.');
            return;
        }
        try {
            const response = await axios.post('http://localhost:8080/providers', formData);
            if (response.status === 201) {
                showAlert('Provider added successfully.');
                fetchProviders();
                resetFormData();
                setShowCreateForm(false);
            } else {
                showAlert(response.data.message || 'An error occurred.');
            }
        } catch (error) {
            console.error('Error:', error);
            if (error.response) {
                showAlert(error.response.data.message || 'An error occurred.');
            } else {
                showAlert('An error occurred. Please try again later.');
            }
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:8080/providers/${id}`);
            if (response.status === 200) {
                showAlert('Provider deleted successfully.');
                fetchProviders();
            } else {
                showAlert(response.data.message || 'An error occurred while deleting provider.');
            }
        } catch (error) {
            console.error('Error:', error);
            showAlert('An error occurred. Please try again later.');
        }
    };

    const handleEdit = (provider) => {
        setEditProviderId(provider._id);
        setFormData({ ...provider });
        setShowCreateForm(true);
    };

    const handleView = (provider) => {
        setSelectedProvider(provider);
    };

    const handleEditSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.put(`http://localhost:8080/providers/${editProviderId}`, formData);
            if (response.status && response.status === 200) {
                showAlert('Provider updated successfully.');
                fetchProviders();
                setEditProviderId('');
                resetFormData();
                setShowCreateForm(false);
            } else {
                showAlert(response.data.message || 'An error occurred while updating provider.');
            }
        } catch (error) {
            console.error('Error:', error);
            showAlert('An error occurred. Please try again later.');
        }
    };

    const resetFormData = () => {
        setFormData({
            name: '',
            address: '',
            description: '',
            number: '',
            comment: '',
            isActive: true
        });
    };

 
    const filterProviders = (providers, searchText) => {
        return providers.filter(provider => {
            return (
                provider.name.toLowerCase().includes(searchText.toLowerCase())||
                provider.address.toLowerCase().includes(searchText.toLowerCase())||
                provider.description.toLowerCase().includes(searchText.toLowerCase())

        );
           
        });
    };

    const handleSearchChange = (event) => {
        setSearchText(event.target.value);
    };

    const indexOfLastProvider = currentPage * providersPerPage;
    const indexOfFirstProvider = indexOfLastProvider - providersPerPage;
    const filteredProviders = filterProviders(providers, searchText).slice(indexOfFirstProvider, indexOfLastProvider);

    return (
        <div className="grid-container">
            <Header OpenSidebar={OpenSidebar}/>
            <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
            <div className="container">
                <h1 className="title-all" >Fourniseurs</h1>
                <div className="actions">
                <input
                        type="text"
                        placeholder="Search providers..."
                        value={searchText}
                        onChange={handleSearchChange}
                    />
                    <button className="create-button" onClick={() => setShowCreateForm(true)}>Create</button>
                   
                </div>
                {showCreateForm && (
                    <div className="popup">
                        <div className="popup-content">
                            <span className="close-button" onClick={() => setShowCreateForm(false)}>&times;</span>
                            <h2>Create New Provider</h2>
                            <form onSubmit={handleSubmit}>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
                                <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" />
                                <input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="Description" />
                                <input type="text" name="number" value={formData.number} onChange={handleChange} placeholder="Number" />
                                <input type="text" name="comment" value={formData.comment} onChange={handleChange} placeholder="Comment" />
                                <input type="Boolean" name="IsActive" value={formData.IsActive} onChange={handleChange} placeholder="IsActive" />
                                <button className="create-button" type="submit">Save</button>
                                <button className='delet-button' onClick={() => setShowCreateForm(false)}>Cancel</button>
                            </form>
                        </div>
                    </div>
                )}
                {filteredProviders.length > 0 && (
                    <>
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Address</th>
                                    <th>Description</th>
                                    <th>Number</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProviders.map(provider => (
                                    <tr key={provider._id}>
                                        <td>{provider.name}</td>
                                        <td>{provider.address}</td>
                                        <td>{provider.description}</td>
                                        <td>{provider.number}</td>
                                        <td>
                                            <button className='view-button' onClick={() => handleView(provider)}>View</button>
                                            <button className='edit-button' onClick={() => handleEdit(provider)}>Edit</button>
                                            <button className='action-button delete-button' onClick={() => handleDelete(provider._id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="pagination">
                            <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>&lt; Prev</button>
                            <span>{currentPage}</span>
                            <button disabled={filteredProviders.length < providersPerPage} onClick={() => setCurrentPage(currentPage + 1)}>Next &gt;</button>
                        </div>
                    </>
                )}
                {filteredProviders.length === 0 && (
                    <p>No providers found.</p>
                )}
                {selectedProvider && (
                    <div className="popup">
                        <div className="popup-content">
                            <span className="close-button" onClick={() => setSelectedProvider(null)}>&times;</span>
                            <h2>Provider Details</h2>
                            <p>Name: {selectedProvider.name}</p>
                            <p>Address: {selectedProvider.address}</p>
                            <p>Description: {selectedProvider.description}</p>
                            <p>Number: {selectedProvider.number}</p>
                            <p>Comment: {selectedProvider.comment}</p>
                            <button className='delet-button' onClick={() => setSelectedProvider(null)}>Cancel</button>
                        </div>
                    </div>
                )}
                {editProviderId && (
                    <div className="popup">
                        <div className="popup-content">
                            <span className="close-button" onClick={() => {setEditProviderId(''); resetFormData(); setShowCreateForm(false);}}>&times;</span>
                            <h2>Edit Provider</h2>
                            <form onSubmit={handleEditSubmit}>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
                                <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" />
                                <input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="Description" />
                                <input type="text" name="number" value={formData.number} onChange={handleChange} placeholder="Number" />
                                <input type="text" name="comment" value={formData.comment} onChange={handleChange} placeholder="Comment" />
                                <input type="Boolean" name="IsActive" value={formData.IsActive} onChange={handleChange} placeholder="IsActive" />
                                <button className="create-button" type="submit">Save</button>
                                <button className='delet-button' onClick={() => {setEditProviderId(''); resetFormData(); setShowCreateForm(false);}}>Cancel</button>
                            </form>
                        </div>
                    </div>
                )}
             {alert && <CustomAlert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}

            </div>
        </div>
    );
}

export default App;
