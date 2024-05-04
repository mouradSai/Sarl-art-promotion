import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import axios from 'axios'; // Ensure you have axios installed or use fetch API instead

// Embedded CSS styles
const styles = {
    appContainer: {
        fontFamily: 'Arial, sans-serif',
        margin: '20px',
        color: '#333',
    },
    visualizationContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '20px',
    },
    table: {
        width: '40%',
        borderCollapse: 'collapse',
        marginRight: '20px',
    },
    chartContainer: { // Style for the chart container to set a fixed width
        width: '500px', // Set a fixed width for the chart
    },
    tableCell: {
        border: '1px solid #ccc',
        padding: '8px',
        textAlign: 'left',
    },
    tableHeader: {
        backgroundColor: '#f4f4f4',
    },
    tableRow: {
        ':hover': {
            backgroundColor: '#e9e9e9',
        },
    },
    deleteButton: {
        backgroundColor: '#f44336',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        padding: '5px 10px',
        ':hover': {
            backgroundColor: '#d32f2f',
        },
    },
};

const SeuilBas = 1000; // Low quantity threshold

const ProductStockVisualizer = () => {
    const [produits, setProduits] = useState([]); // Initialize state for products

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:8080/products');
                setProduits(response.data.data.filter(prod => prod.quantity < SeuilBas));
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
        maintainAspectRatio: false, // Add this to maintain the aspect ratio
    };

    return (
        <div style={styles.appContainer}>
            <h2>Visualisation des produits à faible stock</h2>
            <div style={styles.visualizationContainer}>
                <table style={styles.table}>
                    <thead>
                        <tr style={styles.tableHeader}>
                            <th>Produit</th>
                            <th>Quantité</th>
                        </tr>
                    </thead>
                    <tbody>
                        {produits.map((produit, index) => (
                            <tr key={index} style={styles.tableRow}>
                                <td>{produit.name}</td>
                                <td>{produit.quantity}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div style={styles.chartContainer}>
                    <Bar data={data} options={options} />
                </div>
            </div>
        </div>
    );
};

// Placeholder for the showAlert function
function showAlert(message) {
    alert(message); // Replace this with your alert system if different
}

export default ProductStockVisualizer;
