import React, { useState, useEffect } from 'react';
import axios from 'axios';

function BonProductionForm() {
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState('');
  const [heure, setHeure] = useState('');
  const [lieuLivraison, setLieuLivraison] = useState('');
  const [bonProductions, setBonProductions] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchClients = async () => {
        try {
            const response = await axios.get('http://localhost:8080/clients', {
                params: {
                    IsActive: true
                }
            });
            setClients(response.data.data);
        } catch (error) {
            console.error('Error fetching clients:', error);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:8080/products', {
                params: {
                    IsActive: true
                }
            });
            setProducts(response.data.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };
    
    fetchClients();
    fetchProducts();
  }, []);

  const handleAddBonProduction = () => {
    if (!selectedClient || !selectedProduct || !quantity || !heure || !lieuLivraison) {
      setErrorMessage('Veuillez remplir tous les champs.');
      return;
    }

    const newBonProduction = {
      client: selectedClient,
      produit: selectedProduct,
      quantite: quantity,
      heure: heure,
      lieuLivraison: lieuLivraison
    };

    setBonProductions([...bonProductions, newBonProduction]);
    setErrorMessage('');
  };

  const handleValidate = async () => {
    if (bonProductions.length === 0) {
      setErrorMessage('Veuillez ajouter au moins une ligne de bon de production.');
      return;
    }

    try {
      await axios.post('http://localhost:8080/bon_production', bonProductions);
      alert('Les données ont été enregistrées avec succès !');
      setBonProductions([]); // Effacer les bonnes productions après la soumission réussie
    } catch (error) {
      console.error('Error saving bon productions:', error);
      alert('Une erreur est survenue lors de l\'enregistrement des données.');
    }
  };

  return (
    <div>
      <h2>Formulaire de Bon de Production</h2>
      <div>
        <label>Client:</label>
        <select value={selectedClient} onChange={(e) => setSelectedClient(e.target.value)}>
          <option value="">Sélectionnez un client</option>
          {clients.map(client => (
            <option key={client._id} value={client.name}>{client.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Produit:</label>
        <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)}>
          <option value="">Sélectionnez un produit</option>
          {products.map(product => (
            <option key={product._id} value={product.name}>{product.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Quantité:</label>
        <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
      </div>
      <div>
        <label>Heure:</label>
        <input type="text" value={heure} onChange={(e) => setHeure(e.target.value)} />
      </div>
      <div>
        <label>Lieu de livraison:</label>
        <input type="text" value={lieuLivraison} onChange={(e) => setLieuLivraison(e.target.value)} />
      </div>
      <button onClick={handleAddBonProduction}>Ajouter Bon de Production</button>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <h2>Bons de Production</h2>
      <table>
        <thead>
          <tr>
            <th>Client</th>
            <th>Produit</th>
            <th>Quantité</th>
            <th>Heure</th>
            <th>Lieu de livraison</th>
          </tr>
        </thead>
        <tbody>
          {bonProductions.map((bonProduction, index) => (
            <tr key={index}>
              <td>{bonProduction.client}</td>
              <td>{bonProduction.produit}</td>
              <td>{bonProduction.quantite}</td>
              <td>{bonProduction.heure}</td>
              <td>{bonProduction.lieuLivraison}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleValidate}>Valider</button>
    </div>
  );
}

export default BonProductionForm;
