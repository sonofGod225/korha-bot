var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var thematiqueSchema = new Schema({
    name: { type: String, default: '' },
    commentaireBot: { type: String, default: '' }
});

module.exports = mongoose.model('Thematique',thematiqueSchema);
