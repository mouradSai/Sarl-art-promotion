const mongoose = require('mongoose');

const providerSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    number: {
        type: String, 
        required: true,
    },
    comment: {
        type: String,
        required: false,
    },
    IsActive: {
        type: Boolean, 
        default: true
    }
   
}, {
    timestamps: true,
});

const Provider = mongoose.model('provider', providerSchema);
module.exports = Provider;
