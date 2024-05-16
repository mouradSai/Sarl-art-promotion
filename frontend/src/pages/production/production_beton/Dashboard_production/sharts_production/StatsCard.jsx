import React from 'react';
import './StatsCard.css';

const StatsCard = ({ title, value, icon }) => {
    return (
        <div className="stats-card">
            <div className="stats-card-icon">
                {icon}
            </div>
            <div className="stats-card-content">
                <h4>{title}</h4>
                <p>{value} ,00 DA</p>
            </div>
        </div>
    );
};

export default StatsCard;
