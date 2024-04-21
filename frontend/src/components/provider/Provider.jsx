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
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editProviderId, setEditProviderId] = useState('');

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
        // Vérification que tous les champs obligatoires sont remplis
        if (!formData.name || !formData.address || !formData.description || !formData.number || !formData.comment) {
            setResponseMessage('Please fill in all required fields.');
            return;
        }
        try {
            const response = await axios.post('http://localhost:8080/providers', formData);
            if (response.status === 201) {
                setResponseMessage('Provider added successfully.');
                fetchProviders();
                resetFormData();
            } else {
                setResponseMessage(response.data.message || 'An error occurred.');
            }
        } catch (error) {
            console.error('Error:', error);
            if (error.response) {
                setResponseMessage(error.response.data.message || 'An error occurred.');
            } else {
                setResponseMessage('An error occurred. Please try again later.');
            }
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
        setShowCreateForm(false);
        setEditProviderId(provider._id);
        setFormData({ ...provider });
    };

    const handleEditSubmit = async (event) => {
      event.preventDefault();
      try {
          const response = await axios.put(`http://localhost:8080/providers/${editProviderId}`, formData);
          if (response.status && response.status === 200) {
              setResponseMessage('Provider updated successfully.');
              fetchProviders();
              setEditProviderId('');
              resetFormData();
          } else {
              setResponseMessage(response.data.message || 'An error occurred.');
          }
      } catch (error) {
          console.error('Error:', error);
          setResponseMessage('An error occurred. Please try again later.');
      }
  };
  

    const resetFormData = () => {
        setFormData({
            name: '',
            address: '',
            description: '',
            number: '',
            comment: '',
            isActive: true
        });
    };

    return (
        <div>
            <h1>Providers</h1>
            {!showCreateForm && (
                <div>
                    <h2>Add New Provider</h2>
                    <button onClick={() => setShowCreateForm(true)}>Create</button>
                </div>
            )}
            {showCreateForm && (
                <div>
                    <h2>Create New Provider</h2>
                    <form onSubmit={handleSubmit}>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
                        <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" />
                        <input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="Description" />
                        <input type="text" name="number" value={formData.number} onChange={handleChange} placeholder="Number" />
                        <input type="text" name="comment" value={formData.comment} onChange={handleChange} placeholder="Comment" />
                        <input type="Boolean" name="IsActive" value={formData.IsActive} onChange={handleChange} placeholder="IsActive" />

                        <button type="submit">Save</button>
                    </form>
                    <button onClick={() => setShowCreateForm(false)}>Cancel</button>
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
                        <th>Number</th>
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
                            <td>{provider.number}</td>
                            <td>{provider.comment}</td>
                            <td>
                                <button onClick={() => handleEdit(provider)}>Edit</button>
                                <button onClick={() => handleDelete(provider._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {editProviderId && (
                <div>
                    <h2>Edit Provider</h2>
                    <form onSubmit={handleEditSubmit}>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
                        <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" />
                        <input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="Description" />
                        <input type="text" name="number" value={formData.number} onChange={handleChange} placeholder="Number" />
                        <input type="text" name="comment" value={formData.comment} onChange={handleChange} placeholder="Comment" />
                        <input type="Boolean" name="IsActive" value={formData.IsActive} onChange={handleChange} placeholder="IsActive" />

                        <button type="submit">Save</button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default App;

