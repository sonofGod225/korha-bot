var mongoose = require('mongoose');
var userPlugin = require('mongoose-user');
var Schema = mongoose.Schema;

var matiereSchema = new Schema({
    name: { type: String, default: '' },
    description: { type: String, default: '' },
    commentaireBot: { type: String, default: '' },
    classroom_id:{type: String, ref: 'ClasseRoom'}
});


module.exports = mongoose.model('Matiere',matiereSchema);
