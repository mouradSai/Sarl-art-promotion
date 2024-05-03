import React from 'react';
import { Navigate, Route } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('token');  // Vérifiez si le token est stocké dans localStorage

    if (!isAuthenticated) {
        // Si l'utilisateur n'est pas authentifié, redirigez-le vers la page de connexion
        return <Navigate to="/login" />;
    }

    return children;  // Si l'utilisateur est authentifié, affichez le composant enfant
};

export default ProtectedRoute;
