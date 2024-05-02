import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Main/Sidebar';
import Header from '../../components/Main/Header';
import CustomAlert from '../../components/costumeAlert/costumeAlert'; // Import du composant CustomAlert



function Users() {
    const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newUserRole, setNewUserRole] = useState('');
    const [deleteUserId, setDeleteUserId] = useState(null);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [showUserRolePopup, setShowUserRolePopup] = useState(false);
    const [showViewPopup, setShowViewPopup] = useState(false); // Ajout d'un état pour le popup de voir

    const OpenSidebar = () => {
        setOpenSidebarToggle(!openSidebarToggle);
    };

    const handleSidebarItemClick = (content) => {
        setSelectedContent(content); // Correction: la variable "selectedContent" n'est pas définie
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const deleteUser = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:8080/api/users/${id}`);
            if (response.status === 200) {
                fetchUsers();
            } else {
                console.error('Error:', response.data.message || 'Une erreur s\'est produite lors de la suppression de l\'utilisateur');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const updateUserRole = async (id) => {
        try {
            const response = await axios.put(`http://localhost:8080/api/users/${id}/role`, { role: newUserRole });
            if (response.status === 200) {
                fetchUsers();
                setShowUserRolePopup(false); // Fermer le popup de modification de rôle après l'enregistrement
            } else {
                console.error('Error:', response.data.message || 'Une erreur s\'est produite lors de la mise à jour du rôle de l\'utilisateur');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const viewUserDetails = (user) => {
        setSelectedUser(user);
        setShowViewPopup(true); // Afficher le popup de voir lorsque l'utilisateur est sélectionné
    };

    const openUserRolePopup = (user) => {
        setSelectedUser(user);
        setShowUserRolePopup(true);
    };
    
    const confirmDeleteUser = async () => {
        try {
            const response = await axios.delete(`http://localhost:8080/api/users/${deleteUserId}`);
            if (response.status === 200) {
                fetchUsers();
            } else {
                console.error('Error:', response.data.message || 'Une erreur s\'est produite lors de la suppression de l\'utilisateur');
            }
        } catch (error) {
            console.error('Error:', error);
        }
        setDeleteUserId(null);
        setShowDeleteConfirmation(false);
    };

    const cancelDeleteUser = () => {
        setDeleteUserId(null);
        setShowDeleteConfirmation(false);
    };

    return (
        <div className="grid-container">
            <Header OpenSidebar={OpenSidebar}/>
            <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} handleItemClick={handleSidebarItemClick}/>
            <div className="container">
            <h1 className="title-all">Utilisateurs</h1>
            <table>
                <thead>
                    <tr>
                        <th>Prénom</th>
                        <th>Nom</th>
                        <th>Email</th>
                        <th>Rôle</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user._id}>
                            <td>{user.firstName}</td>
                            <td>{user.lastName}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>
                                <button className="view-button" onClick={() => viewUserDetails(user)}>Voir</button>
                                <button className="edit-button" onClick={() => openUserRolePopup(user)}>Modifier le rôle</button>
                                <button className="delete-button" onClick={() => { setDeleteUserId(user._id); setShowDeleteConfirmation(true); }}>Supprimer</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pop-up pour afficher les détails de l'utilisateur */}
            {showViewPopup && selectedUser && (
                <div className="popup">
                    <div className="popup-content">
                        <span className="close-button" onClick={() => setShowViewPopup(false)}>&times;</span>
                        <h2>Détails de {selectedUser.firstName} {selectedUser.lastName}</h2>
                        <p>Prénom : {selectedUser.firstName}</p>
                        <p>Nom : {selectedUser.lastName}</p>
                        <p>Email : {selectedUser.email}</p>
                        <p>Rôle : {selectedUser.role}</p>
                    </div>
                </div>
            )}

            {/* Pop-up pour modifier le rôle */}
            {showUserRolePopup && selectedUser && (
                <div className="popup">
                    <div className="popup-content">
                        <span className="close-button" onClick={() => setShowUserRolePopup(false)}>&times;</span>
                        <h2>Modifier le rôle de {selectedUser.firstName} {selectedUser.lastName}</h2>
                        <select value={newUserRole} onChange={(e) => setNewUserRole(e.target.value)}>
                            <option value="superadmin">SuperAdmin</option>
                            <option value="admin">Admin</option>
                            <option value="user">User</option>
                        </select>
                        <button onClick={() => updateUserRole(selectedUser._id)}>Enregistrer</button>
                    </div>
                </div>
            )}

            {/* Pop-up de confirmation de suppression */}
            {showDeleteConfirmation && (
                <div className="popup">
                    <div className="popup-content">
                        <span className="close-button" onClick={cancelDeleteUser}>&times;</span>
                        <h2>Confirmation de suppression</h2>
                        <p>Voulez-vous vraiment supprimer cet utilisateur ?</p>
                        <button onClick={confirmDeleteUser}>Confirmer</button>
                        <button onClick={cancelDeleteUser}>Annuler</button>
                    </div>
                </div>
            )}
        </div>
     </div>
    );
}

export default Users;
