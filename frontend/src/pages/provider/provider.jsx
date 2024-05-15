import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BsSearch } from "react-icons/bs";
import './Appprovider.css'; // Correction de la typo dans le nom du fichier CSS
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

    const [providers, setProviders] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        description: '',
        number: '',
        comment: '',
        IsActive: true // Nouvelle propriété IsActive avec valeur par défaut true
    });
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editProviderId, setEditProviderId] = useState('');
    const [selectedProvider, setSelectedProvider] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showActiveOnly, setShowActiveOnly] = useState(true); // Ajout de l'état pour filtrer les fournisseurs actifs
    const [alert, setAlert] = useState(null); // Ajout de l'état pour l'alerte

    const providersPerPage = 8; // Nombre de fournisseurs à afficher par page

    useEffect(() => {
        fetchProviders();
    }, []);

    const fetchProviders = async () => {
        try {
            const response = await axios.get('http://localhost:8080/providers');
            setProviders(response.data.data);
        } catch (error) {
            console.error('Error:', error);
            showAlert('Une erreur sest produite lors de la récupération des fournisseurs. Veuillez réessayer plus tard');
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
        if (!formData.name || !formData.address || !formData.description || !formData.number) {
            showAlert('Veuillez remplir tous les champs requis');
            return;
        }
        try {
            const response = await axios.post('http://localhost:8080/providers', formData);
            if (response.status === 201) {
                showAlert('Fournisseur ajouté avec succès');
                fetchProviders();
                resetFormData();
                setShowCreateForm(false);
            } else {
                showAlert(response.data.message || 'Une erreur sest produite');
            }
        } catch (error) {
            console.error('Error:', error);
            if (error.response) {
                showAlert(error.response.data.message || 'Une erreur sest produite');
            } else {
                showAlert('Une erreur sest produite. Veuillez réessayer plus tard');
            }
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:8080/providers/${id}`);
            if (response.status === 200) {
                showAlert('Fournisseur supprimé avec succès');
                fetchProviders();
            } else {
                showAlert(response.data.message || 'Une erreur sest produite lors de la suppression du fournisseur');
            }
        } catch (error) {
            console.error('Error:', error);
            showAlert('Une erreur sest produite. Veuillez réessayer plus tard');
        }
    };

    const toggleActiveStatus = async (id, isActive) => {
        try {
            const response = await axios.put(`http://localhost:8080/providers/${id}`, { IsActive: !isActive });
            if (response.status === 200) {
                showAlert(`Fournisseur  ${isActive ? 'desactivé' : 'activé'} avec succès`);
                fetchProviders();
            } else {
                showAlert(response.data.message || 'Une erreur sest produite lors de la mise à jour du statut du fournisseur');
            }
        } catch (error) {
            console.error('Error:', error);
            showAlert('Une erreur sest produite. Veuillez réessayer plus tard');
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
                showAlert('Fournisseur mis à jour avec succès');
                fetchProviders();
                setEditProviderId('');
                resetFormData();
                setShowCreateForm(false);
            } else {
                showAlert(response.data.message || 'Une erreur sest produite lors de la mise à jour du fournisseur');
            }
        } catch (error) {
            console.error('Error:', error);
            showAlert('Une erreur sest produite. Veuillez réessayer plus tard');
        }
    };

    const resetFormData = () => {
        setFormData({
            name: '',
            address: '',
            description: '',
            number: '',
            comment: '',
            IsActive: true // Réinitialisation de IsActive à true
        });
    };

    const filterProviders = (providers, searchText) => {
        let filteredProviders = providers.filter(provider => {
            return (
                provider.name.toLowerCase().includes(searchText.toLowerCase()) ||
                provider.address.toLowerCase().includes(searchText.toLowerCase()) ||
                provider.description.toLowerCase().includes(searchText.toLowerCase()) ||
                provider.number.toString().includes(searchText.toLowerCase())
            );
        });

        if (showActiveOnly) {
            filteredProviders = filteredProviders.filter(provider => provider.IsActive);
        }

        const indexOfLastProvider = currentPage * providersPerPage;
        const indexOfFirstProvider = indexOfLastProvider - providersPerPage;
        return filteredProviders.slice(indexOfFirstProvider, indexOfLastProvider);
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
                <h1 className="title-all">Fournisseurs</h1>
                <div className="actions">
                    
                    <div className='search-cont'>
                    <BsSearch className='search-icon'/>
                        <input className='search-bar'
                        type="text"
                        placeholder="Chercher un fournisseur"
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

                    <button className="create-button" onClick={() => setShowCreateForm(true)}>Create</button> 
                </div>

                {showCreateForm && (
                    <div className="popup">
                        <div className="popup-content">
                            <span className="close-button" onClick={() => setShowCreateForm(false)}>&times;</span>
                            <h2>Créer un nouveau fournisseur</h2>
                            <form onSubmit={handleSubmit}>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
                                <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" />
                                <input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="Description" />
                                <input type="text" name="number" value={formData.number} onChange={handleChange} placeholder="Number" />
                                <input type="text" name="comment" value={formData.comment} onChange={handleChange} placeholder="Comment" />
                                <button className="create-button" type="submit">Save</button>
                                <button className='delete-button' onClick={() => setShowCreateForm(false)}>Cancel</button>
                            </form>
                        </div>
                    </div>
                )}
                {filterProviders(providers, searchText).length > 0 && (
                    <>
                        <table className="mfwork">
                            <thead>
                                <tr>
                                    <th>Nom</th>
                                    <th>Adresse</th>
                                    <th>Description</th>
                                    <th>Numéro</th>
                                    <th>Actif</th> {/* Ajout de la colonne "Active" */}
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filterProviders(providers, searchText).map(provider => (
                                    <tr key={provider._id}>
                                        <td>{provider.name}</td>
                                        <td>{provider.address}</td>
                                        <td>{provider.description}</td>
                                        <td>{provider.number}</td>
                                        <td>{provider.IsActive ? 'Yes' : 'No'}</td> {/* Affichage de la propriété IsActive */}
                                        <td>
                                            <button className='view-button' onClick={() => handleView(provider)}>View</button>
                                            <button className='edit-button' onClick={() => handleEdit(provider)}>Edit</button>
                                            <button className='delete-button' onClick={() => toggleActiveStatus(provider._id, provider.IsActive)}>{provider.IsActive ? 'Disable' : 'Enable'}</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="pagination">
                            <button className='next-prev-btn' disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Précédent</button>
                            <span>{currentPage}</span>
                            <button className='next-prev-btn' disabled={currentPage === Math.ceil(providers.length / providersPerPage)} onClick={() => setCurrentPage(currentPage + 1)}>Suivant</button>
                        </div>
                    </>
                )}
                {filterProviders(providers, searchText).length === 0 && (
                    <p>Aucun fournisseur trouvé</p>
                )}
                {selectedProvider && (
                    <div className="popup">
                        <div className="popup-content">
                            <span className="close-button" onClick={() => setSelectedProvider(null)}>&times;</span>
                            <h2>Détails du fournisseur</h2>
                            <p>Nom : {selectedProvider.name}</p>
                            <p>Adresse : {selectedProvider.address}</p>
                            <p>Description : {selectedProvider.description}</p>
                            <p>Numéro : {selectedProvider.number}</p>
                            <button className='delete-button' onClick={() => setSelectedProvider(null)}>Cancel</button>
                        </div>
                    </div>
                )}
                {editProviderId && (
                    <div className="popup">
                        <div className="popup-content">
                            <span className="close-button" onClick={() => { setEditProviderId(''); resetFormData(); setShowCreateForm(false); }}>&times;</span>
                            <h2>Modifier le fournisseur</h2>
                            <form onSubmit={handleEditSubmit}>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nom" />
                                <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Adresse" />
                                <input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="Description" />
                                <input type="text" name="number" value={formData.number} onChange={handleChange} placeholder="Numéro" />
                                <input type="text" name="comment" value={formData.comment} onChange={handleChange} placeholder="Comment" />
                                <button className="create-button" type="submit">Save</button>
                                <button className='delete-button' onClick={() => { setEditProviderId(''); resetFormData(); setShowCreateForm(false); }}>Cancel</button>
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
