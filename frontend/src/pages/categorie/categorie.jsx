import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Main/Sidebar';
import HeaderCategorie from '../../components/Headers/HeaderCategorie';
import CustomAlert from '../../components/costumeAlert/costumeAlert'; // Import du composant CustomAlert

function App() {
    const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
    const [selectedContent, setSelectedContent] = useState('');
    const [showOnlyActive, setShowOnlyActive] = useState(true);

    const OpenSidebar = () => {
        setOpenSidebarToggle(!openSidebarToggle);
    };

    const handleSidebarItemClick = (content) => {
        setSelectedContent(content); // Correction: la variable "selectedContent" n'est pas définie
    };

    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        IsActive: true
    });
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editCategoryId, setEditCategoryId] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [alert, setAlert] = useState(null); // Ajout de l'état pour l'alerte

    const categoriesPerPage = 8; // Nombre de catégories à afficher par page

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:8080/categories');
            setCategories(response.data.data.reverse());
        } catch (error) {
            console.error('Error:', error);
            showAlert('Une erreur s est produite lors de la récupération des catégories. Veuillez réessayer plus tard.');
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
            showAlert('Veuillez saisir un nom de catégorie.');
            return;
        }
        try {
            const response = await axios.post('http://localhost:8080/categories', formData);
            if (response.status === 201) {
                showAlert('Catégorie ajoutée avec succès.');
                fetchCategories();
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

    const handleDelete = async (id, isActive) => {
        try {
            const newStatus = !isActive;
            const response = await axios.put(`http://localhost:8080/categories/${id}`, { IsActive: newStatus });
            if (response.status === 200) {
                showAlert(`Catégorie ${newStatus ? 'Activer' : 'Désactiver'} avec succès.`);
                fetchCategories();
            } else {
                showAlert(response.data.message || 'Une erreur s est produite lors de la mise à jour du statut de la catégorie.');
            }
        } catch (error) {
            console.error('Erreur:', error);
            showAlert('Une erreur s est produite. Veuillez réessayer plus tard.');
        }
    };

    const handleEdit = (category) => {
        setEditCategoryId(category._id);
        setFormData({ ...category });
        setShowCreateForm(true);
    };

    const handleView = (category) => {
        setSelectedCategory(category);
    };

    const handleEditSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.put(`http://localhost:8080/categories/${editCategoryId}`, formData);
            if (response.status && response.status === 200) {
                showAlert('Catégorie mise à jour avec succès.');
                fetchCategories();
                setEditCategoryId('');
                resetFormData();
                setShowCreateForm(false);
            } else {
                showAlert(response.data.message || 'Une erreur s est produite lors de la mise à jour de la catégorie.');
            }
        } catch (error) {
            console.error('Erreur:', error);
            showAlert('Une erreur s est produite. Veuillez réessayer plus tard.');
        }
    };

    const resetFormData = () => {
        setFormData({
            name: '',
            description: '',
            IsActive: true
        });
    };

    const filterCategories = (categories, searchText) => {
        let filteredCategories = categories.filter(category => {
            return (
                category.name.toLowerCase().includes(searchText.toLowerCase()) ||
                (category.description && category.description.toLowerCase().includes(searchText.toLowerCase()))
            );
        });

        if (showOnlyActive) {
            filteredCategories = filteredCategories.filter(category => category.IsActive);
        }

        const indexOfLastCategory = currentPage * categoriesPerPage;
        const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
        return filteredCategories.slice(indexOfFirstCategory, indexOfLastCategory);
    };

    const handleSearchChange = (event) => {
        setSearchText(event.target.value);
    };

    const handleShowOnlyActiveChange = () => {
        setShowOnlyActive(!showOnlyActive);
    };

    return (
        <div className="grid-container">
            <HeaderCategorie OpenSidebar={OpenSidebar}/>
            <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} handleItemClick={handleSidebarItemClick}/>
            <div className="container">
                <h1 className="title-all">Catégories</h1>
                <div className="actions">

                        <div className='search-cont'>
                         <h1 className='search-icon'/>
                            <input className='search-bar'
                            type="text"
                            placeholder="Chercher une catégorie"
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

                    <button className="create-button" onClick={() => setShowCreateForm(true)}>Créer </button>
                </div>
                {showCreateForm && (
                    <div className="popup">
                        <div className="popup-content">
                            <span className="close-button" onClick={() => setShowCreateForm(false)}>&times;</span>
                            <h2>Créer catégorie</h2>
                            <form onSubmit={handleSubmit}>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
                                <input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="Description" />
                                <button className="create-button" type="submit">Sauvegarder</button>
                                <button className='delet-button' onClick={() => setShowCreateForm(false)}>Annuler</button>
                            </form>
                        </div>
                    </div>
                )}
                {filterCategories(categories, searchText).length > 0 && (
                    <>
                        <table>
                            <thead>
                                <tr>
                                    <th>Nom</th>
                                    <th>Description </th>
                                    <th>Active</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filterCategories(categories, searchText).map(category => (
                                    <tr key={category._id}>
                                        <td>{category.name}</td>
                                        <td>{category.description}</td>
                                        <td>{category.IsActive ? 'Yes' : 'No'}</td>
                                        <td>
                                            <button className='view-button' onClick={() => handleView(category)}>Voire</button>
                                            <button className='edit-button' onClick={() => handleEdit(category)}>Modifier</button>
                                            <button className='action-button delete-button' onClick={() => handleDelete(category._id, category.IsActive)}>
                                                {category.IsActive ? 'Désactiver' : 'Activer'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="pagination">
                            <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Précédent</button>
                            <span>{currentPage}</span>
                            <button disabled={currentPage === Math.ceil(categories.length / categoriesPerPage)} onClick={() => setCurrentPage(currentPage + 1)}>Suivant</button>
                        </div>
                    </>
                )}
                {filterCategories(categories, searchText).length === 0 && (
                    <p>Aucune catégorie trouvée</p>
                )}
                {selectedCategory && (
                    <div className="popup">
                        <div className="popup-content">
                            <span className="close-button" onClick={() => setSelectedCategory(null)}>&times;</span>
                            <h2>Détails de la catégorie</h2>
                            <p>Nom: {selectedCategory.name}</p>
                            <p>Description: {selectedCategory.description}</p>
                            <p>Active: {selectedCategory.IsActive ? 'Yes' : 'No'}</p>
                            <button className='delet-button' onClick={() => setSelectedCategory(null)}>Annuler</button>
                        </div>
                    </div>
                )}
                {editCategoryId && (
                    <div className="popup">
                        <div className="popup-content">
                            <span className="close-button" onClick={() => { setEditCategoryId(''); resetFormData(); setShowCreateForm(false); }}>&times;</span>
                            <h2>Modifier la catégorie</h2>
                            <form onSubmit={handleEditSubmit}>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
                                <input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="Description" />
                                <button className="create-button" type="submit">sauvegarder</button>
                                <button className='delet-button' onClick={() => { setEditCategoryId(''); resetFormData(); setShowCreateForm(false); }}>Annuler</button>
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
/*last version *////////////////