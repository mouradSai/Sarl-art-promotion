import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../../components/Main/Sidebar';
import Header from '../../../components/Main/Header';
import CustomAlert from '../../../components/costumeAlert/costumeAlert';

function App() {
    const [commandes, setCommandes] = useState([]);
    const [selectedCommande, setSelectedCommande] = useState(null);
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        fetchCommandes();
    }, []);

    const fetchCommandes = async () => {
        try {
            const response = await axios.get('http://localhost:8080/commandes');
            setCommandes(response.data.commandes);
            console.log(response.data.commandes); // Debugging to see the data structure
        } catch (error) {
            console.error('Error fetching commandes:', error);
            showAlert('An error occurred while fetching commandes. Please try again later.', 'error');
        }
    };

    const showAlert = (message, type) => {
        setAlert({ message, type });
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:8080/commandes/${id}`);
            if (response.status === 200) {
                showAlert('Commande deleted successfully.', 'success');
                fetchCommandes(); // Refetch all data to update the UI accordingly
            } else {
                showAlert(response.data.message || 'An error occurred while deleting the commande.', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showAlert('An error occurred. Please try again later.', 'error');
        }
    };

    const handleView = (commande) => {
        setSelectedCommande(commande);
    };

    return (
        <div className="grid-container">
            <Header />
            <Sidebar />
            <div className="container">
                <h1 className="title-all">Commandes</h1>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Code Commande</th>
                            <th>Provider</th>
                            <th>Date Commande</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {commandes.map((commande) => (
                            <tr key={commande._id}>
                                <td>{commande.code_commande}</td>
                                <td>{commande.provider_id ? commande.provider_id.name : 'No provider'}</td>
                                <td>{new Date(commande.date_commande).toISOString().slice(0, 10)}</td>
                                <td>
                                    <button className='view-button' onClick={() => handleView(commande)}>View</button>
                                    <button  className='delete-button' onClick={() => handleDelete(commande._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {selectedCommande && (
                    <div className="popup">
                        <div className="popup-content">
                            <span className="close-button" onClick={() => setSelectedCommande(null)}>&times;</span>
                            <h2>Commande Details</h2>
                            <p><strong>Code Commande:</strong> {selectedCommande.code_commande}</p>
                            <p><strong>Date Commande:</strong> {new Date(selectedCommande.date_commande).toISOString().slice(0, 10)}</p>
                            <p><strong>Provider:</strong> {selectedCommande.provider_id ? selectedCommande.provider_id.name : 'No provider'}</p>
                            <p><strong>Observation:</strong> {selectedCommande.observation}</p>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Product Name</th>
                                        <th>Quantity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedCommande.produits.map((prod, index) => (
                                        <tr key={index}>
                                            <td>{prod.product.name}</td> {/* Corrected to show product name */}
                                            <td>{prod.quantity}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                {alert && <CustomAlert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
            </div>
        </div>
    );
}

export default App;
/******** *****************the last version ndddvhdvhvdvhvvdiojvjvfjjfvfvjf */