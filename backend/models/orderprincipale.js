const mongoose = require('mongoose');

const orderprincipaleSchema = new mongoose.Schema({
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Provider'
      }
    }

);

const Orderprincipale = mongoose.model('Orderprincipale', orderprincipaleSchema);

module.exports = Orderprincipale;
