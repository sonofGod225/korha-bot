var mongoose = require('mongoose');
var userPlugin = require('mongoose-user');
var Schema = mongoose.Schema;

var matiereSchema = new Schema({
    name: { type: String, default: '' },
    commentaireBot: { type: String, default: '' }
});


module.exports = mongoose.model('Matiere',matiereSchema);
