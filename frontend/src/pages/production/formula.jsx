import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../components/Main/Header';
import SidebarProduction from './SidebarProduction';
import './App.css';

function App() {
    const [name, setName] = useState(''); // Nom de la formule
    const [products, setProducts] = useState([]); // Liste de produits pour la nouvelle formule
    const [newProduct, setNewProduct] = useState({ product: '', quantity: 0 }); // Pour ajouter un nouveau produit à une formule existante
    const [openSidebarToggle, setOpenSidebarToggle] = useState(false); // Contrôle de l'état ouvert/fermé de la barre latérale
    const [formulas, setFormulas] = useState([]); // Liste de toutes les formules
    const [selectedFormula, setSelectedFormula] = useState(null); // Formule sélectionnée pour modification
    const [editableProducts, setEditableProducts] = useState([]); // Produits de la formule sélectionnée pour modification
    const [selectedProductIndex, setSelectedProductIndex] = useState(null); // Index du produit sélectionné pour édition

    // Fetch initial des données de formules
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get('http://localhost:8080/formules');
                setFormulas(response.data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, []);

    // Ajoute un produit vierge à la liste pour la nouvelle formule
    const handleAddProduct = () => {
        setProducts([...products, { product: '', quantity: 0 }]);
    };

    // Met à jour le produit à un index donné lors de la création d'une nouvelle formule
    const handleProductChange = (index, key, value) => {
        const updatedProducts = [...products];
        updatedProducts[index][key] = value;
        setProducts(updatedProducts);
    };

    // Met à jour le produit à un index donné dans la formule sélectionnée
    const handleEditableProductChange = (index, key, value) => {
        const updatedProducts = [...editableProducts];
        updatedProducts[index][key] = value;
        setEditableProducts(updatedProducts);
    };

    // Gère les changements dans les champs de nouveau produit pour l'ajout à une formule existante
    const handleNewProductChange = (key, value) => {
        setNewProduct({ ...newProduct, [key]: value });
    };

    // Soumet une nouvelle formule
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          const response = await axios.post('http://localhost:8080/formules', { name, products });
          setFormulas([...formulas, response.data]);
          alert('Formula created successfully!');
          setName('');
          setProducts([]);
      } catch (error) {
          console.error(error);
          alert('Error creating formula');
      }
  };

    // Supprime une formule
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

    // Sélectionne une formule pour modification
    const handleDetails = (formula) => {
        setSelectedFormula(formula);
        setEditableProducts(formula.products.map(prod => ({ ...prod.product, quantity: prod.quantity })));
    };

    // Ferme le popup de détails
    const handleClosePopup = () => {
        setSelectedFormula(null);
        setSelectedProductIndex(null);
    };

    // Met à jour un produit dans la formule sélectionnée
    const handleUpdateProduct = async () => {
        try {
            const updatedProducts = editableProducts.map(prod => ({ product: prod._id, quantity: prod.quantity }));
            const updatedFormula = { ...selectedFormula, products: updatedProducts };
            await axios.put(`http://localhost:8080/formules/${selectedFormula._id}`, updatedFormula);
            alert('Products updated successfully!');
            handleDetails(selectedFormula); // Refresh the selected formula details
        } catch (error) {
            console.error(error);
            alert('Error updating products');
        }
    };

    // Ajoute un nouveau produit à une formule existante
    const handleAddProductToFormula = async () => {
      try {
          const response = await axios.put(`http://localhost:8080/formules/add-product/${selectedFormula._id}`, { product: newProduct });
          handleDetails(response.data); // Update the details view with new product list
          alert('Product added successfully!');
          setNewProduct({ product: '', quantity: 0 }); // Reset new product fields
      } catch (error) {
          console.error(error);
          alert('Error adding product to formula');
      }
  };

    // Supprime un produit de la formule sélectionnée
    const handleDeleteProduct = async (index) => {
        try {
            const updatedProducts = editableProducts.filter((_, i) => i !== index);
            const updatedFormula = { ...selectedFormula, products: updatedProducts.map(p => ({ product: p._id, quantity: p.quantity })) };
            await axios.put(`http://localhost:8080/formules/${selectedFormula._id}`, updatedFormula);
            alert('Product deleted successfully!');
            handleDetails(selectedFormula); // Refresh the selected formula details
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
                            <input
                                type="text"
                                value={product.product}
                                onChange={(e) => handleProductChange(index, 'product', e.target.value)}
                                placeholder="Product name"
                                required
                            />
                            <input
                                type="number"
                                value={product.quantity}
                                onChange={(e) => handleProductChange(index, 'quantity', parseInt(e.target.value))}
                                placeholder="Quantity"
                                required
                            />
                        </div>
                    ))}
                    <button type="button" className='view-button' onClick={handleAddProduct}> + Add Product</button>
                    <button className='print-button' type="submit">Create Formula</button>
                </form>

                <h2>Formula List</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Nom formule </th>
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
                                    <th>Nom</th>
                                    <th>Quantité</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {editableProducts.map((product, index) => (
                                    <tr key={index}>
                                        <td>{product.name}</td>
                                        <td>
                                            <input
                                                type="number"
                                                value={product.quantity}
                                                onChange={(e) => handleEditableProductChange(index, 'quantity', parseInt(e.target.value))}
                                                required
                                            />
                                        </td>
                                        <td>
                                            <button onClick={() => handleUpdateProduct(index)}>Update</button>
                                            <button onClick={() => handleDeleteProduct(index)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                                <tr>
                                    <td>
                                        <input
                                            type="text"
                                            value={newProduct.product}
                                            onChange={(e) => handleNewProductChange('product', e.target.value)}
                                            placeholder="New product name"
                                            required
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            value={newProduct.quantity}
                                            onChange={(e) => handleNewProductChange('quantity', parseInt(e.target.value))}
                                            placeholder="New product quantity"
                                            required
                                        />
                                    </td>
                                    <td>
                                        <button onClick={handleAddProductToFormula}>Add Product</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <button onClick={handleClosePopup}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
