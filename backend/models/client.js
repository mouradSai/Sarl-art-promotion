const mongoose = require('mongoose');

const clientSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    prenom: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    address: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    IsActive: {
        type: Boolean, 
        default: true
    }
}, {
    timestamps: true,
});

const Client = mongoose.model('Client', clientSchema);
module.exports = Client;
