'use strict';

/**
 * Module dependencies.
 */

const home = require('../app/controllers/home');
const i = require('../api/controllers/iController');
const botMessenger = require('../api/controllers/messengerController');
const levelController = require('../app/controllers/levelController');
const matiereController = require('../app/controllers/matiereController');
const thematiqueController = require('../app/controllers/matiereController');
const botController = require('../app/controllers/botController');

/**
 * Expose
 */

module.exports = function (app, passport) {
    app.get('/api', i.place);
    app.get('/', home.index);
    app.get('/webhook', botMessenger.webhook);
    app.post('/webhook', botMessenger.webhookpost);
    app.post('/telerivet', botMessenger.telerivetPost);

    /**
     * route level
     */
    app.get('/level', levelController.index);
    app.get('/addlevel', levelController.add);
    app.post('/addlevel', levelController.addPost);
    app.get('/level/:level_id', levelController.edit);
    app.post('/level/:level_id', levelController.editPost);
    app.get('/deletelevel/:level_id', levelController.delete)


    /**
     * route des matières
     */

    app.get('/matiere', matiereController.index);
    app.get('/addmatiere', matiereController.add);
    app.post('/addmatiere', matiereController.addPost);
    app.get('/matiere/:matiere_id', matiereController.edit);
    app.post('/matiere/:matiere_id', matiereController.editPost);
    app.get('/deletematiere/:matiere_id', matiereController.delete)



    /**
     * route des thematiques
     */

    app.get('/thematique', thematiqueController.index);
    app.get('/addthematique', thematiqueController.add);
    app.post('/addthematique', thematiqueController.addPost);
    app.get('/thematique/:thematique_id', thematiqueController.edit);
    app.post('/thematique/:thematique_id', thematiqueController.editPost);
    app.get('/deletethematique/:thematique_id', thematiqueController.delete);

    /**
     * route du bot facebook
     */
     app.get('/bot/lesson/:lessonId',botController.cours)
    /**
     * Error handling
     */

    app.use(function (err, req, res, next) {
        // treat as 404
        if (err.message
            && (~err.message.indexOf('not found')
            || (~err.message.indexOf('Cast to ObjectId failed')))) {
            return next();
        }
        console.error(err.stack);
        // error page
        res.status(500).render('500', {error: err.stack});
    });

    // assume 404 since no middleware responded
    app.use(function (req, res, next) {
        res.status(404).render('404', {
            url: req.originalUrl,
            error: 'Not found'
        });
    });
};
