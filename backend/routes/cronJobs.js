const cron = require('node-cron');
const moment = require('moment');
const BonProduction = require('../models/BonProduction');

// Function to check and update the status of production orders
const checkAndUpdateOrders = async () => {
    try {
        const orders = await BonProduction.find();
        const updates = orders.map(async (order) => {
            const start = moment(order.date).set({ hour: parseInt(order.heure.split('h')[0]), minute: parseInt(order.heure.split('h')[1]) || 0 });
            const end = moment(start).add(5, 'hours');
            if (moment().isAfter(end) && order.status !== 'Terminé' && order.status !== 'Annulé') {
                order.status = 'Terminé';
                await order.save();
            }
        });
        await Promise.all(updates);
        console.log('Orders checked and updated successfully');
    } catch (error) {
        console.error('Error checking and updating orders:', error);
    }
};

// Schedule the checkAndUpdateOrders function to run every minute
cron.schedule('* * * * *', checkAndUpdateOrders);

module.exports = checkAndUpdateOrders;
