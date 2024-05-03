// Fichier: src/logout/logout.js

const logout = () => {
    localStorage.removeItem('token');
    return Promise.resolve();  // Simuler une opération asynchrone pour l'exemple
};

export { logout };
