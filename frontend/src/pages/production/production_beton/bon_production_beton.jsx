import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../production_beton/SidebarProduction';
import Header from '../../../components/Main/Header';
import CustomAlert from '../../../components/costumeAlert/costumeAlert';

function BonProductionForm() {

  const [clients, setClients] = useState([]);
  const [formulas, setFormulas] = useState([]);
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedFormula, setSelectedFormula] = useState('');
  const [quantity, setQuantity] = useState('');
  const [codeBon, setCodeBon] = useState('');
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
    if (!selectedClient || !selectedFormula || !quantity || !heure || !lieuLivraison || !date || !codeBon) {
      setErrorMessage('Veuillez remplir tous les champs.');
      return;
    }

    const newBonProduction = {
      client_name: selectedClient,
      formules: [{ formula_name: selectedFormula }],
      quantite: quantity,
      code_Bon: codeBon, // Utilisez la valeur de codeBon mise à jour ici
      lieu_livraison: lieuLivraison,
      heure: heure,
      date: date
    };

    setBonProductions([...bonProductions, newBonProduction]);
    setCodeBon(''); // Réinitialisez la valeur de codeBon après l'ajout
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
      // Construire les données à envoyer
      const dataToSend = {
        code_bon: bonProductions[0].code_Bon, // Remplacez 'VotreValeur' par la valeur appropriée
        client_name: bonProductions[0].client_name, // Vous pouvez ajuster cela si nécessaire
        formules: bonProductions.map(bonProduction => bonProduction.formules[0]), // Formules sous forme de tableau
        quantite: bonProductions[0].quantite, // Vous pouvez ajuster cela si nécessaire
        lieu_livraison: bonProductions[0].lieu_livraison, // Vous pouvez ajuster cela si nécessaire
        heure: bonProductions[0].heure, // Vous pouvez ajuster cela si nécessaire
        date: bonProductions[0].date // Vous pouvez ajuster cela si nécessaire
      };
  
      // Envoyer les données au backend
      await axios.post('http://localhost:8080/bon_production', dataToSend);
      alert('Les données ont été enregistrées avec succès !');
    } catch (error) {
      console.error('Error saving bon productions:', error);
      alert('Une erreur est survenue lors de l\'enregistrement des données.');
    }
  };
  

  return (

    <div className="grid-container">
    <Header OpenSidebar={() => setOpenSidebarToggle(!openSidebarToggle)} />
    <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={() => setOpenSidebarToggle(!openSidebarToggle)} />
    <div className='container'>
    <div className="bon-production-form">
      <h1 className="title-all"> Bon de Production</h1>
      <div className="form-container">
        <div className='bloc'>
          <div className='bloc1'>

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
        <label>Code du bon:</label>
        <input placeholder="Code de bon" type="text" value={codeBon} onChange={(e) => setCodeBon(e.target.value)} />
      </div>

      <div>
        <label>Quantité:</label>
        <input placeholder="Quantité" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
      </div>

      </div> 

      <div className='bloc2'>

      <div className='datebon'>
        <label>Date:</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      <div>

      <div>
        <label>Heure:</label>
        <input type="text" value={heure} onChange={(e) => setHeure(e.target.value)} />
      </div>

        <label>Lieu de livraison:</label>
        <input type="text" value={lieuLivraison} onChange={(e) => setLieuLivraison(e.target.value)} />
      </div>

      </div> 
      </div> 
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
      <button className='print-button' onClick={handleValidate}>Valider</button>
    </div>
  </div>
 </div>
  );
}

export default BonProductionForm;