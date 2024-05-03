import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../../components/Main/Header';


const OrderPrint = ({ orderDetails }) => {

    return (
        <div className="grid-container">
        <Header />
        <h1>ICI LA PRODUCTION</h1>
      
        <div id="order-to-print" style={{ padding: '20px', backgroundColor: '#fff', margin: '10px', border: '1px solid black' }}>
            <h1>Bon de Commande</h1>
            <p>Nom du Client: {orderDetails.clientName}</p>
            <p>Produit: {orderDetails.product}</p>
            <p>Quantité: {orderDetails.quantity}</p>
            <p>Prix Total: ${orderDetails.totalPrice}</p>
            {/* Ajoutez d'autres détails nécessaires */}
        </div>
        </div>
    );
};

const handlePrint = () => {
    const content = document.getElementById('order-to-print').innerHTML;
    const printWindow = window.open('', '_blank', 'height=600,width=800');
    printWindow.document.write('<html><head><title>Imprimer - Bon de Commande</title><style>body { font-family: Arial, sans-serif; }</style></head>');
    printWindow.document.write('<body>');
    printWindow.document.write(content);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
};

const OrderComponent = () => {
    const orderDetails = {
        clientName: "Jean Dupont",
        product: "Vélo électrique",
        quantity: 1,
        totalPrice: 1200
    };

    return (
        <div>
            <OrderPrint orderDetails={orderDetails} />
            <button onClick={handlePrint} style={{ margin: '10px', padding: '10px' }}>Imprimer le bon de commande</button>
        </div>
    );
};

export default OrderComponent;
