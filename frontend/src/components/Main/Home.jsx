import React, { useState, useEffect } from 'react';
import { BsFillBellFill,BsFillArchiveFill, MdSpaceDashboard, BsPersonFill, BsFillGrid1X2Fill, BsFillGrid3X3GapFill,BsFileBarGraphFill,BsCashStack, BsBox2Fill, BsPeopleFill, BsListCheck, BsMenuButtonWideFill, BsFillGearFill } from 'react-icons/bs';
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Link } from 'react-router-dom';



function Home() {
    const [productsCount, setProductsCount] = useState(0);
    const [providersCount, setProvidersCount] = useState(0);
    const [customersCount, setCustomersCount] = useState(0);
    const [ordersachatCount,setOrdersachatCount] = useState(0);
    const [ordersventeCount,setOrderventeCount] = useState(0);


    useEffect(() => {
        const fetchCounts = async () => {
            try {
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
                // Fetching ordersachat count
                const ordersachatResponse = await fetch('http://localhost:8080/orders');
                const ordersachatData = await ordersachatResponse.json();
                setOrdersachatCount(ordersachatData.count);
                // Fetching ordersvent count
                const ordersventeResponse = await fetch('http://localhost:8080/sells');
                const ordersventeData = await ordersventeResponse.json();
                setOrderventeCount(ordersventeData.count);
  
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchCounts();
    }, []);

    const data = [
        { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
        { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
        { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
        { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
        { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
        { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 },
        { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 },
    ];

    return (
        <main className='main-container'>
            <div className='main-title'>
                <h3>DASHBOARD</h3>
            </div>

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
                <Link to="/buy" className="sidebar-link"> 
                    <div className='card-inner'>
                        <h3>Commande d'achat</h3>
                        <BsCashStack className='card_icon'/>
                    </div>
                    <h1>{ordersachatCount}</h1>
                    </Link>
                </div>

                

                <div className='card'>
                <Link to="/sell" className="sidebar-link"> 
                    <div className='card-inner'>
                        <h3>Commande de vente</h3>
                        <FaMoneyBillTransfer className='card_icon'/>
                    </div>
                    <h1>{ordersventeCount}</h1>
                </Link>
                </div>

                
            </div>

            <div className='charts'>
                <ResponsiveContainer width="100%" height="100%">
                   
                </ResponsiveContainer>
            </div>
        </main>
    );
}

export default Home;
