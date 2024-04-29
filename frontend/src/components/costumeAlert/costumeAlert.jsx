import React from 'react';
import './alert.css';

const CustomAlert = ({ message, type, onClose }) => {
  return (
    <div className={`custom-alert ${type}`}>
      <p>{message}</p>
      <button className="close-button" onClick={onClose}>&times;</button>
    </div>
  );
};

export default CustomAlert;
