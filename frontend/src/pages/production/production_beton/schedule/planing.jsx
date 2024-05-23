import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from '../SidebarProduction';
import Header from '../../../../components/Main/Header';
const localizer = momentLocalizer(moment);

const ProductionPlanning = () => {
    const [openSidebarToggle, setOpenSidebarToggle] = React.useState(false);
    const OpenSidebar = () => {
        setOpenSidebarToggle(!openSidebarToggle);
    };
    const [productionOrders, setProductionOrders] = useState([]);
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [newStatus, setNewStatus] = useState('');

    useEffect(() => {
        fetchProductionOrders();
    }, []);

    const fetchProductionOrders = async () => {
        try {
            const response = await axios.get('http://localhost:8080/bon_production/');
            const activeOrders = response.data.bonsProduction.filter(order => order.status !== 'Terminé');
            setProductionOrders(activeOrders);
            setupCalendarEvents(activeOrders);
        } catch (error) {
            console.error('Erreur lors de la récupération des bons de production:', error);
        }
    };

    const parseHeure = (date, heure) => {
        const [hour, minute] = heure.split('h').map(Number);
        return moment(date).set({ hour, minute: minute || 0 }).toDate();
    };

    const setupCalendarEvents = (orders) => {
        const events = orders.map(order => {
            const start = parseHeure(order.date, order.heure);
            const end = moment(start).add(5, 'hours').toDate(); // Assuming 5 hours duration
            return {
                id: order._id,
                title: `${order.code_bon} - ${order.client_id.name}`,
                start,
                end,
                resource: order.client_id._id,
                status: order.status,
                backgroundColor: getStatusColor(order.status),
            };
        });
        setEvents(events);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'En cours':
                return '#FFD700'; // Yellow
            case 'Terminé':
                return '#FF4500'; // Red
            case 'Annulé':
                return '#808080'; // Grey
            default:
                return '#0000FF'; // Default blue
        }
    };

    const handleSelectEvent = (event) => {
        setSelectedEvent(event);
        setNewStatus(event.status);
        setShowModal(true);
    };

    const handleStatusChange = (e) => {
        setNewStatus(e.target.value);
    };

    const handleUpdateStatus = async () => {
        if (selectedEvent) {
            const orderId = selectedEvent.id;
            await axios.put(`http://localhost:8080/bon_production/${orderId}/status`, { status: newStatus });
            const updatedOrders = productionOrders.map(order => order._id === orderId ? { ...order, status: newStatus } : order)
                .filter(order => order.status !== 'Terminé');
            setProductionOrders(updatedOrders);
            setupCalendarEvents(updatedOrders);
            setShowModal(false);
        }
    };

    return (
        <div className="grid-container">
        <Header OpenSidebar={OpenSidebar}/>
        <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
        <div className="container">
        <div style={{ padding: '20px' }}>
            <div style={{ marginBottom: '20px' }}>
            <h1 className="title-all">Planning de Production</h1>
            </div>
            <div>
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: '500px' }}
                    selectable
                    onSelectEvent={handleSelectEvent}
                    eventPropGetter={(event) => {
                        const backgroundColor = event.backgroundColor;
                        return { style: { backgroundColor, color: 'white', border: 'none', padding: '5px', fontSize: '0.9em' } };
                    }}
                />
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton style={{ backgroundColor: '#f7f7f7' }}>
                    <Modal.Title style={{ color: '#333' }}>Modifier le statut</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formStatus">
                            <Form.Label>Statut</Form.Label>
                            <Form.Control as="select" value={newStatus} onChange={handleStatusChange}>
                                <option value="En cours">En cours</option>
                                <option value="Terminé">Terminé</option>
                                <option value="Annulé">Annulé</option>
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button variant="secondary" onClick={() => setShowModal(false)} style={{ backgroundColor: '#6c757d', borderColor: '#6c757d' }}>
                        Annuler
                    </Button>
                    <Button variant="primary" onClick={handleUpdateStatus} style={{ backgroundColor: '#007bff', borderColor: '#007bff' }}>
                        Mettre à jour
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
        </div>

        </div>

    );
};

export default ProductionPlanning;
