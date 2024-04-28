const mongoose = require('mongoose');

const categorieSchema = new mongoose.Schema({
   name:{
    type:String,
    required:true 
   },
   description:{
    type: String ,
    required:false
   },
  
    IsActive: {
        type: Boolean, 
        default: true
    }
   
    }

);

const categorie = mongoose.model('categorie', categorieSchema);

module.exports = categorie;
