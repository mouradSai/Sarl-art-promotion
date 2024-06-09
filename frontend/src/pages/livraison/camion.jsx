import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BsSearch } from "react-icons/bs";
import Sidebar from './sidebar';
import Header from '../../components/Main/Header';
import CustomAlert from '../../components/costumeAlert/costumeAlert'; // Import du composant CustomAlert

function App() {
    const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
    const [camions, setCamions] = useState([]);
    const [chauffeurs, setChauffeurs] = useState([]); // Initialiser comme un tableau vide
    const [formData, setFormData] = useState({
        numero_plaque: '',
        capacite: '',
        chauffeur_nom: '' // Ajouter le champ chauffeur_nom
    });
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editCamionId, setEditCamionId] = useState('');
    const [selectedCamion, setSelectedCamion] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showActiveOnly, setShowActiveOnly] = useState(true);
    const [alert, setAlert] = useState(null);

    const camionsPerPage = 8; // Nombre de camions à afficher par page

    useEffect(() => {
        fetchCamions();
        fetchChauffeurs(); // Ajouter l'appel à fetchChauffeurs
    }, []);

    const fetchCamions = async () => {
        try {
            const response = await axios.get('http://localhost:8080/camions');
            setCamions(response.data.data.reverse());
        } catch (error) {
            console.error('Error:', error);
            showAlert('Une erreur s\'est produite lors de la récupération des camions. Veuillez réessayer plus tard');
        }
    };

    const fetchChauffeurs = async () => {
        try {
            const response = await axios.get('http://localhost:8080/chauffeur'); // URL pour récupérer les chauffeurs
            console.log('Chauffeurs response:', response.data); // Débogage
            if (Array.isArray(response.data.data)) {
                setChauffeurs(response.data.data);
            } else {
                console.error('Les données des chauffeurs ne sont pas un tableau:', response.data);
                setChauffeurs([]);
            }
        } catch (error) {
            console.error('Error:', error);
            showAlert('Une erreur s\'est produite lors de la récupération des chauffeurs. Veuillez réessayer plus tard');
        }
    };

    const showAlert = (message, type) => {
        setAlert({ message, type });
        setTimeout(() => {
            setAlert(null);
        }, 5000);
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
        if (!formData.numero_plaque || !formData.capacite || !formData.chauffeur_nom) {
            showAlert('Veuillez remplir tous les champs requis');
            return;
        }
        try {
            const response = await axios.post('http://localhost:8080/camions', formData);
            if (response.status === 201) {
                showAlert('Camion ajouté avec succès');
                fetchCamions();
                resetFormData();
                setShowCreateForm(false);
            } else {
                showAlert(response.data.message || 'Une erreur s\'est produite');
            }
        } catch (error) {
            console.error('Error:', error);
            if (error.response) {
                showAlert(error.response.data.message || 'Une erreur s\'est produite');
            } else {
                showAlert('Une erreur s\'est produite. Veuillez réessayer plus tard');
            }
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:8080/camions/${id}`);
            if (response.status === 200) {
                showAlert('Camion supprimé avec succès');
                fetchCamions();
            } else {
                showAlert(response.data.message || 'Une erreur s\'est produite lors de la suppression du camion');
            }
        } catch (error) {
            console.error('Error:', error);
            showAlert('Une erreur s\'est produite. Veuillez réessayer plus tard');
        }
    };

    const handleEdit = (camion) => {
        setEditCamionId(camion._id);
        setFormData({ 
            numero_plaque: camion.numero_plaque, 
            capacite: camion.capacite,
            chauffeur_nom: camion.chauffeur ? camion.chauffeur.nom : '' // Ajouter le nom du chauffeur au formulaire de modification
        });
        setShowCreateForm(true);
    };

    const handleView = (camion) => {
        setSelectedCamion(camion);
    };

    const handleEditSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.put(`http://localhost:8080/camions/${editCamionId}`, formData);
            if (response.status && response.status === 200) {
                showAlert('Camion mis à jour avec succès');
                fetchCamions();
                setEditCamionId('');
                resetFormData();
                setShowCreateForm(false);
            } else {
                showAlert(response.data.message || 'Une erreur s\'est produite lors de la mise à jour du camion');
            }
        } catch (error) {
            console.error('Error:', error);
            showAlert('Une erreur s\'est produite. Veuillez réessayer plus tard');
        }
    };

    const resetFormData = () => {
        setFormData({
            numero_plaque: '',
            capacite: '',
            chauffeur_nom: '' // Réinitialiser le nom du chauffeur
        });
    };

    const toggleActiveStatus = async (id, isActive) => {
        try {
            const response = await axios.put(`http://localhost:8080/camions/${id}/active`, { isActive: !isActive });
            if (response.status === 200) {
                showAlert(`Camion ${isActive ? 'désactivé' : 'activé'} avec succès.`);
                fetchCamions();
            } else {
                showAlert(response.data.message || 'Une erreur s\'est produite lors de la mise à jour de l\'état du camion.');
            }
        } catch (error) {
            console.error('Erreur:', error);
            showAlert('Une erreur s\'est produite. Veuillez réessayer plus tard.');
        }
    };

    const filterCamions = (camions, searchText) => {
        let filteredCamions = camions.filter(camion => {
            return (
                camion.numero_plaque.toLowerCase().includes(searchText.toLowerCase()) ||
                camion.capacite.toString().includes(searchText.toLowerCase()) ||
                (camion.chauffeur && camion.chauffeur.nom.toLowerCase().includes(searchText.toLowerCase()))
            );
        });

        if (showActiveOnly) {
            filteredCamions = filteredCamions.filter(camion => camion.isActive);
        }

        const indexOfLastCamion = currentPage * camionsPerPage;
        const indexOfFirstCamion = indexOfLastCamion - camionsPerPage;
        return filteredCamions.slice(indexOfFirstCamion, indexOfLastCamion);
    };

    const handleSearchChange = (event) => {
        setSearchText(event.target.value);
    };

    const handleFilterChange = () => {
        setShowActiveOnly(!showActiveOnly);
    };

    return (
        <div className="grid-container">
            <Header OpenSidebar={() => setOpenSidebarToggle(!openSidebarToggle)} />
            <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={() => setOpenSidebarToggle(!openSidebarToggle)} />
            <div className="container">
                <h1 className="title-all">Camions</h1>
                <div className="actions">
                    <div className='search-cont'>
                        <input className='search-bar'
                            type="text"
                            placeholder="Chercher un camion"
                            value={searchText}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <label>
                        <input
                            type="checkbox"
                            className="checkbox-custom"
                            checked={showActiveOnly}
                            onChange={handleFilterChange}
                        />
                        <span className="checkbox-label">Actifs seulement</span>
                    </label>
                    <button className="print-button" onClick={() => setShowCreateForm(true)}>Créer</button>
                </div>

                {showCreateForm && (
                    <div className="popup">
                        <div className="popup-content">
                            <span className="close-button" onClick={() => setShowCreateForm(false)}>&times;</span>
                            <h2>{editCamionId ? 'Modifier le camion' : 'Créer un nouveau camion'}</h2>
                            <form onSubmit={editCamionId ? handleEditSubmit : handleSubmit}>
                                <input type="text" name="numero_plaque" value={formData.numero_plaque} onChange={handleChange} placeholder="Numéro de plaque" />
                                <input type="text" name="capacite" value={formData.capacite} onChange={handleChange} placeholder="Capacité" />
                                <select name="chauffeur_nom" value={formData.chauffeur_nom} onChange={handleChange}>
                                    <option value="">Sélectionner un chauffeur</option>
                                    {chauffeurs.map((chauffeur) => (
                                        <option key={chauffeur._id} value={chauffeur.nom}>{chauffeur.nom}</option>
                                    ))}
                                </select>
                                <button className="print-button" type="submit">Sauvegarder</button>
                                <button className='delete-button' onClick={() => setShowCreateForm(false)}>Annuler</button>
                            </form>
                        </div>
                    </div>
                )}

                {filterCamions(camions, searchText).length > 0 && (
                    <>
                        <table className="tabrespo">
                            <thead>
                                <tr>
                                    <th>Numéro de plaque</th>
                                    <th>Capacité</th>
                                    <th>Chauffeur</th> {/* Ajouter une colonne pour le chauffeur */}
                                    <th>Active</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filterCamions(camions, searchText).map(camion => (
                                    <tr key={camion._id}>
                                        <td>{camion.numero_plaque}</td>
                                        <td>{camion.capacite}</td>
                                        <td>{camion.chauffeur ? camion.chauffeur.nom : 'N/A'}</td> {/* Afficher le nom du chauffeur */}
                                        <td>{camion.isActive ? 'Yes' : 'No'}</td>
                                        <td>
                                            <button className='view-button' onClick={() => handleView(camion)}>Voir</button>
                                            <button className='edit-button' onClick={() => handleEdit(camion)}>Modifier</button>
                                            <button className='delete-button' onClick={() => toggleActiveStatus(camion._id, camion.isActive)}>{camion.isActive ? 'Désactiver' : 'Activer'}</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="pagination">
                            <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Précédent</button>
                            <span>{currentPage}</span>
                            <button disabled={currentPage === Math.ceil(camions.length / camionsPerPage)} onClick={() => setCurrentPage(currentPage + 1)}>Suivant</button>
                        </div>
                    </>
                )}
                {filterCamions(camions, searchText).length === 0 && (
                    <p>Aucun camion trouvé</p>
                )}
                {selectedCamion && (
                    <div className="popup">
                        <div className="popup-content">
                            <span className="close-button" onClick={() => setSelectedCamion(null)}>&times;</span>
                            <h2>Détails du camion</h2>
                            <p>Numéro de plaque : {selectedCamion.numero_plaque}</p>
                            <p>Capacité : {selectedCamion.capacite}</p>
                            <p>Chauffeur : {selectedCamion.chauffeur ? selectedCamion.chauffeur.nom : 'N/A'}</p> {/* Afficher le nom du chauffeur */}
                            <button className='delete-button' onClick={() => setSelectedCamion(null)}>Annuler</button>
                        </div>
                    </div>
                )}
                {alert && <CustomAlert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
            </div>
        </div>
    );
}

export default App;
