const classRoom = require('../models/classroom');
const model = require('../models-sqelize/index');
exports.index = function (req, res) {
    const allGrades = model.grades.findAll({
        attributes: ['name', 'slug','order']
    }).then(function(grades) {
        console.log(JSON.stringify(grades));
    });


    const allClass = classRoom.find({}, function (err, classes) {
        if (err) {
            throw error('Erreur lors de la recuperation des ')
        }
        console.log(JSON.stringify(classes));
        res.render('level/index', {
            allClass: classes,
            title: "Liste des Niveaux"
        })
    });
};

exports.add = function (req, res) {
    res.render('level/add', {
        title: "Ajout de niveau"
    })
};

exports.addPost = function (req, res) {
    const levelObj = new classRoom({
        name: req.body.name,
        description: req.body.description,
        commentaireBot: req.body.commentaireBot
    });

    levelObj.save((saveErr)=> {
        if (saveErr) {
            req.flash('errors', {msg: "Une erreur est survenue pendant la creation du niveau !"});
            throw new error('Une erreur est survenur pendant la creation du niveau!')
        }

        req.flash('success', {msg: "Le niveau à été enregistré avec success !"});
        res.render('level/add', {
            title: "Ajout de niveau"
        })
    });

}


exports.edit = function (req, res) {
    const levelId = req.params.level_id;
    classRoom.findOne({_id: levelId}, (err, level)=> {
        if (err) {
            res.status(404).render('404', {
                error: 'Not found'
            });
        }
        res.render('level/edit', {
            title: "Modification de niveau",
            level: level
        })
    })

}

exports.editPost = function (req, res) {
    const levelId = req.params.level_id;
    classRoom.findOne({_id: levelId}, (err, level)=> {
        if (err) {
            res.status(404).render('404', {
                error: 'Not found'
            });
        }
        level.name = req.body.name;
        level.description = req.body.description;
        level.commentaireBot = req.body.commentaireBot;
        level.save(function (err, levelUpdate) {
            if (err) {
                req.flash('errors', {msg: "Une erreur est survenue pendant la modification du niveau !"});
                throw new error('Une erreur est survenur pendant la creation du niveau!')
            }
            req.flash('success', {msg: "Le niveau a été modifier avec succes !"});
            res.render('level/edit', {
                title: "Modification de niveau",
                level: levelUpdate
            })
        })

    })
}


exports.delete = function (req, res) {
    const levelId = req.params.level_id;
    console.log(levelId);
    classRoom.remove({_id: levelId}, (err)=> {
        if(err){
            console.log(JSON.stringify(err));
            res.status(500).json({ error: 'une erreur est survenue pendant la suppression!' });
        }else{
            res.json({success:'Le niveau à été supprimer avec succes!'})
        }
    })
}