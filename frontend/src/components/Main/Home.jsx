import React, { useState, useEffect } from 'react';
import { BsFillArchiveFill, BsPeopleFill, BsFillBellFill } from 'react-icons/bs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

function Home() {
    const [productsCount, setProductsCount] = useState(0);
    const [providersCount, setProvidersCount] = useState(0);
    const [customersCount, setCustomersCount] = useState(0);
    const [ordersCount,setOrdersCount] = useState(0);

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
                // Fetching products count
                const ordersResponse = await fetch('http://localhost:8080/products');
                const ordersData = await ordersResponse.json();
                setOrdersCount(ordersData.count);
  
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
                    <div className='card-inner'>
                        <h3>PRODUCTS</h3>
                        <BsFillArchiveFill className='card_icon'/>
                    </div>
                    <h1>{productsCount}</h1>
                </div>
              
                <div className='card'>
                    <div className='card-inner'>
                        <h3>Providers</h3>
                        <BsPeopleFill className='card_icon'/>
                    </div>
                    <h1>{providersCount}</h1>
                </div>
                <div className='card'>
                    <div className='card-inner'>
                        <h3>CUSTOMERS</h3>
                        <BsPeopleFill className='card_icon'/>
                    </div>
                    <h1>{customersCount}</h1>
                </div>
                <div className='card'>
                    <div className='card-inner'>
                        <h3>Orders</h3>
                        <BsFillBellFill className='card_icon'/>
                    </div>
                    <h1>{ordersCount}</h1>
                </div>
            </div>

            <div className='charts'>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        width={500}
                        height={300}
                        data={data}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="pv" fill="#8884d8" />
                        <Bar dataKey="uv" fill="#82ca9d" />
                    </BarChart>
                </ResponsiveContainer>

                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        width={500}
                        height={300}
                        data={data}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </main>
    );
}

export default Home;
