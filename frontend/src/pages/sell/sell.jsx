import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Appsell.css';
import Sidebar from '../../components/Main/Sidebar';
import Header from '../../components/Main/Header';
import ReactToPrint from 'react-to-print';
import CustomAlert from '../../components/costumeAlert/costumeAlert'; 

const OrderForm = () => {
  const [clientId, setClientId] = useState('');
  const [clientName, setClientName] = useState('');
  const [date, setDate] = useState('');
  const [productId, setProductId] = useState('');
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [unitPrice, setUnitPrice] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [orders, setOrders] = useState([]);
  const [clientLocked, setClientLocked] = useState(false);
  const [total, setTotal] = useState(0);
  const [products, setProducts] = useState([]);
  const [clients, setClients] = useState([]);
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [alert, setAlert] = useState(null);
  const [remainingQuantity, setRemainingQuantity] = useState(0);

  const openSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/products');
      setProducts(response.data.data);
    } catch (error) {
      console.error('Error:', error);
      showAlert('Une erreur s\'est produite lors de la récupération des produits. Veuillez réessayer plus tard.', 'error');
    }
  };

  const fetchClients = async () => {
    try {
      const response = await axios.get('http://localhost:8080/clients');
      setClients(response.data.data);
    } catch (error) {
      console.error('Error:', error);
      showAlert('Une erreur s\'est produite lors de la récupération des clients. Veuillez réessayer plus tard.', 'error');
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchClients();
  }, []);

  useEffect(() => {
    setSubtotal(quantity * unitPrice);
  }, [quantity, unitPrice]);

  useEffect(() => {
    if (productId) {
      const selectedProduct = products.find((prod) => prod._id === productId);
      if (selectedProduct) {
        setRemainingQuantity(selectedProduct.quantity);
      }
    }
  }, [productId, products]);

  const showAlert = (message, type) => {
    setAlert({ message, type });
  };

  const saveOrder = async () => {
    if (!clientName || !date || !productName || !description || !quantity || !unitPrice) {
      showAlert('Veuillez remplir tous les champs requis.', 'error');
      return;
    }
    const selectedProduct = products.find((prod) => prod._id === productId);
    if (!selectedProduct) {
      showAlert('Produit invalide.', 'error');
      return;
    }
    if (quantity > selectedProduct.quantity) {
      showAlert('La quantité demandée est supérieure à la quantité disponible en stock.', 'error');
      return;
    }
    const formData = {
      client: clientId,
      nameclient: clientName,
      date,
      product: productId,
      nameproduct: productName,
      description,
      quantity,
      unitPrice,
      subtotal: subtotal
    };
    try {
      const response = await axios.post('http://localhost:8080/sells', formData);
      if (response.status === 201) {
        showAlert('Commande créée avec succès.', 'success');
        setOrders([...orders, formData]);
        setTotal(total + formData.subtotal);
        const updatedProducts = products.map((prod) => {
          if (prod._id === productId) {
            const updatedQuantity = prod.quantity - parseInt(quantity);
            axios.put(`http://localhost:8080/products/${productId}`, { quantity: updatedQuantity });
            return { ...prod, quantity: updatedQuantity };
          }
          return prod;
        });
        setProducts(updatedProducts);
        setClientLocked(true);
      } else {
        showAlert(response.data.message || 'Une erreur s\'est produite lors de la création de la commande.', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showAlert('Une erreur s\'est produite lors de la création de la commande. Veuillez réessayer plus tard.', 'error');
    }
  };

  const resetFormFields = () => {
    setClientId('');
    setClientName('');
    setDate('');
    setProductId('');
    setProductName('');
    setDescription('');
    setQuantity(0);
    setUnitPrice(0);
    setSubtotal(0);
  };

  useEffect(() => {
    if (clientId) {
      const selectedClient = clients.find((cl) => cl._id === clientId);
      setClientName(selectedClient.name);
    }
    if (productId) {
      const selectedProduct = products.find((prod) => prod._id === productId);
      setProductName(selectedProduct.name);
    }
  }, [clientId, productId, clients, products]);

  return (
    <div className="grid-container">
      <Header openSidebar={openSidebar} />
      <Sidebar openSidebarToggle={openSidebarToggle} openSidebar={openSidebar} />
      <div className="order-form-container" id="orderFormContainer">
        <h1 className="form-title">Commande de vente</h1>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="client">Client:</label>
            <select
              id="client"
              value={clientId}
              onChange={(e) => {
                setClientId(e.target.value);
                if (!clientLocked) {
                  setClientLocked(true);
                }
              }}
              disabled={clientLocked}
            >
              <option value="">Sélectionner le client</option>
              {clients.map((cl) => (
                <option key={cl._id} value={cl._id}>{cl.name}</option>
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
            <label htmlFor="product">Produit:</label>
            <select
              id="product"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
            >
              <option value="">Sélectionner le produit</option>
              {products.map((prod) => (
                <option key={prod._id} value={prod._id}>{prod.name}</option>
              ))}
            </select>
            {productId && (
              <p className="remaining-quantity">Quantité restante en stock : {remainingQuantity}</p>
            )}
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
            <input type="text" id="subtotal" value={subtotal} readOnly />
          </div>
        </div>
        <div className="order-table-container">
          <table>
            <thead>
              <tr>
                <th>Client ID</th>
                <th>Client</th>
                <th>Date</th>
                <th>Produit ID</th>
                <th>Produit</th>
                <th>Description</th>
                <th>Quantité</th>
                <th>Prix unitaire</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={index}>
                  <td>{order.client}</td>
                  <td>{order.nameclient}</td>
                  <td>{order.date}</td>
                  <td>{order.product}</td>
                  <td>{order.nameproduct}</td>
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
          <button type="button" className="save-button" onClick={saveOrder}>Enregistrer</button>
          <ReactToPrint
            trigger={() => <button type="button" className="print-button">Imprimer</button>}
            content={() => document.getElementById('orderFormContainer')}
          />
        </div>
        {alert && <CustomAlert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
      </div>
    </div>
  );
};

export default OrderForm;
