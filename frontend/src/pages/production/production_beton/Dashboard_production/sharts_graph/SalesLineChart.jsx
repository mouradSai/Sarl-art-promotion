import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';  // Required for Chart.js
import { Chart as ChartJS, TimeScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import 'chartjs-adapter-date-fns';  // Import the date adapter

// Register the required components and scales
ChartJS.register(TimeScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const SalesLineChart = () => {
    const [salesData, setSalesData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSalesData = async () => {
            try {
                const response = await axios.get('http://localhost:8080/commande_production_vente/stats_date'); // Vérifiez cette URL
                setSalesData(response.data);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchSalesData();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error loading sales data: {error.message}</p>;
    }

    const dates = Object.keys(salesData);
    const totals = Object.values(salesData);

    const data = {
        labels: dates,
        datasets: [
            {
                label: 'Total Ventes',
                data: totals,
                fill: false,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
            },
        ],
    };

    const options = {
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'day',
                    tooltipFormat: 'PPP',
                },
            },
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div className="line-chart">
            <h2 className='yes'>Évolution des Ventes par Date</h2>
            <Line data={data} options={options} />
        </div>
    );
};

export default SalesLineChart;
