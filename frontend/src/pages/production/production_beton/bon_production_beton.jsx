import React, { useState, useEffect } from 'react';
import axios from 'axios';

function BonProductionForm() {

  const [clients, setClients] = useState([]);
  const [formulas, setFormulas] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedFormula, setSelectedFormula] = useState('');
  const [quantity, setQuantity] = useState('');
  const [lieuLivraison, setLieuLivraison] = useState('');
  const [heure, setHeure] = useState('');
  const [date, setDate] = useState('');
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

const fetchFormulas = async () => {
  try {
    const response = await axios.get('http://localhost:8080/Formules');
    setFormulas(response.data); // Accéder directement à response.data
  } catch (error) {
    console.error('Error fetching formulas:', error);
  }
};


    fetchClients();
    fetchFormulas();
  }, []);

  const handleAddBonProduction = () => {
    if (!selectedClient || !selectedFormula || !quantity || !heure || !lieuLivraison || !date) {
      setErrorMessage('Veuillez remplir tous les champs.');
      return;
    }

    const newBonProduction = {
      client_name: selectedClient,
      formules: [{ formula_name: selectedFormula }],
      quantite: quantity,
      lieu_livraison: lieuLivraison,
      heure: heure,
      date: date
    };

    setBonProductions([...bonProductions, newBonProduction]);
    setErrorMessage('');
  };

  const handleDelete = (index) => {
    const updatedBonProductions = [...bonProductions];
    updatedBonProductions.splice(index, 1);
    setBonProductions(updatedBonProductions);
  };

  const handleValidate = async () => {
    if (bonProductions.length === 0) {
      setErrorMessage('Veuillez ajouter au moins un bon de production.');
      return;
    }

    try {
      await axios.post('http://localhost:8080/bon_production', bonProductions);
      alert('Les données ont été enregistrées avec succès !');
    } catch (error) {
      console.error('Error saving bon productions:', error);
      alert('Une erreur est survenue lors de l\'enregistrement des données.');
    }
  };

  return (
    <div className="bon-production-form">
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
        <label>Formule:</label>
        <select value={selectedFormula} onChange={(e) => setSelectedFormula(e.target.value)}>
          <option value="">Sélectionnez une formule</option>
          {formulas && formulas.map(formula => (
            <option key={formula._id} value={formula.name}>{formula.name}</option>
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
        <label>Date:</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
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
            <th>Formule</th>
            <th>Quantité</th>
            <th>Date</th>
            <th>Heure</th>
            <th>Lieu de livraison</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {bonProductions.map((bonProduction, index) => (
            <tr key={index}>
              <td>{bonProduction.client_name}</td>
              <td>{bonProduction.formules[0].formula_name}</td>
              <td>{bonProduction.quantite}</td>
              <td>{bonProduction.date}</td>
              <td>{bonProduction.heure}</td>
              <td>{bonProduction.lieu_livraison}</td>
              <td>
                <button className='delete-button' onClick={() => handleDelete(index)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleValidate}>Valider</button>
    </div>
  );
}

export default BonProductionForm;