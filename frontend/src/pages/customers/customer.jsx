import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AppCostomer.css'; // Correction de la typo dans le nom du fichier CSS
import Sidebar from '../../components/Main/Sidebar';
import Header from '../../components/Main/Header';
import CustomAlert from '../../components/costumeAlert/costumeAlert'; // Import du composant CustomAlert

function App() {
    const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

    const OpenSidebar = () => {
        setOpenSidebarToggle(!openSidebarToggle);
    };

    const handleSidebarItemClick = (content) => {
        setSelectedContent(content); // Correction: la variable "selectedContent" n'est pas définie
    };

    const [clients, setClients] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        prenom: '',
        description: '',
        address: '',
        phoneNumber: '',
        IsActive: true // Nouvelle propriété IsActive avec valeur par défaut true
    });
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editClientId, setEditClientId] = useState('');
    const [selectedClient, setSelectedClient] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showActiveOnly, setShowActiveOnly] = useState(true); // Ajout de l'état pour filtrer les clients actifs
    const [alert, setAlert] = useState(null); // Ajout de l'état pour l'alerte

    const clientsPerPage = 8; // Nombre de clients à afficher par page

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const response = await axios.get('http://localhost:8080/clients');
            setClients(response.data.data);
        } catch (error) {
            console.error('Error:', error);
            showAlert('An error occurred while fetching clients. Please try again later.');
        }
    };
    
    const showAlert = (message, type) => {
        setAlert({ message, type });
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
        if (!formData.name || !formData.prenom || !formData.address || !formData.phoneNumber) {
            showAlert('Please fill in all required fields.');
            return;
        }
        try {
            const response = await axios.post('http://localhost:8080/clients', formData);
            if (response.status === 201) {
                showAlert('Client added successfully.');
                fetchClients();
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
            const response = await axios.delete(`http://localhost:8080/clients/${id}`);
            if (response.status === 200) {
                showAlert('Client deleted successfully.');
                fetchClients();
            } else {
                showAlert(response.data.message || 'An error occurred while deleting client.');
            }
        } catch (error) {
            console.error('Error:', error);
            showAlert('An error occurred. Please try again later.');
        }
    };

    const toggleActiveStatus = async (id, isActive) => {
        try {
            const response = await axios.put(`http://localhost:8080/clients/${id}`, { IsActive: !isActive });
            if (response.status === 200) {
                showAlert(`Client ${isActive ? 'deactivated' : 'activated'} successfully.`);
                fetchClients();
            } else {
                showAlert(response.data.message || 'An error occurred while updating client status.');
            }
        } catch (error) {
            console.error('Error:', error);
            showAlert('An error occurred. Please try again later.');
        }
    };

    const handleEdit = (client) => {
        setEditClientId(client._id);
        setFormData({ ...client });
        setShowCreateForm(true);
    };

    const handleView = (client) => {
        setSelectedClient(client);
    };

    const handleEditSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.put(`http://localhost:8080/clients/${editClientId}`, formData);
            if (response.status && response.status === 200) {
                showAlert('Client updated successfully.');
                fetchClients();
                setEditClientId('');
                resetFormData();
                setShowCreateForm(false);
            } else {
                showAlert(response.data.message || 'An error occurred while updating client.');
            }
        } catch (error) {
            console.error('Error:', error);
            showAlert('An error occurred. Please try again later.');
        }
    };

    const resetFormData = () => {
        setFormData({
            name: '',
            prenom: '',
            description: '',
            address: '',
            phoneNumber: '',
            IsActive: true // Réinitialisation de IsActive à true
        });
    };

    const filterClients = (clients, searchText) => {
        let filteredClients = clients.filter(client => {
            return (
                client.name.toLowerCase().includes(searchText.toLowerCase()) ||
                client.prenom.toLowerCase().includes(searchText.toLowerCase()) ||
                client.address.toLowerCase().includes(searchText.toLowerCase()) ||
                client.phoneNumber.toLowerCase().includes(searchText.toLowerCase())
            );
        });

        if (showActiveOnly) {
            filteredClients = filteredClients.filter(client => client.IsActive);
        }

        const indexOfLastClient = currentPage * clientsPerPage;
        const indexOfFirstClient = indexOfLastClient - clientsPerPage;
        return filteredClients.slice(indexOfFirstClient, indexOfLastClient);
    };

    const handleSearchChange = (event) => {
        setSearchText(event.target.value);
    };

    const handleFilterChange = () => {
        setShowActiveOnly(!showActiveOnly);
    };

    return (
        <div className="grid-container">
            <Header OpenSidebar={OpenSidebar}/>
            <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} handleItemClick={handleSidebarItemClick}/>
            <div className="container">
                <h1 className="title-all">Clients</h1>
                <div className="actions">
                    <input
                        type="text"
                        placeholder="Search customers..."
                        value={searchText}
                        onChange={handleSearchChange}
                    />
                    <label>
                        <input
                            type="checkbox"
                            checked={showActiveOnly}
                            onChange={handleFilterChange}
                        />
                        Show Active Only
                    </label>
                    <button className="create-button" onClick={() => setShowCreateForm(true)}>Create</button>
                </div>
                {showCreateForm && (
                    <div className="popup">
                        <div className="popup-content">
                            <span className="close-button" onClick={() => setShowCreateForm(false)}>&times;</span>
                            <h2>Create New Client</h2>
                            <form onSubmit={handleSubmit}>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nom" />
                                <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} placeholder="Prenom" />
                                <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Adresse" />
                                <input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="Description" />
                                <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Numero" />
                                <button className="create-button" type="submit">Save</button>
                                <button className='delet-button' onClick={() => setShowCreateForm(false)}>Cancel</button>
                            </form>
                        </div>
                    </div>
                )}
                {filterClients(clients, searchText).length > 0 && (
                    <>
                        <table>
                            <thead>
                                <tr>
                                    <th>Nom</th>
                                    <th>Prenom</th>
                                    <th>Adresse</th>
                                    <th>Description</th>
                                    <th>Num Tel</th>
                                    <th>Active</th> {/* Ajout de la colonne "Active" */}
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filterClients(clients, searchText).map(client => (
                                    <tr key={client._id}>
                                        <td>{client.name}</td>
                                        <td>{client.prenom}</td>
                                        <td>{client.address}</td>
                                        <td>{client.description}</td>
                                        <td>{client.phoneNumber}</td>
                                        <td>{client.IsActive ? 'Yes' : 'No'}</td> {/* Affichage de la propriété IsActive */}
                                        <td>
                                            <button className='view-button' onClick={() => handleView(client)}>Détails</button>
                                            <button className='edit-button' onClick={() => handleEdit(client)}>Modifier</button>
                                            <button className='delete-button' onClick={() => toggleActiveStatus(client._id, client.IsActive)}>{client.IsActive ? 'Désactiver' : 'Activer'}</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="pagination">
                            <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>&lt; Précédent</button>
                            <span>{currentPage}</span>
                            <button disabled={currentPage === Math.ceil(clients.length / clientsPerPage)} onClick={() => setCurrentPage(currentPage + 1)}>Suivant &gt;</button>
                        </div>
                    </>
                )}
                {filterClients(clients, searchText).length === 0 && (
                    <p>Aucun client trouver.</p>
                )}
                {selectedClient && (
                    <div className="popup">
                        <div className="popup-content">
                            <span className="close-button" onClick={() => setSelectedClient(null)}>&times;</span>
                            <h2>Client Details</h2>
                            <p>Nom: {selectedClient.name}</p>
                            <p>Prenom: {selectedClient.prenom}</p>
                            <p>Adresse: {selectedClient.address}</p>
                            <p>Description: {selectedClient.description}</p>
                            {selectedClient.phoneNumber.length >= 10 ? (
                                <p>Numéro: {selectedClient.phoneNumber}</p>
                            ) : (
                                <p>Numéro de téléphone invalide</p>
                            )}
                            <button className='delet-button' onClick={() => setSelectedClient(null)}>Cancel</button>
                        </div>
                    </div>
                )}
                {editClientId && (
                    <div className="popup">
                        <div className="popup-content">
                            <span className="close-button" onClick={() => { setEditClientId(''); resetFormData(); setShowCreateForm(false); }}>&times;</span>
                            <h2>Edit Client</h2>
                            <form onSubmit={handleEditSubmit}>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
                                <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} placeholder="Prenom" />
                                <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" />
                                <input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="Description" />
                                <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Phone Number" />
                                <button className="create-button" type="submit">Save</button>
                                <button className='delet-button' onClick={() => { setEditClientId(''); resetFormData(); setShowCreateForm(false); }}>Cancel</button>
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
