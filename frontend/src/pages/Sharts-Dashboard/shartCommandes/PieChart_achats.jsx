import React from 'react';
import { Pie } from 'react-chartjs-2';

const PieChart = ({ totalCommandeSum, totalVersementSum }) => {
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
        <div>
            <h2>Statistiques Achat</h2>
            <Pie data={data} />
        </div>
    );
};

export default PieChart;
