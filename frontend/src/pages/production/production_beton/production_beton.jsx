import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../../components/Main/Header';
import SidebarProduction from './SidebarProduction';
import CustomAlert from '../../../components/costumeAlert/costumeAlert';
import "./App.css";
function App() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [formules, setFormules] = useState([]);
  const [inputs, setInputs] = useState({
    codeProduction: '',
    volumeDesire: 1,
    formuleSelectionnee: '',
    description: '',
    observations: ''
  });
  const [resultats, setResultats] = useState({});
  const [alert, setAlert] = useState(null);
  const [lastCalculated, setLastCalculated] = useState({}); // To track last calculated quantities to avoid re-calculation

  useEffect(() => {
    axios.get('http://localhost:8080/formules')
      .then(response => {
        setFormules(response.data);
        if (response.data.length > 0) {
          setInputs(prevInputs => ({
            ...prevInputs,
            formuleSelectionnee: response.data[0]._id
          }));
        }
      })
      .catch(error => console.error('Erreur lors de la récupération des formules', error));
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputs(prevInputs => ({ ...prevInputs, [name]: value }));
  };

  const handleResultChange = (event) => {
    const { name, value } = event.target;
    setResultats(prevResultats => ({
      ...prevResultats,
      [name]: parseFloat(value)
    }));
  };

  const calculerQuantites = () => {
    const formula = formules.find(f => f._id === inputs.formuleSelectionnee);
    if (!formula) return;
    const newResultats = {};
    formula.products.forEach(p => {
      newResultats[p.product.name] = p.quantity * inputs.volumeDesire;
    });
    setResultats(newResultats);
    setLastCalculated(newResultats);
    showAlert("Les quantités ont été calculées avec succès.", "success");
  };

  // const recalculateVolumeBasedOnQuantities = () => {
  //   const formula = formules.find(f => f._id === inputs.formuleSelectionnee);
  //   if (!formula) return;
  //   let newVolume = 0;
  //   Object.entries(resultats).forEach(([product, quantity]) => {
  //     const baseQuantity = formula.products.find(p => p.product.name === product)?.quantity;
  //     if (baseQuantity) {
  //       const volumeContribution = quantity / baseQuantity;
  //       newVolume += volumeContribution;
  //     }
  //   });
  //   setInputs(prevInputs => ({
  //     ...prevInputs,
  //     volumeDesire: newVolume / formula.products.length // Average contribution to volume
  //   }));
  //   showAlert("Volume recalculé avec succès.", "success");
  // };

  const showAlert = (message, type) => {
    setAlert({ message, type });
  };

  const handleSubmit = () => {
    axios.post('http://localhost:8080/production_beton', {
      codeProduction: inputs.codeProduction,
      formulaId: inputs.formuleSelectionnee,
      volumeDesired: inputs.volumeDesire,
      description: inputs.description,
      observations: inputs.observations,
    })
    .then(response => {
      showAlert("La production a été enregistrée avec succès.", "success");
    })
    .catch(error => {
      const errorMessage = error.response && error.response.data ? error.response.data.message : "Une erreur s'est produite lors de l'enregistrement de la production.";
      showAlert(errorMessage, "error");
      console.error('Erreur lors de l\'enregistrement de la production', error.response || error);
    });
  };

  return (
    <div className="grid-container">
      <Header OpenSidebar={() => setOpenSidebarToggle(prev => !prev)} />
      <SidebarProduction openSidebarToggle={openSidebarToggle} OpenSidebar={() => setOpenSidebarToggle(prev => !prev)} />
      <div className='container'>
        <h1 className='title-all'>Production de Béton</h1>
        <div className="production-grid">
          <div className="production-form-1">
            <div className="form-group">
              <label>Code de production:</label>
              <input className="input-small" type="text" name="codeProduction" value={inputs.codeProduction} onChange={handleInputChange} />
              <label>Formule sélectionnée:</label>
              <select value={inputs.formuleSelectionnee} name="formuleSelectionnee" onChange={handleInputChange}>
                {formules.map(formule => (
                  <option key={formule._id} value={formule._id}>{formule.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="production-form-2">
            <div className="form-group">
              <label>Volume de béton désiré (en m³):</label>
              <input className="input-small" type="number" name="volumeDesire" value={inputs.volumeDesire} onChange={handleInputChange} step="0.1" min="0" />
            </div>
            <div className="form-group">
              <label>Observations:</label>
              <textarea className="textarea" name="observations" value={inputs.observations} onChange={handleInputChange} />
            </div>
            {/* <div className="form-group">
              <label>Description:</label>
              <textarea className="textarea" name="description" value={inputs.description} onChange={handleInputChange} />
            </div> */}
          </div>
          <div className="production-form-3">
            <div className="button-group">
              <button className="button" onClick={calculerQuantites}>Calculer les Quantités</button>
              <button className="print-button" onClick={handleSubmit}>Enregistrer la Production</button>
              {/* <button className="button-calc" onClick={recalculateVolumeBasedOnQuantities}>Recalculer Volume</button> */}
            </div>
          </div>
          <div className='quantities'>
            <h2 className='title-small'>Quantités nécessaires:</h2>
            {Object.entries(resultats).map(([key, value]) => (
              <div key={key} className="quantity-item">
                <label>{key}:</label>
                <input className="input-small" type="number" name={key} value={value.toFixed(2)} onChange={handleResultChange} step="0.1" min="0" />
              </div>
            ))}
          </div>
        </div>
        {alert && <CustomAlert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
      </div>
    </div>
  );
}

export default App;
