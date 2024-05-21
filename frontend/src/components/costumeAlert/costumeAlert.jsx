import React, { useEffect, useState } from 'react';
import './alert.css';

const CustomAlert = ({ message, type, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 500); // Attendre que la transition se termine avant de fermer
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  return (
    <div className={`custom-alert ${type} ${visible ? 'show' : 'hide'}`}>
      <p>{message}</p>
      <button className="close-button" onClick={() => setVisible(false)}>&times;</button>
    </div>
  );
};

export default CustomAlert;
