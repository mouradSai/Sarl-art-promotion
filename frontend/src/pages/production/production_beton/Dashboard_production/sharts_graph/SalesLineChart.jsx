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
    const [unit, setUnit] = useState('day'); // Default unit is day

    useEffect(() => {
        const fetchSalesData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/commande_production_vente/stats_date?unit=${unit}`);
                setSalesData(response.data);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchSalesData();
    }, [unit]); // Re-fetch data when the unit changes

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
                fill: true,
                backgroundColor: '#b6121776',
                borderColor: '#B61217',
            },
        ],
    };

    const options = {
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: unit, // Use the selected unit
                    tooltipFormat: unit === 'day' ? 'PPP' : unit === 'month' ? 'MMM yyyy' : 'yyyy',
                },
            },
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div className="line-chart-container">
            <div className="select-container">
                <label htmlFor="unit-select">Unit:</label>
                <select
                    id="unit-select"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                >
                    <option value="day">Jour</option>
                    <option value="month">Mois</option>
                    <option value="year">Année</option>
                </select>
            </div>
            <div className="line-chart">
                <h2 className='titleHis'>Évolution des Ventes par Date</h2>
                <Line data={data} options={options} />
            </div>
        </div>
    );
};

export default SalesLineChart;
