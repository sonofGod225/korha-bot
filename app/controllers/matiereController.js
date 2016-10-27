const Matiere = require('../models/matiere');
const classRoom = require('../models/classroom');
exports.index = function (req, res) {
    Matiere
        .find()
        .populate('classroom_id')
        .exec(function (err, matiere) {
        if (err) {
            throw error('Erreur lors de la recuperation des matières')
        }

        console.log(JSON.stringify(matiere));
        res.render('matiere/index', {
            allMatiere: matiere,
            title: "Liste des Matières"
        })
    });
};

exports.add = function (req, res) {
    classRoom.find({}, function (err, classes) {
        if (err) {
            throw error('Erreur lors de la recuperation des ')
        }

        res.render('matiere/add', {
            title: "Ajout de matière",
            allClass: classes
        })
    });

};

exports.addPost = function (req, res) {
    const matiereObj = new Matiere({
        name: req.body.name,
        classroom_id: req.body.classroom_id,
        description: req.body.description,
        commentaireBot: req.body.commentaireBot
    });

    matiereObj.save((saveErr)=> {
        if (saveErr) {
            req.flash('errors', {msg: "Une erreur est survenue pendant la creation de la matière !"});
            throw new error('Une erreur est survenur pendant la creation de la matiere!')
        }

        req.flash('success', {msg: "La matière à été enregistrés avec success !"});
        classRoom.find({}, function (err, classes) {
            if (err) {
                throw error('Erreur lors de la recuperation des ')
            }

            res.render('matiere/add', {
                title: "Ajout de matière",
                allClass: classes
            })
        });

    });

}


exports.edit = function (req, res) {
    const matiereId = req.params.matiere_id;
    Matiere.findOne({_id: matiereId}).populate('classroom_id').exec((err, matiere)=> {
        if (err) {
            res.status(404).render('404', {
                error: 'Not found'
            });
        }
        classRoom.find({}, function (err, classes) {
            if (err) {
                throw error('Erreur lors de la recuperation des Niveaux')
            }
            res.render('matiere/edit', {
                title: "Modification de la matière",
                matiere: matiere,
                allClass: classes
            })
        });

    })

}

exports.editPost = function (req, res) {
    const matiereId = req.params.matiere_id;
    Matiere.findOne({_id: matiereId}, (err, matiere)=> {
        if (err) {
            res.status(404).render('404', {
                error: 'Not found'
            });
        }
        matiere.name = req.body.name;
        matiere.description = req.body.description;
        matiere.classroom_id = req.body.classroom_id;
        matiere.commentaireBot = req.body.commentaireBot;
        matiere.save(function (err, matiereUpdate) {
            if (err) {
                req.flash('errors', {msg: "Une erreur est survenue pendant la modification de la matière !"});
                throw new error('Une erreur est survenur pendant la creation de la matière!')
            }
            Matiere.findOne({_id: matiereUpdate._id}).populate('classroom_id').exec((err, matiere)=> {
                if (err) {
                    res.status(404).render('404', {
                        error: 'Not found'
                    });
                }
                classRoom.find({}, function (err, classes) {
                    if (err) {
                        throw error('Erreur lors de la recuperation des Niveaux')
                    }
                    res.render('matiere/edit', {
                        title: "Modification de la matière",
                        matiere: matiere,
                        allClass: classes
                    })
                });

            })
        })

    })
}


exports.delete = function (req, res) {
    const matiereId = req.params.matiere_id;
    Matiere.remove({_id: matiereId}, (err)=> {
        if (err) {
            res.status(500).json({error: 'une erreur est survenue pendant la suppression!'});
        } else {
            res.json({success: 'La matière à été supprimer avec succes!'})
        }
    })
}