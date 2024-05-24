import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Appproducts.css'; 
import Sidebar from '../../components/Main/Sidebar';
import HeaderProduct from '../../components/Headers/HeaderProduct';
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
    const [showActiveOnly, setShowActiveOnly] = useState(true); 
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
            setProducts(response.data.data.reverse());
        } catch (error) {
            console.error('Erreur:', error);
            showAlert('Une erreur s est produite lors de la récupération des produits. Veuillez réessayer plus tard.');
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:8080/categories', {
                params: {
                    IsActive: true
                }
            });
            setCategories(response.data.data);
        } catch (error) {
            console.error('Erreur:', error);
            showAlert('Une erreur s est produite lors de la récupération des catégories. Veuillez réessayer plus tard.');
        }
    };
    

    const fetchEntrepots = async () => {
        try {
            const response = await axios.get('http://localhost:8080/entrepots',{
                params: {
                    IsActive: true
                }
            });
            setEntrepots(response.data.data);
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
        setProductData({
            ...productData,
            [name]: value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!productData.name || !productData.namecategory || !productData.nameentrepot || !productData.quantity || !productData.unit) {
            showAlert('Veuillez remplir tous les champs requis.');
            return;
        }
        try {
            const response = await axios.post('http://localhost:8080/products', {
                ...productData,
                category: categories.find(cat => cat.name === productData.namecategory)?._id,
                entrepot: entrepots.find(ent => ent.name === productData.nameentrepot)?._id
            });
            if (response.status === 201) {
                showAlert('Produit ajouté avec succès.');
                fetchProducts();
                resetProductData();
                setShowCreateForm(false);
            } else {
                showAlert(response.data.message || 'Une erreur sest produite.');
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

 /*   const handleDelete = async (id) => {
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
*/
    const toggleActiveStatus = async (id, isActive) => {
        try {
            const response = await axios.put(`http://localhost:8080/products/${id}`, { IsActive: !isActive });
            if (response.status === 200) {
                showAlert(`Produit ${isActive ? 'Désactiver' : 'Activer'} avec succées.`);
                fetchProducts();
            } else {
                showAlert(response.data.message || 'Une erreur s est produite lors de la mise à jour de l état du produit.');
            }
        } catch (error) {
            console.error('Erreur:', error);
            showAlert('Une erreur s est produite. Veuillez réessayer plus tard.');
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
                showAlert('Produit mis à jour avec succès.');
                fetchProducts();
                setEditProductId('');
                resetProductData();
                setShowCreateForm(false);
            } else {
                showAlert(response.data.message || 'Une erreur s est produite lors de la mise à jour du produit.');
            }
        } catch (error) {
            console.error('Erreur:', error);
            showAlert('Une erreur s est produite. Veuillez réessayer plus tard.');
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
                <HeaderProduct OpenSidebar={() => setOpenSidebarToggle(!openSidebarToggle)}/>
                <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={() => setOpenSidebarToggle(!openSidebarToggle)} />
                <div className="container">
                    <h1 className="title-all">Stock de Produits</h1>
                    <div className="actions">

                        <div className='search-cont'>
                         <h1 className='search-icon'/>
                            <input className='search-bar'
                            type="text"
                            placeholder="Chercher un produit"
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

                        <button className="create-button" onClick={() => setShowCreateForm(true)}>Créer</button>
                    </div>
                    {showCreateForm && (
                    <>
                    <div className="overlay"></div>                         
                        <div className="popup">
                            <div className="popup-content">
                                <span className="close-button" onClick={() => setShowCreateForm(false)}>&times;</span>
                                <h2>Créer un nouveau produit</h2>
                                <form onSubmit={handleSubmit}>
                                    <input type="text" name="name" value={productData.name} onChange={handleChange} placeholder="Nom de produit" />
                                    <select name="namecategory" value={productData.namecategory} onChange={handleChange}>
                                        <option value="">Choisir une catégorie</option>
                                        {categories.map((category) => (
                                            <option key={category._id} value={category.name}>{category.name}</option>
                                        ))}
                                    </select>
                                    <select name="nameentrepot" value={productData.nameentrepot} onChange={handleChange}>
                                        <option value="">Sélectionnez Entrepôt</option>
                                        {entrepots.map((entrepot) => (
                                            <option key={entrepot._id} value={entrepot.name}>{entrepot.name}</option>
                                        ))}
                                    </select>
                                    <input type="text" name="quantity" value={productData.quantity} onChange={handleChange} placeholder="Quantité" />
                                    <select name="unit" value={productData.unit} onChange={handleChange}>
                                    <option value="">Sélectionnez l'unité</option>
                                    {units.map((unit) => (
                                        <option key={unit} value={unit}>{unit}</option>
                                    ))}
                                </select>                                    
                                <input type="text" name="description" value={productData.description} onChange={handleChange} placeholder="Description" />
                                    <button className="create-button" type="submit">Sauvgarde</button>
                                    <button className='delete-button' onClick={() => setShowCreateForm(false)}>Annuler</button>
                                </form>
                            </div>
                        </div>
                        </>
                    )}
                {filterProducts(products, searchText).length > 0 && (
                    <>
                        <table className='tabrespo'>
                            <thead>
                                <tr>
                                    <th>Nom</th>
                                    <th>Catégorie</th>
                                    <th>Entrepôt</th>
                                    <th>Quantité</th>
                                    <th>Unité</th>
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
                                        <td>{product.quantity.toFixed(2)}</td>
                                        <td>{product.unit}</td>
                                        <td>{product.description}</td>
                                        <td>{product.IsActive ? 'Yes' : 'No'}</td>
                                        <td>
                                            <button className='view-button' onClick={() => handleView(product)}>Voire</button>
                                            <button className='edit-button' onClick={() => handleEdit(product)}>Modifier</button>
                                            <button className='delete-button' onClick={() => toggleActiveStatus(product._id, product.IsActive)}>{product.IsActive ? 'Désactiver' : 'Activer'}</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="pagination">
                            <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Précédent</button>
                            <span>{currentPage}</span>
                            <button disabled={currentPage === Math.ceil(products.length / productsPerPage)} onClick={() => setCurrentPage(currentPage + 1)}>Suivant</button>
                        </div>
                    </>
                )}
                {filterProducts(products, searchText).length === 0 && (
                    <p>Aucun produit trouvé.</p>
                )}
                {selectedProduct && (
                     <>
                     <div className="overlay"></div>                    
                    <div className="popup">
                        <div className="popup-content">
                            <span className="close-button" onClick={() => setSelectedProduct(null)}>&times;</span>
                            <h2>détails du produit</h2>
                            <p>Nom: {selectedProduct.name}</p>
                            <p>Catégorie: {selectedProduct.namecategory}</p>
                            <p>Entrepôt: {selectedProduct.nameentrepot}</p>
                            <p>Quantité: {selectedProduct.quantity}</p>
                            <p>Unité: {selectedProduct.unit}</p>
                            <p>Description: {selectedProduct.description}</p>
                            <button className='delete-button' onClick={() => setSelectedProduct(null)}>Annuler</button>
                        </div>
                    </div>
                    </>
                )}
                {editProductId && (
                     <>
                     <div className="overlay"></div>                      
                    <div className="popup">
                        <div className="popup-content">
                            <span className="close-button" onClick={() => { setEditProductId(''); resetProductData(); setShowCreateForm(false); }}>&times;</span>
                            <h2>Modifier le produit</h2>
                            <form onSubmit={handleEditSubmit}>
                                <input type="text" name="name" value={productData.name} onChange={handleChange} placeholder="Nom" />
                                <select name="namecategory" value={productData.namecategory} onChange={handleChange}>
                                        <option value="">Choisir une catégorie</option>
                                        {categories.map((category) => (
                                            <option key={category._id} value={category.name}>{category.name}</option>
                                        ))}
                                    </select>                               
                                    <select name="nameentrepot" value={productData.nameentrepot} onChange={handleChange}>
                                        <option value="">Sélectionnez Entrepôt</option>
                                        {entrepots.map((entrepot) => (
                                            <option key={entrepot._id} value={entrepot.name}>{entrepot.name}</option>
                                        ))}
                                    </select>                                
                                    <input type="text" name="quantity" value={productData.quantity} onChange={handleChange} placeholder="Quantité" />
                                    <select name="unit" value={productData.unit} onChange={handleChange}>
                                    <option value="">Selectionnez Unité</option>
                                    {units.map((unit) => (
                                        <option key={unit} value={unit}>{unit}</option>
                                    ))}
                                </select>                                    
                                <input type="text" name="description" value={productData.description} onChange={handleChange} placeholder="Description" />
                                <button className="create-button" type="submit">Sauvgarder</button>
                                <button className='delete-button' onClick={() => { setEditProductId(''); resetProductData(); setShowCreateForm(false); }}>Annuler</button>
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
/*cdefbdfdhdfelv!eveve*//*cdndndvdvnekjnvkenvkde toucher pas jai galerer a la faire wlah dffnrfrfnornrer/** */