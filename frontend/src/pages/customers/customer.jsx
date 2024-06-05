import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
            setClients(response.data.data.reverse());
        } catch (error) {
            console.error('Erreur:', error);
            showAlert('Une erreur s est produite lors de la récupération des clients. Veuillez réessayer plus tard.');
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
            showAlert('Veuillez remplir tous les champs requis.');
            return;
        }
        try {
            const response = await axios.post('http://localhost:8080/clients', formData);
            if (response.status === 201) {
                showAlert('Client ajouté avec succès.');
                fetchClients();
                resetFormData();
                setShowCreateForm(false);
            } else {
                showAlert(response.data.message || 'Une erreur s est produite.');
            }
        } catch (error) {
            console.error('Error:', error);
            if (error.response) {
                showAlert(error.response.data.message || 'Une erreur s est produite.');
            } else {
                showAlert('Une erreur s est produite. Veuillez réessayer plus tard.');
            }
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:8080/clients/${id}`);
            if (response.status === 200) {
                showAlert('Client supprimé avec succès.');
                fetchClients();
            } else {
                showAlert(response.data.message || 'Une erreur s est produite lors de la suppression du client.');
            }
        } catch (error) {
            console.error('Erreur:', error);
            showAlert('Une erreur s est produite. Veuillez réessayer plus tard.');
        }
    };

    const toggleActiveStatus = async (id, isActive) => {
        try {
            const response = await axios.put(`http://localhost:8080/clients/${id}`, { IsActive: !isActive });
            if (response.status === 200) {
                showAlert(`Client ${isActive ? 'Désactiver' : 'Activer'} avec succès.`);
                fetchClients();
            } else {
                showAlert(response.data.message || 'Une erreur s est produite lors de la mise à jour du statut du client.');
            }
        } catch (error) {
            console.error('Erreur:', error);
            showAlert('Une erreur s est produite. Veuillez réessayer plus tard.');
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
                showAlert('Client mis à jour avec succès.');
                fetchClients();
                setEditClientId('');
                resetFormData();
                setShowCreateForm(false);
            } else {
                showAlert(response.data.message || 'Une erreur s est produite lors de la mise à jour du client.');
            }
        } catch (error) {
            console.error('Erreur:', error);
            showAlert('Une erreur s est produite. Veuillez réessayer plus tard.');
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

                <div className='search-cont'>
                    <h1 className='search-icon'/>
                        <input className='search-bar'
                        type="text"
                        placeholder="Chercher un client"
                        value={searchText}
                        onChange={handleSearchChange}
                        />
                    </div>

                    <label>
                        <input
                            type="checkbox"
                            class="checkbox-custom"
                            checked={showActiveOnly}
                            onChange={handleFilterChange}
                        />
                        <span class="checkbox-label">Actifs seulement</span>
                    </label>

                    <button className="print-button" onClick={() => setShowCreateForm(true)}>Créer</button>
                </div>
                {showCreateForm && (
                    <>
                    <div className="overlay"></div>
                    <div className="popup">
                        <div className="popup-content">
                            <span className="close-button" onClick={() => setShowCreateForm(false)}>&times;</span>
                            <h2>Créer un nouveau client</h2>
                            <form onSubmit={handleSubmit}>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nom" />
                                <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} placeholder="Prenom" />
                                <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Adresse" />
                                <input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="Description" />
                                <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} maxLength={10} placeholder="Numéro" />
                                <button className="print-button" type="submit">Sauvgarder</button>
                                <button className='delete-button' onClick={() => setShowCreateForm(false)}>Annuler</button>
                            </form>
                        </div>
                    </div>
                    </>
                )}
                {filterClients(clients, searchText).length > 0 && (
                    <>
                        <table className='tabrespo'>
                            <thead>
                                <tr>
                                    <th>Nom</th>
                                    <th>Prénom</th>
                                    <th>Adresse</th>
                                    <th>Description</th>
                                    <th>Numéro</th>
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
                            <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Précédent</button>
                            <span>{currentPage}</span>
                            <button disabled={currentPage === Math.ceil(clients.length / clientsPerPage)} onClick={() => setCurrentPage(currentPage + 1)}>Suivant</button>
                        </div>
                    </>
                )}
                {filterClients(clients, searchText).length === 0 && (
                    <p>Aucun client trouver.</p>
                )}
                {selectedClient && (
                    <>
                    <div className="overlay"></div>
                    <div className="popup">
                        <div className="popup-content">
                            <span className="close-button" onClick={() => setSelectedClient(null)}>&times;</span>
                            <h2>Client Details</h2>
                            <p>Nom: {selectedClient.name}</p>
                            <p>Prénom: {selectedClient.prenom}</p>
                            <p>Adresse: {selectedClient.address}</p>
                            <p>Description: {selectedClient.description}</p>
                            {selectedClient.phoneNumber.length >= 10 ? (
                                <p>Numéro: {selectedClient.phoneNumber}</p>
                            ) : (
                                <p>Numéro de téléphone invalide</p>
                            )}
                            <button className='delete-button' onClick={() => setSelectedClient(null)}>Annuler</button>
                        </div>
                    </div>
                    </>
                )}
                {editClientId && (
                     <>
                    <div className="overlay"></div>
                    <div className="popup">
                        <div className="popup-content">
                            <span className="close-button" onClick={() => { setEditClientId(''); resetFormData(); setShowCreateForm(false); }}>&times;</span>
                            <h2>Modifier le client</h2>
                            <form onSubmit={handleEditSubmit}>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nom" />
                                <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} placeholder="Prénom" />
                                <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" />
                                <input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="Description" />
                                <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Numéro" />
                                <button className="print-button" type="submit">Sauvgarder</button>
                                <button className='delete-button' onClick={() => { setEditClientId(''); resetFormData(); setShowCreateForm(false); }}>Annuler</button>
                            </form>
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
