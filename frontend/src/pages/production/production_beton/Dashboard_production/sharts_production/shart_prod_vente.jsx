import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StatsCard from './StatsCard';
import { BsCashStack, BsFillBarChartFill, BsExclamationCircleFill } from 'react-icons/bs';
import './StatsCard.css';
const StatsTable = () => {
    const [stats, setStats] = useState({
        totalCommandeSum: 0,
        totalVersementSum: 0,
        totalResteAPayerSum: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get('http://localhost:8080/credit_production_vente/stats');
                setStats(response.data);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error loading stats: {error.message}</p>;
    }

    return (
        <div className="stats-container">
            {/* <h1 className='title-all'>Statistiques des Commandes</h1> */}
            <div className="stats-cards">
                <StatsCard 
                    title="Total des Commandes" 
                    value={stats.totalCommandeSum} 
                    icon={<BsFillBarChartFill />} 
                />
                <StatsCard 
                    title="Total des Versements" 
                    value={stats.totalVersementSum} 
                    icon={<BsCashStack />} 
                />
                <StatsCard 
                    title="Total Reste à Payer" 
                    value={stats.totalResteAPayerSum} 
                    icon={<BsExclamationCircleFill />} 
                />
            </div>
        </div>
    );
};

export default StatsTable;
