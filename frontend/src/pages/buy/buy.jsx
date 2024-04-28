import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Appbuy.css';
import Sidebar from '../../components/Main/Sidebar';
import Header from '../../components/Main/Header';
import ReactToPrint from 'react-to-print';
import CustomAlert from '../../components/costumeAlert/costumeAlert'; // Import du composant CustomAlert



const OrderForm = () => {
  const [providerId, setProviderId] = useState('');
  const [providerName, setProviderName] = useState('');
  const [date, setDate] = useState('');
  const [productId, setProductId] = useState('');
  const [productName, setProductName] = useState('');
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
  const [alert, setAlert] = useState(null); // Ajout de l'état pour l'alerte

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

  const fetchProviders = async () => {
    try {
      const response = await axios.get('http://localhost:8080/providers');
      setProviders(response.data.data);
    } catch (error) {
      console.error('Error:', error);
      showAlert('Une erreur s\'est produite lors de la récupération des fournisseurs. Veuillez réessayer plus tard.', 'error');
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchProviders();
  }, []);

  useEffect(() => {
    setSubtotal(quantity * unitPrice);
  }, [quantity, unitPrice]);

  const showAlert = (message, type) => {
    setAlert({ message, type });
  };

  const saveOrder = async () => {
    if (!providerName || !date || !productName || !description || !quantity || !unitPrice) {
      showAlert('Veuillez remplir tous les champs requis.', 'error');
      return;
    }
    const formData = {
      provider: providerId,
      nameprovider: providerName,
      date,
      product: productId,
      nameproduct: productName,
      description,
      quantity,
      unitPrice,
      subtotal
    };
    try {
      const response = await axios.post('http://localhost:8080/orders', formData);
      if (response.status === 201) {
        showAlert('Commande créée avec succès.', 'success');
        setOrders([...orders, formData]);
        setTotal(total + formData.subtotal);
        const updatedProducts = products.map((prod) => {
          if (prod._id === productId) {
            const updatedQuantity = prod.quantity + parseInt(quantity);
            // Mise à jour de la quantité dans la base de données
            axios.put(`http://localhost:8080/products/${productId}`, { quantity: updatedQuantity });
            return { ...prod, quantity: updatedQuantity };
          }
          return prod;
        });
        setProducts(updatedProducts);
        setProviderLocked(true);
        // Ne réinitialisez pas les champs du formulaire ici
        // resetFormFields();
      } else {
        showAlert(response.data.message || 'Une erreur s\'est produite lors de la création de la commande.', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showAlert('Une erreur s\'est produite lors de la création de la commande. Veuillez réessayer plus tard.', 'error');
    }
  };

  const resetFormFields = () => {
    setProviderId('');
    setProviderName('');
    setDate('');
    setProductId('');
    setProductName('');
    setDescription('');
    setQuantity(0);
    setUnitPrice(0);
    setSubtotal(0);
  };

  // Définir les valeurs des champs du formulaire avec les IDs sélectionnés sans les afficher à l'écran
  useEffect(() => {
    if (providerId) {
      const selectedProvider = providers.find((prov) => prov._id === providerId);
      setProviderName(selectedProvider.name);
    }
    if (productId) {
      const selectedProduct = products.find((prod) => prod._id === productId);
      setProductName(selectedProduct.name);
    }
  }, [providerId, productId, providers, products]);

  return (
    <div className="grid-container">
      <Header openSidebar={openSidebar} />
      <Sidebar openSidebarToggle={openSidebarToggle} openSidebar={openSidebar} />
      <div className="order-form-container" id="orderFormContainer">
        <h1 className="form-title">Commande d'Achat</h1>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="provider">Fournisseur:</label>
            <select
              id="provider"
              value={providerId}
              onChange={(e) => {
                setProviderId(e.target.value);
                if (!providerLocked) {
                  setProviderLocked(true);
                }
              }}
              disabled={providerLocked}>
              <option value="">Sélectionner le fournisseur</option>
              {providers.map((prov) => (
                <option key={prov._id} value={prov._id}>{prov.name}</option>
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
                <th>Fournisseur ID</th>
                <th>Fournisseur</th>
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
                  <td>{order.provider}</td>
                  <td>{order.nameprovider}</td>
                  <td>{order.date}</td>
                  <td>{order.product}</td>
                  <td>{order.nameproduct}</td>
                  <td>{order.description}</td>
                  <td>{order.quantity}</td>
                  <td>{order.unitPrice}</td>
                  <td>{order.subtotal},00 DA</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="total-container">
          <p>Total: {total} ,00 DA</p>
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
    // </div>
  );
};

export default OrderForm;
/*effefjdfbdbdejfdefdf*df*df*dfdf*df*d*fd*f*d*df*d*fd/fdfd*fd*f*df*df/df/d/fd/f/df/d
*dffdfdfdfd c'est regler la quantite les ids ne safiche pas la quantite de produit selectioner ce mis ajour automatiquement *
et aussi voila */