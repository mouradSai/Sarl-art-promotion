import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Appproducts.css'; 
import Sidebar from '../../components/Main/Sidebar';
import Header from '../../components/Main/Header';
import CustomAlert from '../../components/costumeAlert/costumeAlert'; 

function App() {
    const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [entrepots, setEntrepots] = useState([]);
    const [productData, setProductData] = useState({
        name: '',
        namecategory: '',
        nameentrepot: '',
        quantity: '',
        unit: '',
        description: '',
        IsActive: true
    });
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editProductId, setEditProductId] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showActiveOnly, setShowActiveOnly] = useState(false); 
    const [alert, setAlert] = useState(null); 
    const [units] = useState(['kg', 'g', 'L', 'ml', 'unit']);  // List of units

    const productsPerPage = 8; 

    useEffect(() => {
        fetchProducts();
        fetchCategories();
        fetchEntrepots();
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

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:8080/categories');
            setCategories(response.data.data);
        } catch (error) {
            console.error('Error:', error);
            showAlert('An error occurred while fetching categories. Please try again later.');
        }
    };

    const fetchEntrepots = async () => {
        try {
            const response = await axios.get('http://localhost:8080/entrepots');
            setEntrepots(response.data.data);
        } catch (error) {
            console.error('Error:', error);
            showAlert('An error occurred while fetching entrepots. Please try again later.');
        }
    };

    const showAlert = (message, type) => {
        setAlert({ message, type });
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setProductData({
            ...productData,
            [name]: value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!productData.name || !productData.namecategory || !productData.nameentrepot || !productData.quantity || !productData.unit) {
            showAlert('Please fill in all required fields.');
            return;
        }
        try {
            const response = await axios.post('http://localhost:8080/products', {
                ...productData,
                category: categories.find(cat => cat.name === productData.namecategory)?._id,
                entrepot: entrepots.find(ent => ent.name === productData.nameentrepot)?._id
            });
            if (response.status === 201) {
                showAlert('Product added successfully.');
                fetchProducts();
                resetProductData();
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
        setProductData({ ...product });
        setShowCreateForm(true);
    };

    const handleView = (product) => {
        setSelectedProduct(product);
    };

    const handleEditSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.put(`http://localhost:8080/products/${editProductId}`, productData);
            if (response.status && response.status === 200) {
                showAlert('Product updated successfully.');
                fetchProducts();
                setEditProductId('');
                resetProductData();
                setShowCreateForm(false);
            } else {
                showAlert(response.data.message || 'An error occurred while updating product.');
            }
        } catch (error) {
            console.error('Error:', error);
            showAlert('An error occurred. Please try again later.');
        }
    };
    const resetProductData = () => {
        setProductData({
            name: '',
            namecategory: '',
            nameentrepot: '',
            quantity: '',
            unit: '',
            description: '',
            IsActive: true
        });
    };


    const filterProducts = (products, searchText) => {
        let filteredProducts = products.filter(product => {
            return (
                product.name.toLowerCase().includes(searchText.toLowerCase()) ||
                product.namecategory.toLowerCase().includes(searchText.toLowerCase()) ||
                product.nameentrepot.toLowerCase().includes(searchText.toLowerCase())
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

    return (
       
            <div className="grid-container">
                <Header OpenSidebar={() => setOpenSidebarToggle(!openSidebarToggle)}/>
                <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={() => setOpenSidebarToggle(!openSidebarToggle)} />
                <div className="container">
                    <h1 className="title-all">Products</h1>
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
                                    <input type="text" name="name" value={productData.name} onChange={handleChange} placeholder="Name" />
                                    <select name="namecategory" value={productData.namecategory} onChange={handleChange}>
                                        <option value="">Select Category</option>
                                        {categories.map((category) => (
                                            <option key={category._id} value={category.name}>{category.name}</option>
                                        ))}
                                    </select>
                                    <select name="nameentrepot" value={productData.nameentrepot} onChange={handleChange}>
                                        <option value="">Select Entrepot</option>
                                        {entrepots.map((entrepot) => (
                                            <option key={entrepot._id} value={entrepot.name}>{entrepot.name}</option>
                                        ))}
                                    </select>
                                    <input type="text" name="quantity" value={productData.quantity} onChange={handleChange} placeholder="Quantity" />
                                    <select name="unit" value={productData.unit} onChange={handleChange}>
                                    <option value="">Select Unit</option>
                                    {units.map((unit) => (
                                        <option key={unit} value={unit}>{unit}</option>
                                    ))}
                                </select>                                    <input type="text" name="description" value={productData.description} onChange={handleChange} placeholder="Description" />
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
                                    <th>Active</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filterProducts(products, searchText).map(product => (
                                    <tr key={product._id}>
                                        <td>{product.name}</td>
                                        <td>{product.namecategory}</td>
                                        <td>{product.nameentrepot}</td>
                                        <td>{product.quantity}</td>
                                        <td>{product.unit}</td>
                                        <td>{product.description}</td>
                                        <td>{product.IsActive ? 'Yes' : 'No'}</td>
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
                            <button disabled={currentPage === Math.ceil(products.length / productsPerPage)} onClick={() => setCurrentPage(currentPage + 1)}>Next &gt;</button>
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
                            <p>Category: {selectedProduct.namecategory}</p>
                            <p>Entrepot: {selectedProduct.nameentrepot}</p>
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
                            <span className="close-button" onClick={() => { setEditProductId(''); resetProductData(); setShowCreateForm(false); }}>&times;</span>
                            <h2>Edit Product</h2>
                            <form onSubmit={handleEditSubmit}>
                                <input type="text" name="name" value={productData.name} onChange={handleChange} placeholder="Name" />
                                <input type="text" name="namecategory" value={productData.namecategory} onChange={handleChange} placeholder="Category" />
                                <input type="text" name="nameentrepot" value={productData.nameentrepot} onChange={handleChange} placeholder="Entrepot" />
                                <input type="text" name="quantity" value={productData.quantity} onChange={handleChange} placeholder="Quantity" />
                                <input type="text" name="unit" value={productData.unit} onChange={handleChange} placeholder="Unit" />
                                <input type="text" name="description" value={productData.description} onChange={handleChange} placeholder="Description" />
                                <button className="create-button" type="submit">Save</button>
                                <button className='delete-button' onClick={() => { setEditProductId(''); resetProductData(); setShowCreateForm(false); }}>Cancel</button>
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
/*cdefbdfdhdfelv!eveve*//*cdndndvdvnekjnvkenvkde toucher pas jai galerer a la faire wlah dffnrfrfnornrer/** */