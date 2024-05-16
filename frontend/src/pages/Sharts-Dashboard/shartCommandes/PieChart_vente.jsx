// PieChartVente.js
import React from 'react';
import { Pie } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const PieChartVente = ({ totalCommandeSum, totalVersementSum }) => {
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

    const options = {
        plugins: {
            datalabels: {
                display: true,
                color: 'white',
                formatter: (value) => `${value.toLocaleString()} DA`,
            }
        }
    };

    return (
        <div className="chart-container">
            <h2>Statistiques  Ventes</h2>
            <Pie data={data} options={options} plugins={[ChartDataLabels]} />
        </div>
    );
};

export default PieChartVente;
