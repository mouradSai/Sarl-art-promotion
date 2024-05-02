import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Main/Sidebar';
import HeaderEntrepot from '../../components/Headers/HeaderEntrepot';
import CustomAlert from '../../components/costumeAlert/costumeAlert';

function App() {
    const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
    const [selectedContent, setSelectedContent] = useState('');
    const [showOnlyActive, setShowOnlyActive] = useState(true);

    const OpenSidebar = () => {
        setOpenSidebarToggle(!openSidebarToggle);
    };

    const handleSidebarItemClick = (content) => {
        setSelectedContent(content);
    };

    const [entrepots, setEntrepots] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        IsActive: true
    });
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editEntrepotId, setEditEntrepotId] = useState('');
    const [selectedEntrepot, setSelectedEntrepot] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [alert, setAlert] = useState(null);

    const entrepotsPerPage = 8;

    useEffect(() => {
        fetchEntrepots();
    }, []);

    const fetchEntrepots = async () => {
        try {
            const response = await axios.get('http://localhost:8080/entrepots');
            setEntrepots(response.data.data);
        } catch (error) {
            console.error('Error:', error);
            showAlert('An error occurred while fetching entrepots. Please try again later.');
        }
    };

    const showAlert = (message, type) => {
        setAlert({ message, type });
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!formData.name) {
            showAlert('Please enter an entrepot name.');
            return;
        }
        try {
            const response = await axios.post('http://localhost:8080/entrepots', formData);
            if (response.status === 201) {
                showAlert('Entrepot added successfully.');
                fetchEntrepots();
                resetFormData();
                setShowCreateForm(false);
            } else {
                showAlert(response.data.message || 'An error occurred.');
            }
        } catch (error) {
            console.error('Error:', error);
            if (error.response) {
                showAlert(error.response.data.message || 'An error occurred.');
            } else {
                showAlert('An error occurred. Please try again later.');
            }
        }
    };

    const handleDelete = async (id, isActive) => {
        try {
            const newStatus = !isActive;
            const response = await axios.put(`http://localhost:8080/entrepots/${id}`, { IsActive: newStatus });
            if (response.status === 200) {
                showAlert(`Entrepot ${newStatus ? 'enabled' : 'disabled'} successfully.`);
                fetchEntrepots();
            } else {
                showAlert(response.data.message || 'An error occurred while updating entrepot status.');
            }
        } catch (error) {
            console.error('Error:', error);
            showAlert('An error occurred. Please try again later.');
        }
    };

    const handleEdit = (entrepot) => {
        setEditEntrepotId(entrepot._id);
        setFormData({ ...entrepot });
        setShowCreateForm(true);
    };

    const handleView = (entrepot) => {
        setSelectedEntrepot(entrepot);
    };

    const handleEditSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.put(`http://localhost:8080/entrepots/${editEntrepotId}`, formData);
            if (response.status && response.status === 200) {
                showAlert('Entrepot updated successfully.');
                fetchEntrepots();
                setEditEntrepotId('');
                resetFormData();
                setShowCreateForm(false);
            } else {
                showAlert(response.data.message || 'An error occurred while updating entrepot.');
            }
        } catch (error) {
            console.error('Error:', error);
            showAlert('An error occurred. Please try again later.');
        }
    };

    const resetFormData = () => {
        setFormData({
            name: '',
            IsActive: true
        });
    };

    const filterEntrepots = (entrepots, searchText) => {
        let filteredEntrepots = entrepots.filter(entrepot => {
            return (
                entrepot.name.toLowerCase().includes(searchText.toLowerCase())
            );
        });

        if (showOnlyActive) {
            filteredEntrepots = filteredEntrepots.filter(entrepot => entrepot.IsActive);
        }

        const indexOfLastEntrepot = currentPage * entrepotsPerPage;
        const indexOfFirstEntrepot = indexOfLastEntrepot - entrepotsPerPage;
        return filteredEntrepots.slice(indexOfFirstEntrepot, indexOfLastEntrepot);
    };

    const handleSearchChange = (event) => {
        setSearchText(event.target.value);
    };

    const handleShowOnlyActiveChange = () => {
        setShowOnlyActive(!showOnlyActive);
    };

    return (
        <div className="grid-container">
            <HeaderEntrepot OpenSidebar={OpenSidebar}/>
            <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} handleItemClick={handleSidebarItemClick}/>
            <div className="container">
                <h1 className="title-all">Entrepots</h1>
                <div className="actions">
                    <input
                        type="text"
                        placeholder="Search entrepots..."
                        value={searchText}
                        onChange={handleSearchChange}
                    />
                    <label>
                        Show only active
                        <input
                            type="checkbox"
                            checked={showOnlyActive}
                            onChange={handleShowOnlyActiveChange}
                        />
                    </label>
                    <button className="create-button" onClick={() => setShowCreateForm(true)}>Create</button>
                </div>
                {showCreateForm && (
                    <div className="popup">
                        <div className="popup-content">
                            <span className="close-button" onClick={() => setShowCreateForm(false)}>&times;</span>
                            <h2>Create New Entrepot</h2>
                            <form onSubmit={handleSubmit}>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
                                <button className="create-button" type="submit">Save</button>
                                <button className='delet-button' onClick={() => setShowCreateForm(false)}>Cancel</button>
                            </form>
                        </div>
                    </div>
                )}
                {filterEntrepots(entrepots, searchText).length > 0 && (
                    <>
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Active</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filterEntrepots(entrepots, searchText).map(entrepot => (
                                    <tr key={entrepot._id}>
                                        <td>{entrepot.name}</td>
                                        <td>{entrepot.IsActive ? 'Yes' : 'No'}</td>
                                        <td>
                                            <button className='view-button' onClick={() => handleView(entrepot)}>View</button>
                                            <button className='edit-button' onClick={() => handleEdit(entrepot)}>Edit</button>
                                            <button className='action-button delete-button' onClick={() => handleDelete(entrepot._id, entrepot.IsActive)}>
                                                {entrepot.IsActive ? 'Disable' : 'Enable'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="pagination">
                            <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>&lt; Prev</button>
                            <span>{currentPage}</span>
                            <button disabled={currentPage === Math.ceil(entrepots.length / entrepotsPerPage)} onClick={() => setCurrentPage(currentPage + 1)}>Next &gt;</button>
                        </div>
                    </>
                )}
                {filterEntrepots(entrepots, searchText).length === 0 && (
                    <p>No entrepots found.</p>
                )}
                {selectedEntrepot && (
                    <div className="popup">
                        <div className="popup-content">
                            <span className="close-button" onClick={() => setSelectedEntrepot(null)}>&times;</span>
                            <h2>Entrepot Details</h2>
                            <p>Name: {selectedEntrepot.name}</p>
                            <p>Active: {selectedEntrepot.IsActive ? 'Yes' : 'No'}</p>
                            <button className='delet-button' onClick={() => setSelectedEntrepot(null)}>Cancel</button>
                        </div>
                    </div>
                )}
                {editEntrepotId && (
                    <div className="popup">
                        <div className="popup-content">
                            <span className="close-button" onClick={() => { setEditEntrepotId(''); resetFormData(); setShowCreateForm(false); }}>&times;</span>
                            <h2>Edit Entrepot</h2>
                            <form onSubmit={handleEditSubmit}>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
                                <button className="create-button" type="submit">Save</button>
                                <button className='delet-button' onClick={() => { setEditEntrepotId(''); resetFormData(); setShowCreateForm(false); }}>Cancel</button>
                            </form>
                        </div>
                    </div>
                )}
                {alert && <CustomAlert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
            </div>
        </div>
    );
}

export default App;
////*last version