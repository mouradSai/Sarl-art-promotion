import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../../components/Main/Header';
import SidebarProduction from './SidebarProduction';

function App() {
    const [name, setName] = useState(''); // Nom de la formule
    const [products, setProducts] = useState([]); // Liste de produits pour la nouvelle formule
    const [newProduct, setNewProduct] = useState({ product: '', quantity: '' }); // Pour ajouter un nouveau produit à une formule existante
    const [openSidebarToggle, setOpenSidebarToggle] = useState(false); // Contrôle de l'état ouvert/fermé de la barre latérale
    const [formulas, setFormulas] = useState([]); // Liste de toutes les formules
    const [selectedFormula, setSelectedFormula] = useState(null); // Formule sélectionnée pour modification
    const [editableProducts, setEditableProducts] = useState([]); // Produits de la formule sélectionnée pour modification
    const [selectedProductIndex, setSelectedProductIndex] = useState(null); // Index du produit sélectionné pour édition
    const [productSuggestions, setProductSuggestions] = useState([]); // Suggestions de produits

    // Fetch all formulas and products on component mount
    useEffect(() => {
        async function fetchData() {
            try {
                const formulaResponse = await axios.get('http://localhost:8080/formules');
                setFormulas(formulaResponse.data);
                const productResponse = await axios.get('http://localhost:8080/products', {
                    params: { IsActive: true }
                });
                setProductSuggestions(productResponse.data.data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, []);

    const handleAddProduct = () => {
        setProducts([...products, { product: '', quantity: '' }]);
    };

    const handleProductChange = (index, key, value) => {
        const updatedProducts = [...products];
        updatedProducts[index][key] = value;
        setProducts(updatedProducts);
    };

    const handleEditableProductChange = (index, key, value) => {
        const updatedProducts = [...editableProducts];
        updatedProducts[index][key] = value;
        setEditableProducts(updatedProducts);
    };

    const handleNewProductChange = (key, value) => {
        setNewProduct({ ...newProduct, [key]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const productsWithCorrectQuantity = products.map(product => ({
            ...product,
            quantity: parseFloat(product.quantity.replace(',', '.'))
        }));
        try {
            const response = await axios.post('http://localhost:8080/formules', { name, products: productsWithCorrectQuantity });
            setFormulas([...formulas, response.data]);
            alert('Formula created successfully!');
            setName('');
            setProducts([]);
        } catch (error) {
            console.error(error);
            alert('Error creating formula');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/formules/${id}`);
            setFormulas(formulas.filter(formula => formula._id !== id));
            alert('Formula deleted successfully!');
        } catch (error) {
            console.error(error);
            alert('Error deleting formula');
        }
    };

    const handleDetails = async (formula) => {
        try {
            const response = await axios.get(`http://localhost:8080/formules/${formula._id}`);
            setSelectedFormula(response.data);
            setEditableProducts(response.data.products.map(prod => ({
                ...prod.product,
                quantity: prod.quantity.toString()
            })));
        } catch (error) {
            console.error(error);
        }
    };

    const handleClosePopup = () => {
        setSelectedFormula(null);
        setSelectedProductIndex(null);
    };

    const handleUpdateProduct = async () => {
        try {
            const updatedProducts = editableProducts.map(prod => ({
                product: prod._id,
                quantity: parseFloat(prod.quantity.replace(',', '.'))
            }));
            const updatedFormula = { ...selectedFormula, products: updatedProducts };
            await axios.put(`http://localhost:8080/formules/${selectedFormula._id}`, updatedFormula);
            alert('Products updated successfully!');
            await handleDetails(selectedFormula); // Refresh the selected formula details
        } catch (error) {
            console.error(error);
            alert('Error updating products');
        }
    };

    const handleAddProductToFormula = async () => {
        const productToAdd = { ...newProduct, quantity: parseFloat(newProduct.quantity.replace(',', '.')) };
        try {
            const response = await axios.put(`http://localhost:8080/formules/add-product/${selectedFormula._id}`, { product: productToAdd });
            await handleDetails(response.data); // Update the details view with new product list
            alert('Product added successfully!');
            setNewProduct({ product: '', quantity: '' }); // Reset new product fields
        } catch (error) {
            console.error(error);
            alert('Error adding product to formula');
        }
    };

    const handleDeleteProduct = async (index) => {
        try {
            const updatedProducts = editableProducts.filter((_, i) => i !== index);
            const updatedFormula = { ...selectedFormula, products: updatedProducts.map(p => ({ product: p._id, quantity: p.quantity })) };
            await axios.put(`http://localhost:8080/formules/${selectedFormula._id}`, updatedFormula);
            alert('Product deleted successfully!');
            await handleDetails(selectedFormula); // Refresh the selected formula details
        } catch (error) {
            console.error(error);
            alert('Error deleting product');
        }
    };

    return (
        <div className="grid-container">
            <Header OpenSidebar={() => setOpenSidebarToggle(prev => !prev)} />
            <SidebarProduction openSidebarToggle={openSidebarToggle} OpenSidebar={() => setOpenSidebarToggle(prev => !prev)} />
            <div className='container'>
                <h2>Create Formula</h2>
                <form onSubmit={handleSubmit}>
                    <label>Nom de la formule:</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                    {products.map((product, index) => (
                        <div key={index}>
                            <select
                                value={product.product}
                                onChange={(e) => handleProductChange(index, 'product', e.target.value)}
                                required
                            >
                                <option value="">Sélectionnez un produit</option>
                                {productSuggestions.map(prod => (
                                    <option key={prod.id} value={prod.name}>{prod.name}</option>
                                ))}
                            </select>
                            <input
                                type="text"
                                value={product.quantity}
                                onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                                placeholder="Quantity"
                                required
                            />
                        </div>
                    ))}
                    <button type="button" className='view-button' onClick={handleAddProduct}> + Ajouter Matière </button>
                    <button className='print-button' type="submit">créer Formule</button>
                </form>

                <h2>Formula List</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Nom formule</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {formulas.map(formula => (
                            <tr key={formula._id}>
                                <td>{formula.name}</td>
                                <td>
                                    <button className='edit-button' onClick={() => handleDetails(formula)}>Details</button>
                                    <button className='delete-button' onClick={() => handleDelete(formula._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {selectedFormula && (
                <div className="popup">
                    <div className="popup-content">
                        <h2>{selectedFormula.name} Details</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th className='titlesHis'>Nom</th>
                                    <th className='titlesHis'>Quantité</th>
                                    <th className='titlesHis'>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {editableProducts.map((product, index) => (
                                    <tr key={index}>
                                        <td>{product.name}</td>
                                        <td>
                                            <input
                                                type="text"
                                                value={product.quantity}
                                                onChange={(e) => handleEditableProductChange(index, 'quantity', e.target.value)}
                                                required
                                            />
                                        </td>
                                        <td>
                                            <button className='view-button' onClick={() => handleUpdateProduct(index)}>Update</button>
                                            <button className='delete-button' onClick={() => handleDeleteProduct(index)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                                <tr>
                                    <td>
                                        <select
                                            value={newProduct.product}
                                            onChange={(e) => handleNewProductChange('product', e.target.value)}
                                            required
                                        >
                                            <option value="">Sélectionnez un produit</option>
                                            {productSuggestions.map(prod => (
                                                <option key={prod.id} value={prod.name}>{prod.name}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={newProduct.quantity}
                                            onChange={(e) => handleNewProductChange('quantity', e.target.value)}
                                            placeholder="New product quantity"
                                            required
                                        />
                                    </td>
                                    <td>
                                        <button className='print-button' onClick={handleAddProductToFormula}>Add Product</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <button className='delete-button' onClick={handleClosePopup}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
