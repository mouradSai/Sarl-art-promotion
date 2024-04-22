import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AppCostomer.css';
import Sidebar from '../Main/Sidebar';
import Header from '../Main/Header';

function App() {
    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.reload();
    };

    const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

    const OpenSidebar = () => {
        setOpenSidebarToggle(!openSidebarToggle);
    };

    const handleSidebarItemClick = (content) => {
        setSelectedContent(content); // Mettre à jour le contenu sélectionné
    };

    const [clients, setClients] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        prenom: '',
        description: '',
        address: '',
        phoneNumber: ''
    });
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editClientId, setEditClientId] = useState('');
    const [selectedClient, setSelectedClient] = useState(null);

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

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        // Vérification que tous les champs obligatoires sont remplis
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
            phoneNumber: ''
        });
    };

    const showAlert = (message) => {
        alert(message);
    };

    return (
        <div className="grid-container">
    <Header OpenSidebar={OpenSidebar}/>
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} handleItemClick={handleSidebarItemClick}/>
      {/* Ajoute ici le contenu  */}
            {/* Ajoute ici le contenu  */}

            <div className="container">
                <h1>Clients</h1>
                <div className="actions">
                    <button className="create-button" onClick={() => setShowCreateForm(true)}>Create</button>
                </div>
                {showCreateForm && (
                    <div className="popup">
                        <div className="popup-content">
                            <span className="close-button" onClick={() => setShowCreateForm(false)}>&times;</span>
                            <h2>Create New Client</h2>
                            <form onSubmit={handleSubmit}>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
                                <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} placeholder="Prenom" />
                                <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" />
                                <input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="Description" />
                                <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Phone Number" />
                                <button className="create-button" type="submit">Save</button>
                                <button className='delet-button' onClick={() => setShowCreateForm(false)}>Cancel</button>
                            </form>
                        </div>
                    </div>
                )}
                {clients.length > 0 && (
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Prenom</th>
                                <th>Address</th>
                                <th>Description</th>
                                <th>Phone Number</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clients.map(client => (
                                <tr key={client._id}>
                                    <td>{client.name}</td>
                                    <td>{client.prenom}</td>
                                    <td>{client.address}</td>
                                    <td>{client.description}</td>
                                    <td>{client.phoneNumber}</td>
                                    <td>
                                        <button className='view-button' onClick={() => handleView(client)}>View</button>
                                        <button className='edit-button' onClick={() => handleEdit(client)}>Edit</button>
                                        <button className='delet-button' onClick={() => handleDelete(client._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                {selectedClient && (
                    <div className="popup">
                        <div className="popup-content">
                            <span className="close-button" onClick={() => setSelectedClient(null)}>&times;</span>
                            <h2>Client Details</h2>
                            <p>Name: {selectedClient.name}</p>
                            <p>Prenom: {selectedClient.prenom}</p>
                            <p>Address: {selectedClient.address}</p>
                            <p>Description: {selectedClient.description}</p>
                            <p>Phone Number: {selectedClient.phoneNumber}</p>
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

            </div>
        </div>
    );
}

export default App;
