var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var classRoomSchema = new Schema({
    name: { type: String, default: '' },
    description: { type: String, default: '' },
    commentaireBot: { type: String, default: '' }
});

module.exports = mongoose.model('ClasseRoom',classRoomSchema);
