import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import './Dashboard.css';
import Sidebar from '../sidebar';
import Header from '../../../components/Main/Header';
import CustomAlert from '../../../components/costumeAlert/costumeAlert'; // Import du composant CustomAlert

const DeliveryDashboard = () => {
    const [stats, setStats] = useState({});
    const [deliveries, setDeliveries] = useState([]);
    const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        fetchStats();
        fetchDeliveries();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await axios.get('http://localhost:8080/livraison/stats');
            setStats(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des statistiques:', error);
        }
    };

    const fetchDeliveries = async () => {
        try {
            const response = await axios.get('http://localhost:8080/livraison');
            setDeliveries(response.data.data.reverse().slice(0, 5)); // Ne prendre que les 5 dernières livraisons
        } catch (error) {
            console.error('Erreur lors de la récupération des livraisons:', error);
        }
    };

    const updateDeliveryStatus = async (id, status) => {
        try {
            await axios.put(`http://localhost:8080/livraison/${id}/etat`, { etat_livraison: status });
            fetchDeliveries();
            showAlert(`L'état de la livraison a été mis à jour en "${status}".`, 'success');
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'état de la livraison:', error);
            showAlert('Erreur lors de la mise à jour de l\'état de la livraison. Veuillez réessayer.', 'error');
        }
    };

    const showAlert = (message, type) => {
        setAlert({ message, type });
        setTimeout(() => {
            setAlert(null);
        }, 5000);
    };

    const getRowClass = (status) => {
        switch (status) {
            case 'En cours':
                return 'status-en-cours';
            case 'Complétée':
                return 'status-completee';
            case 'Retard':
                return 'status-retard';
            default:
                return '';
        }
    };

    const data = {
        labels: ['Total', 'En cours', 'Complétée', 'En retard'],
        datasets: [
            {
                label: 'Livraisons',
                data: [stats.total, stats.enCours, stats.complete, stats.enRetard],
                backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)', 'rgba(255, 99, 132, 0.2)'],
                borderColor: ['rgba(75, 192, 192, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(255, 99, 132, 1)'],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="grid-container">
            <Header OpenSidebar={() => setOpenSidebarToggle(!openSidebarToggle)} />
            <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={() => setOpenSidebarToggle(!openSidebarToggle)} />
            <div className="delivery-dashboard">
                <h1 className="delivery-header">Tableau de Bord des Livraisons</h1>
                <div className="delivery-table-container">
                    <table className="delivery-table">
                        <thead>
                            <tr>
                                <th>Code Livraison</th>
                                <th>Code vente</th>

                                <th>Date Livraison</th>
                                <th>Adresse Livraison</th>
                                <th>Client</th>
                                <th>État</th>
                                <th>Quantité</th>
                                <th>Camion</th>
                                <th>Chauffeur</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {deliveries.map((delivery) => (
                                <tr key={delivery._id} className={getRowClass(delivery.etat_livraison)}>
                                    <td>{delivery.codeLivraison}</td>
                                    <td>{delivery.vente_id ? delivery.vente_id.code_commande : 'N/A'}</td> {/* Afficher le Code Vente */}
                                    <td>{new Date(delivery.date_livraison).toISOString().slice(0, 10)}</td>
                                    <td>{delivery.adresse_livraison}</td>
                                    <td>{delivery.client_id.name}</td>
                                    <td>{delivery.etat_livraison}</td>
                                    <td>{delivery.quantite}</td>
                                    <td>{delivery.camion_id.numero_plaque}</td>
                                    <td>{delivery.chauffeur_id.nom}</td>
                                    <td>
                                        <select className="select-delivery-status" onChange={(e) => updateDeliveryStatus(delivery._id, e.target.value)} value={delivery.etat_livraison}>
                                            <option value="En cours">En cours</option>
                                            <option value="Retard">Retard</option>
                                            <option value="Complétée">Complétée</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="delivery-stats-container">
                    <Bar data={data} />
                </div>
                {alert && <CustomAlert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
            </div>
        </div>
    );
};

export default DeliveryDashboard;
