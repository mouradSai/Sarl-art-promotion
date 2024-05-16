import React, { useState, useEffect } from 'react';
import { BsBox2Fill, BsPersonFill, BsPeopleFill, BsCashStack, BsFileBarGraphFill } from 'react-icons/bs';
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import Shartproduct from '../shartProducts/shartproduct';

function Home() {
    const [showShartProduct, setShowShartProduct] = useState(false);

    const [productsCount, setProductsCount] = useState(0);
    const [providersCount, setProvidersCount] = useState(0);
    const [customersCount, setCustomersCount] = useState(0);
    const [commandesCount, setCommandesCount] = useState(0);
    const [commandesAchatCount, setCommandesAchatCount] = useState(0);
    const [commandesVenteCount, setCommandesVenteCount] = useState(0); 
    const [categoriesCount, setCategoriesCount] = useState(0); 
    const [entrepotsCount, setEntrepotsCount] = useState(0); 
    const [totalCommandeSum, setTotalCommandeSum] = useState(0); // Nouvelle variable d'état
    const [totalVersementSum, setTotalVersementSum] = useState(0); // Nouvelle variable d'état

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const entrepotsResponse = await fetch('http://localhost:8080/entrepots');
                const entrepotsData = await entrepotsResponse.json();
                setEntrepotsCount(entrepotsData.count);

                const categoriesResponse = await fetch('http://localhost:8080/categories');
                const categoriesData = await categoriesResponse.json();
                setCategoriesCount(categoriesData.count);

                const productsResponse = await fetch('http://localhost:8080/products');
                const productsData = await productsResponse.json();
                setProductsCount(productsData.count);

                const providersResponse = await fetch('http://localhost:8080/providers');
                const providersData = await providersResponse.json();
                setProvidersCount(providersData.count);

                const customersResponse = await fetch('http://localhost:8080/clients');
                const customersData = await customersResponse.json();
                setCustomersCount(customersData.count);

                const commandesResponse = await fetch('http://localhost:8080/commandes');
                const commandesData = await commandesResponse.json();
                setCommandesCount(commandesData.count);

                const commandesAchatResponse = await fetch('http://localhost:8080/commandes_achat');
                const commandesAchatData = await commandesAchatResponse.json();
                setCommandesAchatCount(commandesAchatData.count);

                const commandesVenteResponse = await fetch('http://localhost:8080/commandes_vente');
                const commandesVenteData = await commandesVenteResponse.json();
                setCommandesVenteCount(commandesVenteData.count);

                // Fetching stats
                const statsResponse = await fetch('http://localhost:8080/credit_achat/stats');
                const statsData = await statsResponse.json();
                setTotalCommandeSum(statsData.totalCommandeSum);
                setTotalVersementSum(statsData.totalVersementSum);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchCounts();
    }, []);

    const remainingCredit = totalCommandeSum - totalVersementSum;

    const data = {
        labels: ['Total Commande', 'Total Versement', 'Crédit Restant'],
        datasets: [
            {
                data: [totalCommandeSum, totalVersementSum, remainingCredit],
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
            },
        ],
    };

    return (
        <main className='main-container'>
            <div className='main-title'>
                <h3>DASHBOARD</h3>
            </div>

            {!showShartProduct && (
                <div className='main-cards'>
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
                            <h1>{categoriesCount}</h1>
                        </Link> 
                    </div>
                    <div className='card'>
                        <Link to="/entrepot" className="sidebar-link"> 
                            <div className='card-inner'>
                                <h3>Entrepots</h3>
                                <BsPeopleFill className='card_icon'/>
                            </div>
                            <h1>{entrepotsCount}</h1>
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
                    
            {/* Affichage du graphique en cercle */}
            <div className="chart-container">
                <h2>Statistiques de Paiement Achat</h2>
                <Pie data={data} />
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
