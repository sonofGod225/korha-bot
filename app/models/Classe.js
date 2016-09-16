var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var classeSchema = new Schema({
    name: { type: String, default: '' },
    commentaireBot: { type: String, default: '' }
});

module.exports = mongoose.model('Classe',classeSchema);
