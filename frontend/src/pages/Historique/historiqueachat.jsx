import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Main/Sidebar';
import Header from '../../components/Main/Header';

function App() {
    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.reload();
    };

    const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
    const OpenSidebar = () => {
        setOpenSidebarToggle(!openSidebarToggle);
    };

    const [orders, setOrders] = useState([]);
    const [providers, setProviders] = useState([]);
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({
        provider: '',
        nameprovider: '', // Added nameprovider field
        product: '',
        nameproduct: '', // Added nameproduct field
        date: '',
        description: '',
        quantity: 0,
        unitPrice: 0,
        subtotal: 0
    });
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editOrderId, setEditOrderId] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 3; // Nombre de commandes à afficher par page

    useEffect(() => {
        fetchOrders();
        fetchProviders();
        fetchProducts();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get('http://localhost:8080/orders');
            setOrders(response.data.data);
        } catch (error) {
            console.error('Error:', error);
            showAlert('An error occurred while fetching orders. Please try again later.');
        }
    };

    const fetchProviders = async () => {
        try {
            const response = await axios.get('http://localhost:8080/providers');
            setProviders(response.data.data);
        } catch (error) {
            console.error('Error:', error);
            showAlert('An error occurred while fetching providers. Please try again later.');
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:8080/products');
            setProducts(response.data.data);
        } catch (error) {
            console.error('Error:', error);
            showAlert('An error occurred while fetching products. Please try again later.');
        }
    };

    const calculateSubtotal = (quantity, unitPrice) => {
        return quantity * unitPrice;
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === 'quantity' || name === 'unitPrice') {
            const newFormData = {
                ...formData,
                [name]: value
            };
            if (newFormData.quantity && newFormData.unitPrice) {
                newFormData.subtotal = calculateSubtotal(newFormData.quantity, newFormData.unitPrice);
            } else {
                newFormData.subtotal = 0; // Réinitialiser le subtotal si l'un des champs est vide
            }
            setFormData(newFormData);
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleProviderChange = (event) => {
        const { value } = event.target;
        const selectedProvider = providers.find(provider => provider.name === value);
        setFormData({
            ...formData,
            provider: selectedProvider ? selectedProvider._id : '',
            nameprovider: value
        });
    };

    const handleProductChange = (event) => {
        const { value } = event.target;
        const selectedProduct = products.find(product => product.name === value);
        setFormData({
            ...formData,
            product: selectedProduct ? selectedProduct._id : '',
            nameproduct: value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!formData.provider || !formData.date || !formData.product || !formData.description || !formData.unitPrice || !formData.quantity || !formData.subtotal) {
            showAlert('Please fill in all required fields.');
            return;
        }
        try {
            const response = await axios.post('http://localhost:8080/orders', formData);
            if (response.status === 201) {
                showAlert('Order added successfully.');
                fetchOrders();
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

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:8080/orders/${id}`);
            if (response.status === 200) {
                showAlert('Order deleted successfully.');
                fetchOrders();
            } else {
                showAlert(response.data.message || 'An error occurred while deleting order.');
            }
        } catch (error) {
            console.error('Error:', error);
            showAlert('An error occurred. Please try again later.');
        }
    };

    const handleEdit = (order) => {
        setEditOrderId(order._id);
        setFormData({ ...order });
        setShowCreateForm(true);
    };

    const handleView = async (order) => {
        try {
            const response = await axios.get(`http://localhost:8080/orders/${order._id}`);
            setSelectedOrder(response.data);
        } catch (error) {
            console.error('Error:', error);
            showAlert('An error occurred. Please try again later.');
        }
    };

    const handleEditSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.put(`http://localhost:8080/orders/${editOrderId}`, formData);
            if (response.status && response.status === 200) {
                showAlert('Order updated successfully.');
                fetchOrders();
                setEditOrderId('');
                resetFormData();
                setShowCreateForm(false);
            } else {
                showAlert(response.data.message || 'An error occurred while updating order.');
            }
        } catch (error) {
            console.error('Error:', error);
            showAlert('An error occurred. Please try again later.');
        }
    };

    const resetFormData = () => {
        setFormData({
            provider: '',
            nameprovider: '',
            product: '',
            nameproduct: '',
            date: '',
            description: '',
            quantity: 0,
            unitPrice: 0,
            subtotal: 0
        });
    };

    const showAlert = (message) => {
        alert(message);
    };

    const filterOrders = (orders, searchText) => {
        const filtered = orders.filter(order => {
            return order.nameprovider.toLowerCase().includes(searchText.toLowerCase());
        });

        const indexOfLastOrder = currentPage * ordersPerPage;
        const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
        return filtered.slice(indexOfFirstOrder, indexOfLastOrder);
    };

    const handleSearchChange = (event) => {
        setSearchText(event.target.value);
    };

    const filteredOrders = filterOrders(orders, searchText);

    return (
        <div className="grid-container">
            <Header OpenSidebar={OpenSidebar}/>
            <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
            <div className="container">
                <h1 className="title-all">Orders</h1>
                <div className="actions">
                    <input
                        type="text"
                        placeholder="Search orders..."
                        value={searchText}
                        onChange={handleSearchChange}
                    />
                    <button className="create-button" onClick={() => setShowCreateForm(true)}>Create</button>
                </div>

                {showCreateForm && (
                    <div className="popup">
                        <div className="popup-content">
                            <span className="close-button" onClick={() => setShowCreateForm(false)}>&times;</span>
                            <h2>Create New Order</h2>
                            <form onSubmit={handleSubmit}>
                                <select name="provider" value={formData.nameprovider} onChange={handleProviderChange}>
                                    <option value="">Select Provider</option>
                                    {providers.map(provider => (
                                        <option key={provider._id} value={provider.name}>{provider.name}</option>
                                    ))}
                                </select>
                                <input type="date" name="date" value={formData.date} onChange={handleChange} placeholder="Date" />
                                <select name="product" value={formData.nameproduct} onChange={handleProductChange}>
                                    <option value="">Select Product</option>
                                    {products.map(product => (
                                        <option key={product._id} value={product.name}>{product.name}</option>
                                    ))}
                                </select>
                                <input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="Description" />
                                <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} placeholder="Quantity" />
                                <input type="number" name="unitPrice" value={formData.unitPrice} onChange={handleChange} placeholder="Unit Price" />
                                <input type="number" name="subtotal" value={formData.subtotal} onChange={handleChange} placeholder="Subtotal" />
                                <button className="create-button" type="submit">Save</button>
                                <button className='delete-button' onClick={() => setShowCreateForm(false)}>Cancel</button>
                            </form>
                        </div>
                    </div>
                )}

                {filteredOrders.length > 0 && (
                    <table>
                        <thead>
                            <tr>
                                <th>Provider</th>
                                <th>Name</th>
                                <th>Date</th>
                                <th>Product</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Quantity</th>
                                <th>Unit Price</th>
                                <th>Subtotal</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map(order => (
                                <tr key={order._id}>
                                    <td>{order.nameprovider}</td>
                                    <td>{order.provider}</td>
                                    <td>{order.date}</td>
                                    <td>{order.nameproduct}</td>
                                    <td>{order.product}</td>
                                    <td>{order.description}</td>
                                    <td>{order.quantity}</td>
                                    <td>{order.unitPrice}</td>
                                    <td>{order.subtotal},00 DA</td>
                                    <td>
                                        <button className='view-button' onClick={() => handleView(order)}>View</button>
                                        <button className='edit-button' onClick={() => handleEdit(order)}>Edit</button>
                                        <button className='delete-button' onClick={() => handleDelete(order._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {filteredOrders.length > 0 && (
                    <div className="pagination">
                        <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>&lt; Prev</button>
                        <span>{currentPage}</span>
                        <button disabled={currentPage === Math.ceil(orders.length / ordersPerPage)} onClick={() => setCurrentPage(currentPage + 1)}>Next &gt;</button>
                    </div>
                )}

                {selectedOrder && (
                    <div className="popup">
                        <div className="popup-content">
                            <span className="close-button" onClick={() => setSelectedOrder(null)}>&times;</span>
                            <h2>Order Details</h2>
                            <p><strong>Provider:</strong> {selectedOrder.nameprovider}</p>
                            <p><strong>ID provider:</strong> {selectedOrder.provider}</p>
                            <p><strong>Date:</strong> {selectedOrder.date}</p>
                            <p><strong>Product:</strong> {selectedOrder.nameproduct}</p>
                            <p><strong>ID product:</strong> {selectedOrder.product}</p>
                            <p><strong>Description:</strong> {selectedOrder.description}</p>
                            <p><strong>Quantity:</strong> {selectedOrder.quantity}</p>
                            <p><strong>Unit Price:</strong> {selectedOrder.unitPrice}</p>
                            <p><strong>Subtotal:</strong> {selectedOrder.subtotal},00 DA</p>
                            <button className='delete-button' onClick={() => setSelectedOrder(null)}>Close</button>
                        </div>
                    </div>
                )}

                {editOrderId && (
                    <div className="popup">
                        <div className="popup-content">
                            <span className="close-button" onClick={() => {setEditOrderId(''); resetFormData(); setShowCreateForm(false);}}>&times;</span>
                            <h2>Edit Order</h2>
                            <form onSubmit={handleEditSubmit}>
                                <select name="provider" value={formData.nameprovider} onChange={handleProviderChange}>
                                    <option value="">Select Provider</option>
                                    {providers.map(provider => (
                                        <option key={provider._id} value={provider.name}>{provider.name}</option>
                                    ))}
                                </select>
                                <input type="date" name="date" value={formData.date} onChange={handleChange} placeholder="Date" />
                                <select name="product" value={formData.nameproduct} onChange={handleProductChange}>
                                    <option value="">Select Product</option>
                                    {products.map(product => (
                                        <option key={product._id} value={product.name}>{product.name}</option>
                                    ))}
                                </select>
                                <input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="Description" />
                                <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} placeholder="Quantity" />
                                <input type="number" name="unitPrice" value={formData.unitPrice} onChange={handleChange} placeholder="Unit Price" />
                                <input type="number" name="subtotal" value={formData.subtotal} onChange={handleChange} placeholder="Subtotal" />
                                <button className="create-button" type="submit">Save</button>
                                <button className='delete-button' onClick={() => {setEditOrderId(''); resetFormData(); setShowCreateForm(false);}}>Cancel</button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
/*deedfdnednfenf efefjfefe last version **********************sddddcd/c/c/f/vf/v/f/vr/v/r/vr//rv/rrrr**r*vrvrvrvrvrv****////