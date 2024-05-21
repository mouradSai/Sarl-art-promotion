import React, { useEffect } from 'react';
import './alert.css';

const CustomAlert = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer); // Cleanup the timer if the component is unmounted
  }, [onClose]);

  return (
    <div className={`custom-alert ${type}`}>
      <p>{message}</p>
      <button className="close-button" onClick={onClose}>&times;</button>
    </div>
  );
};

export default CustomAlert;
