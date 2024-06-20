import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BsSearch } from "react-icons/bs";
import Sidebar from './sidebar';
import Header from '../../components/Main/Header';
import CustomAlert from '../../components/costumeAlert/costumeAlert'; // Import du composant CustomAlert

function App() {
    const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
    const [chauffeurs, setChauffeurs] = useState([]);
    const [formData, setFormData] = useState({
        nom: '',
        telephone: '',
        email: ''
    });
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editChauffeurId, setEditChauffeurId] = useState('');
    const [selectedChauffeur, setSelectedChauffeur] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showActiveOnly, setShowActiveOnly] = useState(true);
    const [alert, setAlert] = useState(null);

    const chauffeursPerPage = 8; // Nombre de chauffeurs à afficher par page

    useEffect(() => {
        fetchChauffeurs();
    }, []);

    const fetchChauffeurs = async () => {
        try {
            const response = await axios.get('http://localhost:8080/chauffeur');
            setChauffeurs(response.data.data.reverse());
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
        if (!formData.nom || !formData.telephone || !formData.email) {
            showAlert('Veuillez remplir tous les champs requis');
            return;
        }
        try {
            const response = await axios.post('http://localhost:8080/chauffeur', formData);
            if (response.status === 201) {
                showAlert('Chauffeur ajouté avec succès');
                fetchChauffeurs();
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
            const response = await axios.delete(`http://localhost:8080/chauffeur/${id}`);
            if (response.status === 200) {
                showAlert('Chauffeur supprimé avec succès');
                fetchChauffeurs();
            } else {
                showAlert(response.data.message || 'Une erreur s\'est produite lors de la suppression du chauffeur');
            }
        } catch (error) {
            console.error('Error:', error);
            showAlert('Une erreur s\'est produite. Veuillez réessayer plus tard');
        }
    };

    const handleEdit = (chauffeur) => {
        setEditChauffeurId(chauffeur._id);
        setFormData({ nom: chauffeur.nom, telephone: chauffeur.telephone, email: chauffeur.email });
        setShowCreateForm(true);
    };

    const handleView = (chauffeur) => {
        setSelectedChauffeur(chauffeur);
    };

    const handleEditSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.put(`http://localhost:8080/chauffeur/${editChauffeurId}`, formData);
            if (response.status && response.status === 200) {
                showAlert('Chauffeur mis à jour avec succès');
                fetchChauffeurs();
                setEditChauffeurId('');
                resetFormData();
                setShowCreateForm(false);
            } else {
                showAlert(response.data.message || 'Une erreur s\'est produite lors de la mise à jour du chauffeur');
            }
        } catch (error) {
            console.error('Error:', error);
            showAlert('Une erreur s\'est produite. Veuillez réessayer plus tard');
        }
    };

    const resetFormData = () => {
        setFormData({
            nom: '',
            telephone: '',
            email: ''
        });
    };

    const toggleActiveStatus = async (id, isActive) => {
        try {
            const response = await axios.put(`http://localhost:8080/chauffeur/${id}/active`, { isActive: !isActive });
            if (response.status === 200) {
                showAlert(`Chauffeur ${isActive ? 'désactivé' : 'activé'} avec succès.`);
                fetchChauffeurs();
            } else {
                showAlert(response.data.message || 'Une erreur s\'est produite lors de la mise à jour de l\'état du chauffeur.');
            }
        } catch (error) {
            console.error('Erreur:', error);
            showAlert('Une erreur s\'est produite. Veuillez réessayer plus tard.');
        }
    };

    const filterChauffeurs = (chauffeurs, searchText) => {
        let filteredChauffeurs = chauffeurs.filter(chauffeur => {
            return (
                chauffeur.nom.toLowerCase().includes(searchText.toLowerCase()) ||
                chauffeur.telephone.toLowerCase().includes(searchText.toLowerCase()) ||
                chauffeur.email.toLowerCase().includes(searchText.toLowerCase())
            );
        });

        if (showActiveOnly) {
            filteredChauffeurs = filteredChauffeurs.filter(chauffeur => chauffeur.isActive);
        }

        const indexOfLastChauffeur = currentPage * chauffeursPerPage;
        const indexOfFirstChauffeur = indexOfLastChauffeur - chauffeursPerPage;
        return filteredChauffeurs.slice(indexOfFirstChauffeur, indexOfLastChauffeur);
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
                <h1 className="title-all">Chauffeurs</h1>
                <div className="actions">
                    <div className='search-cont'>
                        <input className='search-bar'
                            type="text"
                            placeholder="Chercher un chauffeur"
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
                            <h2>Créer un nouveau chauffeur</h2>
                            <form onSubmit={handleSubmit}>
                                <input type="text" name="nom" value={formData.nom} onChange={handleChange} placeholder="Nom" />
                                <input type="text" name="telephone" value={formData.telephone} onChange={handleChange} placeholder="Téléphone" />
                                <input type="text" name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
                                <button className="print-button" type="submit">Sauvegarder</button>
                                <button className='delete-button' onClick={() => setShowCreateForm(false)}>Annuler</button>
                            </form>
                        </div>
                    </div>
                )}
                {filterChauffeurs(chauffeurs, searchText).length > 0 && (
                    <>
                        <table className="tabrespo">
                            <thead>
                                <tr>
                                    <th>Nom</th>
                                    <th>Téléphone</th>
                                    <th>Email</th>
                                    <th>Active</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filterChauffeurs(chauffeurs, searchText).map(chauffeur => (
                                    <tr key={chauffeur._id}>
                                        <td>{chauffeur.nom}</td>
                                        <td>{chauffeur.telephone}</td>
                                        <td>{chauffeur.email}</td>
                                        <td>{chauffeur.isActive ? 'Yes' : 'No'}</td>
                                        <td>
                                            <button className='view-button' onClick={() => handleView(chauffeur)}>Voir</button>
                                            <button className='edit-button' onClick={() => handleEdit(chauffeur)}>Modifier</button>
                                            <button className='delete-button' onClick={() => toggleActiveStatus(chauffeur._id, chauffeur.isActive)}>{chauffeur.isActive ? 'Désactiver' : 'Activer'}</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="pagination">
                            <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Précédent</button>
                            <span>{currentPage}</span>
                            <button disabled={currentPage === Math.ceil(chauffeurs.length / chauffeursPerPage)} onClick={() => setCurrentPage(currentPage + 1)}>Suivant</button>
                        </div>
                    </>
                )}
                {filterChauffeurs(chauffeurs, searchText).length === 0 && (
                    <p>Aucun chauffeur trouvé</p>
                )}
                {selectedChauffeur && (
                    <div className="popup">
                        <div className="popup-content">
                            <span className="close-button" onClick={() => setSelectedChauffeur(null)}>&times;</span>
                            <h2>Détails du chauffeur</h2>
                            <p>Nom : {selectedChauffeur.nom}</p>
                            <p>Téléphone : {selectedChauffeur.telephone}</p>
                            <p>Email : {selectedChauffeur.email}</p>
                            <button className='delete-button' onClick={() => setSelectedChauffeur(null)}>Annuler</button>
                        </div>
                    </div>
                )}
                {editChauffeurId && (
                    <div className="popup">
                        <div className="popup-content">
                            <span className="close-button" onClick={() => { setEditChauffeurId(''); resetFormData(); setShowCreateForm(false); }}>&times;</span>
                            <h2>Modifier le chauffeur</h2>
                            <form onSubmit={handleEditSubmit}>
                                <input type="text" name="nom" value={formData.nom} onChange={handleChange} placeholder="Nom" />
                                <input type="text" name="telephone" value={formData.telephone} onChange={handleChange} placeholder="Téléphone" />
                                <input type="text" name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
                                <button className="print-button" type="submit">Sauvegarder</button>
                                <button className='delete-button' onClick={() => { setEditChauffeurId(''); resetFormData(); setShowCreateForm(false); }}>Annuler</button>
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