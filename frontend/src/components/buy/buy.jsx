import React, { useState } from 'react';
import './Appbuy.css';
import Sidebar from '../Main/Sidebar';
import Header from '../Main/Header';
import ReactToPrint from 'react-to-print';

const OrderForm = () => {
  const [customer, setCustomer] = useState('');
  const [date, setDate] = useState('');
  const [product, setProduct] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [unitPrice, setUnitPrice] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [orders, setOrders] = useState([]);
  const [customerLocked, setCustomerLocked] = useState(false);
  const [total, setTotal] = useState(0); // Total state

  // Function to calculate subtotal
  const calculateSubtotal = () => {
    setSubtotal(quantity * unitPrice);
  };

  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  const handleSidebarItemClick = (content) => {
    setSelectedContent(content); // Correction: la variable "selectedContent" n'est pas définie
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const order = {
      customer,
      date,
      product,
      description,
      quantity,
      unitPrice,
      subtotal
    };
    setOrders([...orders, order]);
    setTotal(total + subtotal); // Update total
    // Clear form fields after submission
    setProduct('');
    setDescription('');
    setQuantity(0);
    setUnitPrice(0);
    setSubtotal(0);
    setCustomerLocked(true); // Lock customer after adding first order
  };

  // Function to handle adding a new order row
  const handleAddOrderRow = () => {
    const newSubtotal = quantity * unitPrice;
    const newOrder = {
      customer,
      date,
      product,
      description,
      quantity,
      unitPrice,
      subtotal: newSubtotal // Use the newly calculated subtotal
    };
    setOrders([...orders, newOrder]);
    setTotal(total + newSubtotal); // Update total
    // Clear form fields after adding a new row
    setProduct('');
    setDescription('');
    setQuantity(0);
    setUnitPrice(0);
    setCustomerLocked(true); // Lock customer after adding first order
  };

  return (
    <div className="grid-container">
      <Header OpenSidebar={OpenSidebar}/>
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} handleItemClick={handleSidebarItemClick}/>
      <div className="order-form-container" id="orderFormContainer"> {/* Add id to the container */}
        <h1 className="form-title">Commande d'Achat</h1>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="customer">Client:</label>
            <select
              id="customer"
              value={customer}
              onChange={(e) => {
                setCustomer(e.target.value);
                if (!customerLocked) {
                  setCustomerLocked(true);
                }
              }}
              disabled={customerLocked}
            >
              <option value="">Sélectionner le client</option>
              <option value="Client 1">Client 1</option>
              <option value="Client 2">Client 2</option>
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
            <select id="product" value={product} onChange={(e) => setProduct(e.target.value)}>
              <option value="">Sélectionner le produit</option>
              <option value="Produit 1">Produit 1</option>
              <option value="Produit 2">Produit 2</option>
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
            <input type="text" id="subtotal" value={subtotal} readOnly />
          </div>
          <div className="form-group">
            <button type="button" onClick={handleAddOrderRow}>Ajouter</button>
          </div>
        </div>
        <div className="order-table-container">
          <table>
            <thead>
              <tr>
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
          <ReactToPrint
            trigger={() => <button type="button" className="print-button">Imprimer</button>}
            content={() => document.getElementById('orderFormContainer')}
          />
        </div>
      </div>
    </div>
  );
};

export default OrderForm;
