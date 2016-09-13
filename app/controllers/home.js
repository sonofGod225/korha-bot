/*!
 * Module dependencies.
 */

exports.index = function (req, res) {

    const typePlace = req.params.typePlace;

    res.render('home/index', {
        title: 'Node Express Mongoose Boilerplate'
    });
};
