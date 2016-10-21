'use strict';

/**
 * Module dependencies.
 */

const home = require('../app/controllers/home');
const i    = require('../api/controllers/iController');
const botMessenger = require('../api/controllers/messengerController');
const levelController = require('../app/controllers/levelController')

/**
 * Expose
 */

module.exports = function (app, passport) {
  app.get('/api',i.place);
  app.get('/', home.index);
  app.get('/webhook',botMessenger.webhook);
  app.post('/webhook',botMessenger.webhookpost);
  app.post('/telerivet',botMessenger.telerivetPost);

  /**
   * route level
   */
  app.get('/level',levelController.index);
  app.get('/addlevel',levelController.add)

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
    res.status(500).render('500', { error: err.stack });
  });

  // assume 404 since no middleware responded
  app.use(function (req, res, next) {
    res.status(404).render('404', {
      url: req.originalUrl,
      error: 'Not found'
    });
  });
};
