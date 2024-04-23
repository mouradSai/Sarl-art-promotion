import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Appbuy.css';
import Sidebar from '../Main/Sidebar';
import Header from '../Main/Header';
import ReactToPrint from 'react-to-print';



const OrderForm = () => {
  const [provider, setProvider] = useState('');
  const [date, setDate] = useState('');
  const [product, setProduct] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [unitPrice, setUnitPrice] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [orders, setOrders] = useState([]);
  const [providerLocked, setProviderLocked] = useState(false);
  const [total, setTotal] = useState(0);
  const [products, setProducts] = useState([]);
  const [providers, setProviders] = useState([]);
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  const handleSidebarItemClick = (content) => {
    setSelectedContent(content);
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/products');
      setProducts(response.data.data);
    } catch (error) {
      console.error('Error:', error);
      showAlert('An error occurred while fetching products. Please try again later.');
    }
  };

  const fetchProviders = async () => {
    try {
      const response = await axios.get('http://localhost:8080/providers');
      setProviders(response.data.data);
    } catch (error) {
      console.error('Error:', error);
      showAlert('An error occurred while fetching providers. Please try again later.');
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchProviders();
  }, []);

  const showAlert = (message) => {
    alert(message);
  };

  const calculateSubtotal = () => {
    setSubtotal(quantity * unitPrice);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!provider || !date || !product || !description || !quantity || !unitPrice) {
      showAlert('Please fill in all required fields.');
      return;
    }

    const order = {
      provider,
      date,
      product,
      description,
      quantity,
      unitPrice,
      subtotal
    };

    // Vérifier si le fournisseur est déjà dans les commandes
    const existingOrderWithSameProvider = orders.find((ord) => ord.provider === provider);
    if (existingOrderWithSameProvider) {
      showAlert('You cannot add another order with a different provider.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/orders', order);
      if (response.status === 201) {
        showAlert('Order created successfully.');
        setOrders([...orders, order]);
        setTotal(total + subtotal);
        // Clear form fields after submission
        resetFormFields();
        setProviderLocked(true);
      } else {
        showAlert(response.data.message || 'An error occurred while creating the order.');
      }
    } catch (error) {
      console.error('Error:', error);
      showAlert('An error occurred while creating the order. Please try again later.');
    }
  };

  const resetFormFields = () => {
    setProvider('');
    setDate('');
    setProduct('');
    setDescription('');
    setQuantity(0);
    setUnitPrice(0);
    setSubtotal(0);
  };

  return (
    <div className="grid-container">
      <Header OpenSidebar={OpenSidebar} />
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} handleItemClick={handleSidebarItemClick} />
      <div className="order-form-container" id="orderFormContainer">
        <h1 className="form-title">Commande d'Achat</h1>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="provider">Fournisseur ID:</label>
            <select
              id="provider"
              value={provider}
              onChange={(e) => {
                setProvider(e.target.value);
                if (!providerLocked) {
                  setProviderLocked(true);
                }
              }}
              disabled={providerLocked}
            >
              <option value="">Sélectionner le fournisseur</option>
              {providers.map((prov) => (
                <option key={prov.id} value={prov._id}>{prov._id}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="date">Date:</label>
            <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="product">Produit ID:</label>
            <select id="product" value={product} onChange={(e) => setProduct(e.target.value)}>
              <option value="">Sélectionner le produit</option>
              {products.map((prod) => (
                <option key={prod.id} value={prod._id}>{prod._id}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <input type="text" id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="quantity">Quantité:</label>
            <input type="number" id="quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="unitPrice">Prix unitaire:</label>
            <input type="number" id="unitPrice" value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="subtotal">Total:</label>
            <input type="text" id="subtotal" value={subtotal} onChange={(e) => setSubtotal(e.target.value)} />
          </div>
        </div>
        <div className="order-table-container">
          <table>
            <thead>
              <tr>
                <th>Fournisseur ID</th>
                <th>Date</th>
                <th>Produit ID</th>
                <th>Description</th>
                <th>Quantité</th>
                <th>Prix unitaire</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={index}>
                  <td>{order.provider}</td>
                  <td>{order.date}</td>
                  <td>{order.product}</td>
                  <td>{order.description}</td>
                  <td>{order.quantity}</td>
                  <td>{order.unitPrice}</td>
                  <td>{order.subtotal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="total-container">
          <p>Total: {total}</p>
        </div>
        <div className="form-group">
          <button type="button" className="save-button" onClick={handleSubmit}>Enregistrer</button>
          <ReactToPrint
            trigger={() => <button type="button" className="print-button">Imprimer</button>}
            content={() => document.getElementById('orderFormContainer')}
          />
        </div>
      </div>
    </div>
    // </div>
  );
};

export default OrderForm;
