import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Appproducts.css';
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

    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        quantity: 0,
        unit: ''
    });
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editProductId, setEditProductId] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 5; // Nombre de produits à afficher par page

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

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!formData.name || !formData.description || !formData.category || !formData.unit) {
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
            description: '',
            category: '',
            quantity: 0,
            unit: ''
        });
    };

    const showAlert = (message) => {
        alert(message);
    };

    // Modifiez la fonction filterProducts pour inclure la pagination
    const filterProducts = (products, searchText) => {
        const filtered = products.filter(product => {
            return product.name.toLowerCase().includes(searchText.toLowerCase());
        });

        const indexOfLastProduct = currentPage * productsPerPage;
        const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
        return filtered.slice(indexOfFirstProduct, indexOfLastProduct);
    };

    const handleSearchChange = (event) => {
        setSearchText(event.target.value);
    };

    const filteredProducts = filterProducts(products, searchText);

    return (
        <div className="grid-container">
            <Header OpenSidebar={OpenSidebar}/>
            <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
            <div className="container">
                <h1>Products</h1>
                <div className="actions">
                    <button className="create-button" onClick={() => setShowCreateForm(true)}>Create</button>
                </div>
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchText}
                    onChange={handleSearchChange}
                />
                {showCreateForm && (
                    <div className="popup">
                        <div className="popup-content">
                            <span className="close-button" onClick={() => setShowCreateForm(false)}>&times;</span>
                            <h2>Create New Product</h2>
                            <form onSubmit={handleSubmit}>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
                                <input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="Description" />
                                <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="Category" />
                                <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} placeholder="Quantity" />
                                <select name="unit" value={formData.unit} onChange={handleChange}>
                                    <option value="">Select Unit</option>
                                    <option value="kg">kg</option>
                                    <option value="g">g</option>
                                    <option value="L">L</option>
                                    <option value="ml">ml</option>
                                    <option value="unit">unit</option>
                                </select>
                                <button className="create-button" type="submit">Save</button>
                                <button className='delet-button' onClick={() => setShowCreateForm(false)}>Cancel</button>
                            </form>
                        </div>
                    </div>
                )}
                {filteredProducts.length > 0 && (
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Category</th>
                                <th>Quantity</th>
                                <th>Unit</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map(product => (
                                <tr key={product._id}>
                                    <td>{product.name}</td>
                                    <td>{product.description}</td>
                                    <td>{product.category}</td>
                                    <td>{product.quantity}</td>
                                    <td>{product.unit}</td>
                                    <td>
                                        <button className='view-button' onClick={() => handleView(product)}>View</button>
                                        <button className='edit-button' onClick={() => handleEdit(product)}>Edit</button>
                                        <button className='action-button delete-button' onClick={() => handleDelete(product._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                {filteredProducts.length > 0 && (
                    <div className="pagination">
                        <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>&lt; Prev</button>
                        <span>{currentPage}</span>
                        <button disabled={currentPage === Math.ceil(products.length / productsPerPage)} onClick={() => setCurrentPage(currentPage + 1)}>Next &gt;</button>
                    </div>
                )}
                {selectedProduct && (
                    <div className="popup">
                        <div className="popup-content">
                            <span className="close-button" onClick={() => setSelectedProduct(null)}>&times;</span>
                            <h2>Product Details</h2>
                            <p>Name: {selectedProduct.name}</p>
                            <p>Description: {selectedProduct.description}</p>
                            <p>Category: {selectedProduct.category}</p>
                            <p>Quantity: {selectedProduct.quantity}</p>
                            <p>Unit: {selectedProduct.unit}</p>
                            <button className='delet-button' onClick={() => setSelectedProduct(null)}>Cancel</button>
                        </div>
                    </div>
                )}
                {editProductId && (
                    <div className="popup">
                        <div className="popup-content">
                            <span className="close-button" onClick={() => {setEditProductId(''); resetFormData(); setShowCreateForm(false);}}>&times;</span>
                            <h2>Edit Product</h2>
                            <form onSubmit={handleEditSubmit}>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
                                <input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="Description" />
                                <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="Category" />
                                <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} placeholder="Quantity" />
                                <select name="unit" value={formData.unit} onChange={handleChange}>
                                    <option value="">Select Unit</option>
                                    <option value="kg">kg</option>
                                    <option value="g">g</option>
                                    <option value="L">L</option>
                                    <option value="ml">ml</option>
                                    <option value="unit">unit</option>
                                </select>
                                <button className="create-button" type="submit">Save</button>
                                <button className='delet-button' onClick={() => {setEditProductId(''); resetFormData(); setShowCreateForm(false);}}>Cancel</button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
