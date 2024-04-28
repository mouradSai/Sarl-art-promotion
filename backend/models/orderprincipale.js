const mongoose = require('mongoose');

const orderprincipaleSchema = new mongoose.Schema({
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Provider'
      },
      code_orderprincipale:{
        type:String ,
        required:true
      },
      total:{
        type:Integer,
       required:true,
       default :0 
    },
    date: {
      type: Date,
      default: Date.now
    }

    }

);

const Orderprincipale = mongoose.model('Orderprincipale', orderprincipaleSchema);

module.exports = Orderprincipale;
