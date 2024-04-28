const mongoose = require('mongoose');

const entrepotSchema = new mongoose.Schema({
   name:{
    type:String,
    required:true 
   },
    IsActive: {
        type: Boolean, 
        default: true
    }
   
    }

);

const entrepot = mongoose.model('entrepot', entrepotSchema);

module.exports = entrepot;
