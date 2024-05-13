import React, { useState, useEffect } from 'react';
import { BsFillBellFill, BsFillArchiveFill, MdSpaceDashboard, BsPersonFill, BsFillGrid1X2Fill, BsFillGrid3X3GapFill, BsFileBarGraphFill, BsCashStack, BsBox2Fill, BsPeopleFill } from 'react-icons/bs';
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { FaArrowRight,FaArrowLeft } from "react-icons/fa";

import { Link } from 'react-router-dom';
import Shartproduct from '../shartProducts/shartproduct';

function Home() {
    const [showShartProduct, setShowShartProduct] = useState(false); // State pour afficher ou masquer Shartproduct

    const [productsCount, setProductsCount] = useState(0);
    const [providersCount, setProvidersCount] = useState(0);
    const [customersCount, setCustomersCount] = useState(0);
  
    const [commandesCount, setCommandesCount] = useState(0);
    const [commandesAchatCount, setCommandesAchatCount] = useState(0);
    const [commandesVenteCount, setCommandesVenteCount] = useState(0); 
    const [categoriescount, setCategoriesCount] = useState(0); 
    const [entrepotscount, setEntrepotsCount] = useState(0); 

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                // Fetching categorie count
                const entrepotsResponse = await fetch('http://localhost:8080/entrepots');
                const entrepotsData = await entrepotsResponse.json();
                setEntrepotsCount(entrepotsData.count);
    
                // Fetching categorie count
                const categoriesResponse = await fetch('http://localhost:8080/categories');
                const categoriesData = await categoriesResponse.json();
                setCategoriesCount(categoriesData.count);
    
                // Fetching products count
                const productsResponse = await fetch('http://localhost:8080/products');
                const productsData = await productsResponse.json();
                setProductsCount(productsData.count);

                // Fetching providers count
                const providersResponse = await fetch('http://localhost:8080/providers');
                const providersData = await providersResponse.json();
                setProvidersCount(providersData.count);

                // Fetching customers count
                const customersResponse = await fetch('http://localhost:8080/clients');
                const customersData = await customersResponse.json();
                setCustomersCount(customersData.count);

                
                // Fetching commandes count
                const commandesResponse = await fetch('http://localhost:8080/commandes');
                const commandesData = await commandesResponse.json();
                setCommandesCount(commandesData.count);

                // Fetching commandes_achat count
                const commandes_achatResponse = await fetch('http://localhost:8080/commandes_achat');
                const commandes_achatData = await commandes_achatResponse.json();
                setCommandesAchatCount(commandes_achatData.count);

                // Fetching commandes_vente count
                const commandes_venteResponse = await fetch('http://localhost:8080/commandes_vente');
                const commandes_venteData = await commandes_venteResponse.json();
                setCommandesVenteCount(commandes_venteData.count)

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchCounts();
    }, []);

    return (
        <main className='main-container'>
            <div className='main-title'>
                <h3>DASHBOARD</h3>
            </div>

     {/* Affichage des cartes d'informations */}
     {!showShartProduct && (
            <div className='main-cards'>
                {/* Première moitié de la page */}
                <div className='card'>
                    <Link to="/product" className="sidebar-link"> 
                        <div className='card-inner'>
                            <h3>Produits</h3>
                            <BsBox2Fill className='card_icon'/>
                        </div>
                        <h1>{productsCount}</h1>
                    </Link>
                </div>
              
                <div className='card'>
                    <Link to="/provider" className="sidebar-link"> 
                        <div className='card-inner'>
                            <h3>Fournisseurs</h3>
                            <BsPersonFill className='card_icon'/>
                        </div>
                        <h1>{providersCount}</h1>
                    </Link>
                </div>

                <div className='card'>
                    <Link to="/customer" className="sidebar-link"> 
                        <div className='card-inner'>
                            <h3>Clients</h3>
                            <BsPeopleFill className='card_icon'/>
                        </div>
                        <h1>{customersCount}</h1>
                    </Link> 
                </div>
                <div className='card'>
                    <Link to="/categorie" className="sidebar-link"> 
                        <div className='card-inner'>
                            <h3>Categories</h3>
                            <BsPeopleFill className='card_icon'/>
                        </div>
                        <h1>{categoriescount}</h1>
                    </Link> 
                </div>
                <div className='card'>
                    <Link to="/entrepot" className="sidebar-link"> 
                        <div className='card-inner'>
                            <h3>Entrepots</h3>
                            <BsPeopleFill className='card_icon'/>
                        </div>
                        <h1>{entrepotscount}</h1>
                    </Link> 
                </div>
                <div className='card'>
                    <Link to="/historique_commande" className="sidebar-link"> 
                        <div className='card-inner'>
                            <h3>Commandes</h3>
                            <BsCashStack className='card_icon'/>
                        </div>
                        <h1>{commandesCount}</h1>
                    </Link>
                </div>

                <div className='card'>
                    <Link to="/historique_commande_achat" className="sidebar-link"> 
                        <div className='card-inner'>
                            <h3>Commandes d'achat</h3>
                            <BsCashStack className='card_icon'/>
                        </div>
                        <h1>{commandesAchatCount}</h1>
                    </Link>
                </div>

                <div className='card'>
                    <Link to="/historique_commande_vente" className="sidebar-link"> 
                        <div className='card-inner'>
                            <h3>Commandes de vente</h3>
                            <BsCashStack className='card_icon'/>
                        </div>
                        <h1>{commandesVenteCount}</h1>
                    </Link>
                </div>
            </div>
   )}

            {/* Affichage de Shartproduct */}
            {showShartProduct && (
                <div className="shart-product-container">
                    <Shartproduct />
                </div>
            )}

            {/* Bouton pour basculer entre les vues */}
            <div className={showShartProduct ? "toggle-button-container-left" : "toggle-button-container-right"}>
                <button className="toggle-button" onClick={() => setShowShartProduct(!showShartProduct)}>
                    {showShartProduct ? <FaArrowLeft className='iconar'/>  : <FaArrowRight className='iconar'/>}
                </button>
            </div>
            
        </main>
    );
}

export default Home;
