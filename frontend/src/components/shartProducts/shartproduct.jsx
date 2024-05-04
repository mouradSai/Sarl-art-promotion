import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import axios from 'axios';
import './App.css'; // Ensure the CSS file is correctly linked

const SeuilBas = 1000; // Low quantity threshold

const ProductStockVisualizer = () => {
    const [produits, setProduits] = useState([]); // Initialize state for products

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:8080/products');
                // Fetch products, filter by threshold, sort by quantity, and slice the top 10
                const filteredAndSortedProducts = response.data.data
                    .filter(prod => prod.quantity < SeuilBas)
                    .sort((a, b) => a.quantity - b.quantity)
                    .slice(0, 10); // Keep only the 10 products with the lowest quantities
                setProduits(filteredAndSortedProducts);
            } catch (error) {
                console.error('Error:', error);
                showAlert('An error occurred while fetching products. Please try again later.');
            }
        };
        fetchProducts();
    }, []);

    const data = {
        labels: produits.map(produit => produit.name),
        datasets: [{
            label: 'Quantité',
            data: produits.map(produit => produit.quantity),
            backgroundColor: [
                'rgba(255, 99, 132, 0.5)',
                'rgba(54, 162, 235, 0.5)',
                'rgba(255, 206, 86, 0.5)',
                'rgba(75, 192, 192, 0.5)',
                'rgba(153, 102, 255, 0.5)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)'
            ],
            borderWidth: 1
        }]
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true
            }
        },
        plugins: {
            legend: {
                display: false
            }
        },
        maintainAspectRatio: false, // Maintain aspect ratio
    };

    return (
        <div className='appContainer'>
            <h2>Produits bientôt en rupture de stock</h2>
            <div className='visualizationContainer'>
                <table className='table'>
                    <thead>
                        <tr className='tableHeader'>
                            <th>Produit</th>
                            <th>Quantité</th>
                        </tr>
                    </thead>
                    <tbody>
                        {produits.map((produit, index) => (
                            <tr key={index} className='tableRow'>
                                <td>{produit.name}</td>
                                <td>{produit.quantity}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className='chartContainer'>
                    <Bar data={data} options={options} />
                </div>
            </div>
        </div>
    );
};

function showAlert(message) {
    alert(message); // Replace this with your alert system if different
}

export default ProductStockVisualizer;
