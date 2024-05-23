import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/fr'; // Import French locale
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Sidebar from '../SidebarProduction';
import Header from '../../../../components/Main/Header';
import './ProductionPlanning.css';

moment.locale('fr'); // Set French as the default locale
const localizer = momentLocalizer(moment);

const messages = {
    date: 'Date',
    time: 'Heure',
    event: 'Événement',
    allDay: 'Toute la journée',
    week: 'Semaine',
    work_week: 'Semaine de travail',
    day: 'Jour',
    month: 'Mois',
    previous: 'Précédent',
    next: 'Suivant',
    yesterday: 'Hier',
    tomorrow: 'Demain',
    today: "Aujourd'hui",
    agenda: 'Agenda',
    noEventsInRange: "Aucun événement dans cette période.",
    showMore: total => `+ ${total} plus`,
};

const ProductionPlanning = () => {
    const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
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
            setProductionOrders(response.data.bonsProduction);
            setupCalendarEvents(response.data.bonsProduction);
        } catch (error) {
            console.error('Erreur lors de la récupération des bons de production:', error);
        }
    };

    const checkAndUpdateOrders = async () => {
        const updatedOrders = await Promise.all(productionOrders.map(async (order) => {
            const start = parseHeure(order.date, order.heure);
            const end = moment(start).add(2, 'hours');
            if (moment().isAfter(end) && order.status !== 'Terminé' && order.status !== 'Annulé') {
                await axios.put(`http://localhost:8080/bon_production/${order._id}/status`, { status: 'Terminé' });
                return { ...order, status: 'Terminé' };
            }
            return order;
        }));
        setProductionOrders(updatedOrders);
        setupCalendarEvents(updatedOrders);
    };

    const parseHeure = (date, heure) => {
        const [hour, minute] = heure.split(':').map(Number);
        return moment(date).set({ hour, minute: minute || 0 }).toDate();
    };

    const setupCalendarEvents = (orders) => {
        const events = orders.map(order => {
            const start = parseHeure(order.date, order.heure);
            const end = moment(start).add(2, 'hours').toDate(); // Assuming 5 hours duration
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
            const updatedOrders = productionOrders.map(order => 
                order._id === orderId ? { ...order, status: newStatus } : order
            );
            setProductionOrders(updatedOrders);
            setupCalendarEvents(updatedOrders);
            setShowModal(false);
        }
    };

    return (
        <div className="grid-container">
            <Header OpenSidebar={OpenSidebar} />
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
                            style={{ height: '500px', width: '1200px' }}
                            step={60} // Change the step to 60 minutes for Day and Week views
                            timeslots={1} // Change the number of timeslots per hour to 1 for Day and Week views
                            selectable
                            onSelectEvent={handleSelectEvent}
                            messages={messages}
                            eventPropGetter={(event) => {
                                const backgroundColor = event.backgroundColor;
                                return { style: { backgroundColor, color: 'white', border: 'none', padding: '5px', fontSize: '0.9em' } };
                            }}
                        />
                    </div>

                    {showModal && (
                        <div className="custom-modal-overlay">
                            <div className="custom-modal">
                                <div className="custom-modal-header">
                                    <span className="custom-modal-title">Modifier le statut</span>
                                    <button className="custom-modal-close" onClick={() => setShowModal(false)}>
                                        &times;
                                    </button>
                                </div>
                                <div className="custom-modal-body">
                                    <label htmlFor="formStatus">Statut</label>
                                    <select
                                        id="formStatus"
                                        value={newStatus}
                                        onChange={handleStatusChange}
                                        className="custom-modal-select"
                                    >
                                        <option value="En cours">En cours</option>
                                        <option value="Terminé">Terminé</option>
                                        <option value="Annulé">Annulé</option>
                                    </select>
                                </div>
                                <div className="custom-modal-footer">
                                    <button onClick={() => setShowModal(false)} className="custom-modal-button custom-modal-button-secondary">
                                        Annuler
                                    </button>
                                    <button onClick={handleUpdateStatus} className="custom-modal-button custom-modal-button-primary">
                                        Mettre à jour
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductionPlanning;
