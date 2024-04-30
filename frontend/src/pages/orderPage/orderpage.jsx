import React, { useState ,useEffect} from 'react';
import axios from 'axios';
import './App.css';
import Sidebar from '../../components/Main/Sidebar';
import Header from '../../components/Main/Header';

function App() {
   
    const [product, setProduct] = useState('');
    const [quantity, setQuantity] = useState('');
    const [codeCommande, setCodeCommande] = useState('');
    const [observation_com, setobservation_com] =useState('');
    const [providerId, setProviderId] = useState('');
    const [commandes, setCommandes] = useState([]);
    const [firstProductAdded, setFirstProductAdded] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [date, setDate] = useState(''); // Nouveau state pour la date
    const [products, setProducts] = useState([]);
    const [providers, setProviders] = useState([]);

    const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

    const OpenSidebar = () => {
        setOpenSidebarToggle(!openSidebarToggle);
    };

    const handleSidebarItemClick = (content) => {
        setSelectedContent(content); // Correction: la variable "selectedContent" n'est pas définie
    };

    const fetchProviders = async () => {
        try {
          const response = await axios.get('http://localhost:8080/providers');
          setProviders(response.data.data);
        } catch (error) {
          console.error('Error:', error);
          showAlert('Une erreur s\'est produite lors de la récupération des produits. Veuillez réessayer plus tard.', 'error');
        }
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
    
    
      useEffect(() => {
        fetchProducts();
        fetchProviders();
      }, []);
    const handleAddProduct = () => {
        if (!product || !quantity || !providerId || !codeCommande) {
            alert('Veuillez remplir tous les champs du produit, du fournisseur et du code de commande.');
            return;
        }
        const newProduct = {
            id: new Date().getTime(),
            product,
            quantity: parseInt(quantity, 10)
        };
        if (!firstProductAdded) {
            alert(`Informations de commande : \nFournisseur : ${providerId} \nCode de commande : ${codeCommande}`);
            setFirstProductAdded(true);
        }
        setCommandes([...commandes, newProduct]);
        setProduct('');
        setQuantity('');
    };

    const handleFinalizeOrder = async () => {
        if (commandes.length === 0 || !codeCommande || !providerId) {
            alert('Veuillez ajouter des produits et remplir tous les champs de commande.');
            return;
        }
        try {
            const response = await axios.post('http://localhost:8080/commandes', {
                code_commande: codeCommande,
                provider_id: providerId,
                observation: observation_com,
                produits: commandes.map(({ product, quantity }) => ({ product, quantity }))
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            alert('Commande finalisée avec succès : ' + response.data.code_commande);
            setCommandes([]);
            setCodeCommande('');
            setobservation_com('');
            setProviderId('');
            setFirstProductAdded(false);
            setShowPopup(false); // Fermer le popup après finalisation de la commande
        } catch (error) {
            console.error('Erreur complète:', error);
            alert('Erreur lors de la finalisation de la commande : ' + (error.response ? error.response.data.message : error.message));
        }
    };

    const handleValidateOrder = () => {
        setShowPopup(true);
        setDate(new Date().toLocaleDateString()); // Récupérer la date actuelle lors de la validation

    };

    return (
        <div className="grid-container">
          <Header OpenSidebar={OpenSidebar}/>
            <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} handleItemClick={handleSidebarItemClick}/>
        <div className='container'>
            <h1>Gestion de Commande</h1>
            <div className="form-container"> {/* Ajout de la classe form-container */}
                <div>
                    <input type="text"  value={providerId} onChange={(e) => setProviderId(e.target.value)} placeholder="Provider ID" />
                    <input type="text" value={codeCommande} onChange={(e) => setCodeCommande(e.target.value)} placeholder="Code Commande" />
                    <input type="text" value={observation_com} onChange={(e) => setobservation_com(e.target.value)} placeholder="Observation" />
                </div>
                <div>
                    <input type="text" value={product} onChange={(e) => setProduct(e.target.value)} placeholder="Produit" />
                    <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="Quantité" />
                    <button onClick={handleAddProduct}>Ajouter Produit</button>
                </div>
                <button onClick={handleValidateOrder}>Valider</button>
            </div>
            {showPopup && (
                <div className="popup">
                    <h2>Informations de Commande</h2>
                    <p>Fournisseur: {providerId}</p>
                    <p>Code de Commande: {codeCommande}</p>
                    <p>Date :{date}</p>
                    <p>Observation :{observation_com}</p>

                    <h3>Produits ajoutés :</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Produit</th>
                                <th>Quantité</th>
                            </tr>
                        </thead>
                        <tbody>
                            {commandes.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.product}</td>
                                    <td>{item.quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button onClick={() => setShowPopup(false)}>Fermer</button>
                    <button onClick={handleFinalizeOrder}>Finaliser la Commande</button>
                </div>
            )}
            <div>
                <h2>Produits ajoutés :</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Produit</th>
                            <th>Quantité</th>
                        </tr>
                    </thead>
                    <tbody>
                        {commandes.map((item, index) => (
                            <tr key={index}>
                                <td>{item.product}</td>
                                <td>{item.quantity}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    
    );
}

export default App;
/*fojefjerfe last version ffffjfjkff*/////////////////////