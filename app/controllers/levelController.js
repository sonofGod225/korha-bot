const classRoom = require('../models/classroom');
exports.index = function (req, res) {
    const allClass = classRoom.find({}, function (err, classes) {
        if (err) {
            throw error('Erreur lors de la recuperation des ')
        }
        res.render('level/index', {
            allClass: classes,
            title:"Liste des Niveaux"
        })
    });
};

exports.add = function(req,res){
    res.render('level/add',{
        title:"Ajout de niveau"
    })
};