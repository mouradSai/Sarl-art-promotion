import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Appproducts.css'; // Correction de la typo dans le nom du fichier CSS
import Sidebar from '../../components/Main/Sidebar';
import HeaderProduct from '../../components/Headers/HeaderProduct';
import CustomAlert from '../../components/costumeAlert/costumeAlert'; // Import du composant CustomAlert

function App() {
    const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

    const OpenSidebar = () => {
        setOpenSidebarToggle(!openSidebarToggle);
    };

    const handleSidebarItemClick = (content) => {
        setSelectedContent(content); // Correction: la variable "selectedContent" n'est pas définie
    };

    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        entrepot: '',
        quantity: '',
        unit: '',
        description: '',
        IsActive: true // Nouvelle propriété IsActive avec valeur par défaut true
    });
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editProductId, setEditProductId] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showActiveOnly, setShowActiveOnly] = useState(false); // Ajout de l'état pour filtrer les produits actifs
    const [alert, setAlert] = useState(null); // Ajout de l'état pour l'alerte

    const productsPerPage = 8; // Nombre de produits à afficher par page

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:8080/products');
            setProducts(response.data.data);
        } catch (error) {
            console.error('Error:', error);
            showAlert('An error occurred while fetching products. Please try again later.');
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
        if (!formData.name || !formData.category || !formData.entrepot || !formData.quantity || !formData.unit) {
            showAlert('Please fill in all required fields.');
            return;
        }
        try {
            const response = await axios.post('http://localhost:8080/products', formData);
            if (response.status === 201) {
                showAlert('Product added successfully.');
                fetchProducts();
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
            const response = await axios.delete(`http://localhost:8080/products/${id}`);
            if (response.status === 200) {
                showAlert('Product deleted successfully.');
                fetchProducts();
            } else {
                showAlert(response.data.message || 'An error occurred while deleting product.');
            }
        } catch (error) {
            console.error('Error:', error);
            showAlert('An error occurred. Please try again later.');
        }
    };

    const toggleActiveStatus = async (id, isActive) => {
        try {
            const response = await axios.put(`http://localhost:8080/products/${id}`, { IsActive: !isActive });
            if (response.status === 200) {
                showAlert(`Product ${isActive ? 'deactivated' : 'activated'} successfully.`);
                fetchProducts();
            } else {
                showAlert(response.data.message || 'An error occurred while updating product status.');
            }
        } catch (error) {
            console.error('Error:', error);
            showAlert('An error occurred. Please try again later.');
        }
    };

    const handleEdit = (product) => {
        setEditProductId(product._id);
        setFormData({ ...product });
        setShowCreateForm(true);
    };

    const handleView = (product) => {
        setSelectedProduct(product);
    };

    const handleEditSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.put(`http://localhost:8080/products/${editProductId}`, formData);
            if (response.status && response.status === 200) {
                showAlert('Product updated successfully.');
                fetchProducts();
                setEditProductId('');
                resetFormData();
                setShowCreateForm(false);
            } else {
                showAlert(response.data.message || 'An error occurred while updating product.');
            }
        } catch (error) {
            console.error('Error:', error);
            showAlert('An error occurred. Please try again later.');
        }
    };

    const resetFormData = () => {
        setFormData({
            name: '',
            category: '',
            entrepot: '',
            quantity: '',
            unit: '',
            description: '',
            IsActive: true // Réinitialisation de IsActive à true
        });
    };

    const filterProducts = (products, searchText) => {
        let filteredProducts = products.filter(product => {
            return (
                product.name.toLowerCase().includes(searchText.toLowerCase()) ||
                product.description.toLowerCase().includes(searchText.toLowerCase()) ||
                product.quantity.toString().includes(searchText.toLowerCase())
            );
        });

        if (showActiveOnly) {
            filteredProducts = filteredProducts.filter(product => product.IsActive);
        }

        const indexOfLastProduct = currentPage * productsPerPage;
        const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
        return filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    };

    const handleSearchChange = (event) => {
        setSearchText(event.target.value);
    };

    const handleFilterChange = () => {
        setShowActiveOnly(!showActiveOnly);
    };

    // Déclaration des options d'unités
    const unitOptions = ['kg', 'g', 'L', 'ml', 'unit'];

    return (
        <div className="grid-container">
            <HeaderProduct OpenSidebar={OpenSidebar}/>
            <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
            <div className="container">
                <h1 className="title-all">Produits</h1>
                <div className="actions">
                    <input
                        type="text"
                        placeholder="Search products..."
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
                            <h2>Create New Product</h2>
                            <form onSubmit={handleSubmit}>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
                                <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="Category" />
                                <input type="text" name="entrepot" value={formData.entrepot} onChange={handleChange} placeholder="Entrepot" />
                                <input type="text" name="quantity" value={formData.quantity} onChange={handleChange} placeholder="Quantity" />
                                <select name="unit" value={formData.unit} onChange={handleChange}>
                                    {unitOptions.map((unit, index) => (
                                        <option key={index} value={unit}>{unit}</option>
                                    ))}
                                </select>
                                <input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="Description" />
                                <button className="create-button" type="submit">Save</button>
                                <button className='delete-button' onClick={() => setShowCreateForm(false)}>Cancel</button>
                            </form>
                        </div>
                    </div>
                )}
                {filterProducts(products, searchText).length > 0 && (
                    <>
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th>Entrepot</th>
                                    <th>Quantity</th>
                                    <th>Unit</th>
                                    <th>Description</th>
                                    <th>Active</th> {/* Ajout de la colonne "Active" */}
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filterProducts(products, searchText).map(product => (
                                    <tr key={product._id}>
                                        <td>{product.name}</td>
                                        <td>{product.category}</td>
                                        <td>{product.entrepot}</td>
                                        <td>{product.quantity}</td>
                                        <td>{product.unit}</td>
                                        <td>{product.description}</td>
                                        <td>{product.IsActive ? 'Yes' : 'No'}</td> {/* Affichage de la propriété IsActive */}
                                        <td>
                                            <button className='view-button' onClick={() => handleView(product)}>View</button>
                                            <button className='edit-button' onClick={() => handleEdit(product)}>Edit</button>
                                            <button className='delete-button' onClick={() => toggleActiveStatus(product._id, product.IsActive)}>{product.IsActive ? 'Disable' : 'Enable'}</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="pagination">
                            <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>&lt; Prev</button>
                            <span>{currentPage}</span>
                            <button className='prev-next-button' disabled={currentPage === Math.ceil(products.length / productsPerPage)} onClick={() => setCurrentPage(currentPage + 1)}>Next &gt;</button>
                        </div>
                    </>
                )}
                {filterProducts(products, searchText).length === 0 && (
                    <p>No products found.</p>
                )}
                {selectedProduct && (
                    <div className="popup">
                        <div className="popup-content">
                            <span className="close-button" onClick={() => setSelectedProduct(null)}>&times;</span>
                            <h2>Product Details</h2>
                            <p>Name: {selectedProduct.name}</p>
                            <p>Category: {selectedProduct.category}</p>
                            <p>Entrepot: {selectedProduct.entrepot}</p>
                            <p>Quantity: {selectedProduct.quantity}</p>
                            <p>Unit: {selectedProduct.unit}</p>
                            <p>Description: {selectedProduct.description}</p>
                            <button className='delete-button' onClick={() => setSelectedProduct(null)}>Cancel</button>
                        </div>
                    </div>
                )}
                {editProductId && (
                    <div className="popup">
                        <div className="popup-content">
                            <span className="close-button" onClick={() => { setEditProductId(''); resetFormData(); setShowCreateForm(false); }}>&times;</span>
                            <h2>Edit Product</h2>
                            <form onSubmit={handleEditSubmit}>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
                                <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="Category" />
                                <input type="text" name="entrepot" value={formData.entrepot} onChange={handleChange} placeholder="Entrepot" />
                                <input type="text" name="quantity" value={formData.quantity} onChange={handleChange} placeholder="Quantity" />
                                <select name="unit" value={formData.unit} onChange={handleChange}>
                                    {unitOptions.map((unit, index) => (
                                        <option key={index} value={unit}>{unit}</option>
                                    ))}
                                </select>
                                <input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="Description" />
                                <button className="create-button" type="submit">Save</button>
                                <button className='delete-button' onClick={() => { setEditProductId(''); resetFormData(); setShowCreateForm(false); }}>Cancel</button>
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
