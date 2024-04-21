import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [providers, setProviders] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        description: '',
        number: '',
        comment: '',
        isActive: true
    });
    const [responseMessage, setResponseMessage] = useState('');
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchProviders();
    }, []);

    const fetchProviders = async () => {
        try {
            const response = await axios.get('http://localhost:8080/providers');
            setProviders(response.data.data);
        } catch (error) {
            console.error('Error:', error);
        }
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
        try {
            const response = await axios.post('http://localhost:8080/providers', formData);
            if (response.status === 201) {
                setResponseMessage('Provider added successfully.');
                fetchProviders();
                setFormData({
                    name: '',
                    address: '',
                    description: '',
                    number: '',
                    comment: '',
                    isActive: true
                });
            } else {
                setResponseMessage(response.data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            setResponseMessage('An error occurred. Please try again later.');
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:8080/providers/${id}`);
            if (response.status === 200) {
                setResponseMessage('Provider deleted successfully.');
                fetchProviders();
            } else {
                setResponseMessage(response.data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            setResponseMessage('An error occurred. Please try again later.');
        }
    };

    const handleEdit = (provider) => {
        setFormData(provider);
    };

    return (
        <div>
            <h1>Providers</h1>
            {!showForm && (
                <div>
                    <h2>Add New Provider</h2>
                    <button onClick={() => setShowForm(true)}>Create</button>
                </div>
            )}
            {showForm && (
                <div>
                    <h2>Create New Provider</h2>
                    <form onSubmit={handleSubmit}>
                        {/* Form inputs here */}
                    </form>
                    <button onClick={() => setShowForm(false)}>Cancel</button>
                </div>
            )}
            {responseMessage && <div>{responseMessage}</div>}
            <h2>Providers List</h2>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Address</th>
                        <th>Description</th>
                        <th>Comment</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {providers.map(provider => (
                        <tr key={provider._id}>
                            <td>{provider.name}</td>
                            <td>{provider.address}</td>
                            <td>{provider.description}</td>
                            <td>{provider.comment}</td>
                            <td>
                                <button onClick={() => handleEdit(provider)}>Edit</button>
                                <button onClick={() => handleDelete(provider._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default App;
