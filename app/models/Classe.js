var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var classSchema = new Schema({
    name: { type: String, default: '' },
    commentaireBot: { type: String, default: '' }
});

module.exports = mongoose.model('Classe',classSchema);
