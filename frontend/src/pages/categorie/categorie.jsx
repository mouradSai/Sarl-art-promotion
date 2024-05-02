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
            setCategories(response.data.data);
        } catch (error) {
            console.error('Error:', error);
            showAlert('An error occurred while fetching categories. Please try again later.');
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
            showAlert('Please enter a category name.');
            return;
        }
        try {
            const response = await axios.post('http://localhost:8080/categories', formData);
            if (response.status === 201) {
                showAlert('Category added successfully.');
                fetchCategories();
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

    const handleDelete = async (id, isActive) => {
        try {
            const newStatus = !isActive;
            const response = await axios.put(`http://localhost:8080/categories/${id}`, { IsActive: newStatus });
            if (response.status === 200) {
                showAlert(`Category ${newStatus ? 'enabled' : 'disabled'} successfully.`);
                fetchCategories();
            } else {
                showAlert(response.data.message || 'An error occurred while updating category status.');
            }
        } catch (error) {
            console.error('Error:', error);
            showAlert('An error occurred. Please try again later.');
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
                showAlert('Category updated successfully.');
                fetchCategories();
                setEditCategoryId('');
                resetFormData();
                setShowCreateForm(false);
            } else {
                showAlert(response.data.message || 'An error occurred while updating category.');
            }
        } catch (error) {
            console.error('Error:', error);
            showAlert('An error occurred. Please try again later.');
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
                <h1 className="title-all">Categories</h1>
                <div className="actions">
                    <input
                        type="text"
                        placeholder="Search categories..."
                        value={searchText}
                        onChange={handleSearchChange}
                    />
                    <label>
                        Show only active
                        <input
                            type="checkbox"
                            checked={showOnlyActive}
                            onChange={handleShowOnlyActiveChange}
                        />
                    </label>
                    <button className="create-button" onClick={() => setShowCreateForm(true)}>Create</button>
                </div>
                {showCreateForm && (
                    <div className="popup">
                        <div className="popup-content">
                            <span className="close-button" onClick={() => setShowCreateForm(false)}>&times;</span>
                            <h2>Create New Category</h2>
                            <form onSubmit={handleSubmit}>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
                                <input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="Description" />
                                <button className="create-button" type="submit">Save</button>
                                <button className='delet-button' onClick={() => setShowCreateForm(false)}>Cancel</button>
                            </form>
                        </div>
                    </div>
                )}
                {filterCategories(categories, searchText).length > 0 && (
                    <>
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Description</th>
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
                                            <button className='view-button' onClick={() => handleView(category)}>View</button>
                                            <button className='edit-button' onClick={() => handleEdit(category)}>Edit</button>
                                            <button className='action-button delete-button' onClick={() => handleDelete(category._id, category.IsActive)}>
                                                {category.IsActive ? 'Disable' : 'Enable'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="pagination">
                            <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>&lt; Prev</button>
                            <span>{currentPage}</span>
                            <button disabled={currentPage === Math.ceil(categories.length / categoriesPerPage)} onClick={() => setCurrentPage(currentPage + 1)}>Next &gt;</button>
                        </div>
                    </>
                )}
                {filterCategories(categories, searchText).length === 0 && (
                    <p>No categories found.</p>
                )}
                {selectedCategory && (
                    <div className="popup">
                        <div className="popup-content">
                            <span className="close-button" onClick={() => setSelectedCategory(null)}>&times;</span>
                            <h2>Category Details</h2>
                            <p>Name: {selectedCategory.name}</p>
                            <p>Description: {selectedCategory.description}</p>
                            <p>Active: {selectedCategory.IsActive ? 'Yes' : 'No'}</p>
                            <button className='delet-button' onClick={() => setSelectedCategory(null)}>Cancel</button>
                        </div>
                    </div>
                )}
                {editCategoryId && (
                    <div className="popup">
                        <div className="popup-content">
                            <span className="close-button" onClick={() => { setEditCategoryId(''); resetFormData(); setShowCreateForm(false); }}>&times;</span>
                            <h2>Edit Category</h2>
                            <form onSubmit={handleEditSubmit}>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
                                <input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="Description" />
                                <button className="create-button" type="submit">Save</button>
                                <button className='delet-button' onClick={() => { setEditCategoryId(''); resetFormData(); setShowCreateForm(false); }}>Cancel</button>
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