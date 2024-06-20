import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Main/Sidebar';
import HeaderEntrepot from '../../components/Headers/HeaderEntrepot';
import CustomAlert from '../../components/costumeAlert/costumeAlert';

function App() {
    const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
    const [selectedContent, setSelectedContent] = useState('');
    const [showOnlyActive, setShowOnlyActive] = useState(true);

    const OpenSidebar = () => {
        setOpenSidebarToggle(!openSidebarToggle);
    };

    const handleSidebarItemClick = (content) => {
        setSelectedContent(content);
    };

    const [entrepots, setEntrepots] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        IsActive: true
    });
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editEntrepotId, setEditEntrepotId] = useState('');
    const [selectedEntrepot, setSelectedEntrepot] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [alert, setAlert] = useState(null);

    const entrepotsPerPage = 8;

    useEffect(() => {
        fetchEntrepots();
    }, []);

    const fetchEntrepots = async () => {
        try {
            const response = await axios.get('http://localhost:8080/entrepots');
            setEntrepots(response.data.data.reverse());
        } catch (error) {
            console.error('Erreur:', error);
            showAlert('Une erreur s est produite lors de la récupération des entrepôts. Veuillez réessayer plus tard.');
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
        if (!formData.name) {
            showAlert('Veuillez saisir un nom d entrepôt.');
            return;
        }
        try {
            const response = await axios.post('http://localhost:8080/entrepots', formData);
            if (response.status === 201) {
                showAlert('Entrepot ajouté avec succès.');
                fetchEntrepots();
                resetFormData();
                setShowCreateForm(false);
            } else {
                showAlert(response.data.message || 'Une erreur s est produite.');
            }
        } catch (error) {
            console.error('Erreur:', error);
            if (error.response) {
                showAlert(error.response.data.message || 'Une erreur s est produite.');
            } else {
                showAlert('Une erreur s est produite. Veuillez réessayer plus tard.');
            }
        }
    };

    const handleDelete = async (id, isActive) => {
        try {
            const newStatus = !isActive;
            const response = await axios.put(`http://localhost:8080/entrepots/${id}`, { IsActive: newStatus });
            if (response.status === 200) {
                showAlert(`Entrepot ${newStatus ? 'Activer' : 'Désactiver'} avec succées.`);
                fetchEntrepots();
            } else {
                showAlert(response.data.message || 'Une erreur sest produite lors de la mise à jour du statut de l entrepôt.');
            }
        } catch (error) {
            console.error('Erreur:', error);
            showAlert('Une erreur s est produite. Veuillez réessayer plus tard.');
        }
    };

    const handleEdit = (entrepot) => {
        setEditEntrepotId(entrepot._id);
        setFormData({ ...entrepot });
        setShowCreateForm(true);
    };

    const handleView = (entrepot) => {
        setSelectedEntrepot(entrepot);
    };

    const handleEditSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.put(`http://localhost:8080/entrepots/${editEntrepotId}`, formData);
            if (response.status && response.status === 200) {
                showAlert('Entrepot mis à jour avec succès.');
                fetchEntrepots();
                setEditEntrepotId('');
                resetFormData();
                setShowCreateForm(false);
            } else {
                showAlert(response.data.message || 'Une erreur s est produite lors de la mise à jour de l entrepôt.');
            }
        } catch (error) {
            console.error('Erreur:', error);
            showAlert('Une erreur s est produite. Veuillez réessayer plus tard.');
        }
    };

    const resetFormData = () => {
        setFormData({
            name: '',
            IsActive: true
        });
    };

    const filterEntrepots = (entrepots, searchText) => {
        let filteredEntrepots = entrepots.filter(entrepot => {
            return (
                entrepot.name.toLowerCase().includes(searchText.toLowerCase())
            );
        });

        if (showOnlyActive) {
            filteredEntrepots = filteredEntrepots.filter(entrepot => entrepot.IsActive);
        }

        const indexOfLastEntrepot = currentPage * entrepotsPerPage;
        const indexOfFirstEntrepot = indexOfLastEntrepot - entrepotsPerPage;
        return filteredEntrepots.slice(indexOfFirstEntrepot, indexOfLastEntrepot);
    };

    const handleSearchChange = (event) => {
        setSearchText(event.target.value);
    };

    const handleShowOnlyActiveChange = () => {
        setShowOnlyActive(!showOnlyActive);
    };

    return (
        <div className="grid-container">
            <HeaderEntrepot OpenSidebar={OpenSidebar}/>
            <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} handleItemClick={handleSidebarItemClick}/>
            <div className="container">
                <h1 className="title-all">Entrepots</h1>
                <div className="actions">

                <div className='search-cont'>
                    <h1 className='search-icon'/>
                        <input className='search-bar'
                        type="text"
                        placeholder="Chercher un entrepots"
                        value={searchText}
                        onChange={handleSearchChange}
                        />
                    </div>

                    <label>
                        <input
                            type="checkbox"
                            class="checkbox-custom"
                            checked={showOnlyActive}
                            onChange={handleShowOnlyActiveChange}
                        />
                        <span class="checkbox-label">Actifs seulement</span>
                    </label>

                    <button className="print-button" onClick={() => setShowCreateForm(true)}>Create</button>
                </div>
                {showCreateForm && (
                     <>
                     <div className="overlay"></div>                     
                    <div className="popup">
                        <div className="popup-content">
                            <span className="close-button" onClick={() => setShowCreateForm(false)}>&times;</span>
                            <h2>Create New Entrepot</h2>
                            <form onSubmit={handleSubmit}>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
                                <button className="print-button" type="submit">Sauvgrader</button>
                                <button className='delete-button' onClick={() => setShowCreateForm(false)}>Cancel</button>
                            </form>
                        </div>
                    </div>
                    </>
                )}
                {filterEntrepots(entrepots, searchText).length > 0 && (
                    <>
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Active</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filterEntrepots(entrepots, searchText).map(entrepot => (
                                    <tr key={entrepot._id}>
                                        <td>{entrepot.name}</td>
                                        <td>{entrepot.IsActive ? 'Yes' : 'No'}</td>
                                        <td>
                                            <button className='view-button' onClick={() => handleView(entrepot)}>Voir</button>
                                            <button className='edit-button' onClick={() => handleEdit(entrepot)}>Modifier</button>
                                            <button className='action-button delete-button' onClick={() => handleDelete(entrepot._id, entrepot.IsActive)}>
                                                {entrepot.IsActive ? 'Désactiver' : 'Activer'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="pagination">
                            <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Précédent</button>
                            <span>{currentPage}</span>
                            <button disabled={currentPage === Math.ceil(entrepots.length / entrepotsPerPage)} onClick={() => setCurrentPage(currentPage + 1)}>Suivant</button>
                        </div>
                    </>
                )}
                {filterEntrepots(entrepots, searchText).length === 0 && (
                    <p>No entrepots found.</p>
                )}
                {selectedEntrepot && (
                     <>
                    <div className="overlay"></div>                     
                    <div className="popup">
                        <div className="popup-content">
                            <span className="close-button" onClick={() => setSelectedEntrepot(null)}>&times;</span>
                            <h2>Entrepot Details</h2>
                            <p>Name: {selectedEntrepot.name}</p>
                            <p>Active: {selectedEntrepot.IsActive ? 'Yes' : 'No'}</p>
                            <button className='delete-button' onClick={() => setSelectedEntrepot(null)}>Annuler</button>
                        </div>
                    </div>
                    </>
                )}
                {editEntrepotId && (
                     <>
                     <div className="overlay"></div>                     
                    <div className="popup">
                        <div className="popup-content">
                            <span className="close-button" onClick={() => { setEditEntrepotId(''); resetFormData(); setShowCreateForm(false); }}>&times;</span>
                            <h2>Edit Entrepot</h2>
                            <form onSubmit={handleEditSubmit}>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
                                <button className="print-button" type="submit">Sauvgarder</button>
                                <button className='delete-button' onClick={() => { setEditEntrepotId(''); resetFormData(); setShowCreateForm(false); }}>Annuler</button>
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
////*last version