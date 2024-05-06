// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Header from '../../components/Main/Header';
// import SidebarProduction from './SidebarProduction';
// import CustomAlert from '../../components/costumeAlert/costumeAlert';




// function App() {
//     const [productName, setProductName] = useState('');
//     const [quantity, setQuantity] = useState('');
//     const [codeCommande, setCodeCommande] = useState('');
//     const [observation_com, setObservationCom] = useState('');
//     const [providerName, setProviderName] = useState('');
//     const [commandes, setCommandes] = useState([]);
//     const [showPopup, setShowPopup] = useState(false);
//     const [date, setDate] = useState('');
//     const [products, setProducts] = useState([]);
//     const [providers, setProviders] = useState([]);
//     const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
//     const [alert, setAlert] = useState(null); // Ajout de l'état pour l'alerte
//     const [isProviderDisabled, setIsProviderDisabled] = useState(false); // Ajout de l'état pour désactiver la sélection du fournisseur

//     useEffect(() => {
//         const fetchProviders = async () => {
//             try {
//                 const response = await axios.get('http://localhost:8080/providers', {
//                     params: {
//                         IsActive: true
//                     }
//                 });
//                 setProviders(response.data.data);
//             } catch (error) {
//                 console.error('Error fetching providers:', error);
//             }
//         };

//         const fetchProducts = async () => {
//             try {
//                 const response = await axios.get('http://localhost:8080/products', {
//                     params: {
//                         IsActive: true
//                     }
//                 });
//                 setProducts(response.data.data);
//             } catch (error) {
//                 console.error('Error fetching products:', error);
//             }
//         };

//         fetchProviders();
//         fetchProducts();
//     }, []);

//     const handleAddProduct = () => {
//         if (!productName || !quantity || !providerName || !codeCommande) {
//             showAlert('Veuillez remplir tous les champs du produit, du fournisseur et du code de commande.');
//             return;
//         }

//         const newProduct = {
//             product_name: productName,
//             quantity: parseInt(quantity, 10)
//         };

//         setCommandes([...commandes, newProduct]);
//         setProductName('');
//         setQuantity('');
        
//         // Désactiver la sélection du fournisseur après l'ajout du premier enregistrement
//         setIsProviderDisabled(true);
//     };

//     const handleFinalizeOrder = async () => {
//         if (commandes.length === 0 || !codeCommande || !providerName) {
//             showAlert('Veuillez ajouter des produits et remplir tous les champs de commande.');
//             return;
//         }

//         try {
//             const response = await axios.post('http://localhost:8080/commandes', {
//                 code_commande: codeCommande,
//                 provider_name: providerName,
//                 date_commande: date, // Ajouté pour correspondre au champ attendu
//                 observation: observation_com,
//                 produits: commandes
//             });

//             showAlert('Commande finalisée avec succès : ' + response.data.code_commande);
//             setCommandes([]);
//             setCodeCommande('');
//             setObservationCom('');
//             setProviderName('');
//             setShowPopup(false);
            
//             // Réactiver la sélection du fournisseur après la finalisation de la commande
//             setIsProviderDisabled(false);
//         } catch (error) {
//             console.error('Erreur complète:', error);
//             showAlert('Erreur lors de la finalisation de la commande : ' + (error.response ? error.response.data.message : error.message));
//         }
//     };

//     const handleValidateOrder = () => {
//         setShowPopup(true);
//         setDate(new Date().toISOString().slice(0, 10)); // Format de la date YYYY-MM-DD
//     };

//     const showAlert = (message, type) => {
//         setAlert({ message, type });
//     };
//     const handleGeneratePDF = async () => {
//         if (commandes.length === 0) {
//             showAlert('Veuillez ajouter des produits à la commande.');
//             return;
//         }
//         if (!codeCommande) {
//             showAlert('Veuillez entrer un code de commande.');
//             return;
//         }
//         if (!providerName) {
//             showAlert('Veuillez entrer le nom du fournisseur.');
//             return;
//         }
    
//         const orderDetails = {
//             providerName,
//             codeCommande,
//             date: new Date().toISOString().slice(0, 10),
//             observation_com,
//             commandes
//         };
    
//         try {
//             const response = await fetch('http://localhost:8080/generatePdfcommande', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(orderDetails)
//             });
    
//             if (!response.ok) {
//                 throw new Error(`Erreur lors de la génération du PDF: ${response.statusText}`);
//             }
    
//             const blob = await response.blob();
//             const url = window.URL.createObjectURL(blob);
//             const link = document.createElement('a');
//             link.href = url;
//             link.setAttribute('download', `bon-de-commande-${codeCommande}.pdf`);
//             document.body.appendChild(link);
//             link.click();
//             document.body.removeChild(link);
//         } catch (error) {
//             console.error('Erreur lors de la génération du PDF :', error);
//             showAlert('Erreur lors de la génération du PDF. Veuillez réessayer plus tard.');
//         }
//     };
    
// //suppression d'une ligne d'enregestrement tableau
// const handleDelete = (index) => {
//     // Crée un nouveau tableau en filtrant l'élément à l'index spécifié
//     const newCommandes = commandes.filter((item, i) => i !== index);
//     setCommandes(newCommandes);
// };


    
//     return (
        
//         <div className="grid-container">
//             <Header OpenSidebar={() => setOpenSidebarToggle(!openSidebarToggle)} />
//             <SidebarProduction openSidebarToggle={openSidebarToggle} OpenSidebar={() => setOpenSidebarToggle(!openSidebarToggle)} />


//             <div className='container'>
//              <h1 className="title-all">Production</h1>
//                 <div className="form-container">
//                 <div className='bloc'>
//                     <div className='bloc1'>

//                         <select value={productName} onChange={(e) => setProductName(e.target.value)}>
//                             <option value="">Sélectionnez un produit</option>
//                             {products.map(product => (
//                                 <option key={product.id} value={product.name}>{product.name}</option>
//                             ))}
//                         </select>
//                         <input type="text"  placeholder="Gravier 8/15" />
//                         <input type="text"  placeholder="Gravier 15/25" />
//                         <input type="text"  placeholder="Sable 04" />
//                         <input type="text"  placeholder="BOUSSAADA" />
//                         <input type="text"  placeholder="Ciment" />
//                         <input type="text"  placeholder="Adjuvant" />
//                         <input type="text"  placeholder="Eau" />
//                     </div>

//                     <div className='bloc2'>
//                         <select value={productName} onChange={(e) => setProductName(e.target.value)}>
//                             <option value="">Sélectionnez un produit</option>
//                             {products.map(product => (
//                                 <option key={product.id} value={product.name}>{product.name}</option>
//                             ))}
//                         </select>
//                         <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="Quantité" />
//                         </div>
//                 </div>

//                     <div className='bloc3'>
//                         <button onClick={handleAddProduct}>+ Ajouter Produit</button>
//                     </div>

//                 </div>
//                 {showPopup && (
//                     <div className="popup">
//                         <h2>Informations de Commande</h2>
//                         <p>Fournisseur: {providerName}</p>
//                         <p>Code de Commande: {codeCommande}</p>
//                         <p>Date :{date}</p>
//                         <p>Observation :{observation_com}</p>
//                         <h3>Produits ajoutés :</h3>
//                         <table>
//                             <thead className="table-header">
//                                 <tr>
//                                     <th>Produit</th>
//                                     <th>Quantité</th>                               
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {commandes.map((item, index) => (
//                                     <tr key={index}>
//                                         <td>{item.product_name}</td>
//                                         <td>{item.quantity}</td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                         <button className='delete-button' onClick={() => setShowPopup(false)}>Fermer</button>
//                         <button className='print-button' onClick={handleFinalizeOrder}>Finaliser la Production</button>
//                         <button className='pdf-button' onClick={handleGeneratePDF}>Télécharger PDF</button>

//                     </div>
//                 )}
//                 <div>
//                     <h2>Produits ajoutés :</h2>
//                     <table>
//                         <thead>
//                             <tr>
//                                 <th>Produit</th>
//                                 <th>Quantité</th>
//                                 <th>Action</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {commandes.map((item, index) => (
//                                 <tr key={index}>
//                                     <td>{item.product_name}</td>
//                                     <td>{item.quantity}</td>
//                                     <td>
//                                  <button className='delete-button' onClick={() => handleDelete(index)}>Supprimer</button>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                     <button className='print-button' onClick={handleValidateOrder}>Valider</button>
//                 </div>
//                 {alert && <CustomAlert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
//             </div>
//         </div>
//     );
// }

// export default App;
import React, { useState } from 'react';

function App() {
  const formules = {
    formule1: {
      gravier_15_25: 360,
      gravier_8_15: 640,
      sable_0_4: 700,
      sable_0_1: 160,
      ciment: 350,
      eau: 160,
      adjuvant: 3.5
    },
    formule2: {
      gravier_15_25: 390,
      gravier_8_15: 670,
      sable_0_4: 830,
      sable_0_1: 190,
      ciment: 150,
      eau: 75,
      adjuvant: 0  // Assuming no adjuvant in formula 2 for simplicity, set to zero
    }
  };

  const [inputs, setInputs] = useState({
    volumeDesire: 1,
    formuleSelectionnee: 'formule1'
  });

  const [resultats, setResultats] = useState({
    gravier_15_25: 0,
    gravier_8_15: 0,
    sable_0_4: 0,
    sable_0_1: 0,
    ciment: 0,
    eau: 0,
    adjuvant: 0
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputs(prevState => ({
      ...prevState,
      [name]: parseFloat(value)
    }));
  };

  const handleResultChange = (event) => {
    const { name, value } = event.target;
    setResultats(prevState => ({
      ...prevState,
      [name]: parseFloat(value)
    }));
  };

  const calculerQuantites = () => {
    const { volumeDesire, formuleSelectionnee } = inputs;
    const proportions = formules[formuleSelectionnee];
    const resultatsCalculés = Object.fromEntries(
      Object.entries(proportions).map(([key, val]) => [key, val * volumeDesire])
    );
    setResultats(resultatsCalculés);
  };

  const recalculerVolume = () => {
    const { formuleSelectionnee } = inputs;
    const proportions = formules[formuleSelectionnee];
    const totalVolume = Object.entries(resultats).reduce((acc, [key, value]) => {
      return acc + (value / proportions[key]);
    }, 0) / Object.keys(resultats).length;  // Moyenne des volumes pour chaque matériau
    setInputs(prevState => ({
      ...prevState,
      volumeDesire: totalVolume
    }));
  };

  return (
    <div className="App">
      <h1>Calculateur de Matériaux pour Béton</h1>
      <form>
        <div>
          <label>
            Choisissez une formule :
            <select
              name="formuleSelectionnee"
              value={inputs.formuleSelectionnee}
              onChange={handleInputChange}
            >
              <option value="formule1">Formule 1</option>
              <option value="formule2">Formule 2</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            Volume de béton désiré (en m³) :
            <input
              type="number"
              name="volumeDesire"
              value={inputs.volumeDesire}
              onChange={handleInputChange}
              step="0.1"
              min="0"
            />
          </label>
        </div>
      </form>
      <button onClick={calculerQuantites}>
        Calculer les Quantités de Matériaux
      </button>
      <h2>Quantités nécessaires selon la {inputs.formuleSelectionnee === 'formule1' ? 'Formule 1' : 'Formule 2'}:</h2>
      <form>
        {Object.entries(resultats).map(([key, value]) => (
          <div key={key}>
            <label>
              {key.replace(/_/g, ' ')} (en kg, sauf eau en litres):
              <input
                type="number"
                name={key}
                value={value}
                onChange={handleResultChange}
                step="0.1"
                min="0"
              />
            </label>
          </div>
        ))}
      </form>
      <button onClick={recalculerVolume}>
        Recalculer le Volume de Béton Basé sur les Quantités Modifiées
      </button>
    </div>
  );
}

export default App;
