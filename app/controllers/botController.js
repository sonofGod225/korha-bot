const models = require('../models-sqelize');
exports.cours = function (req, res) {
    const lessonId = req.params.lessonId;
    const gradeid = req.params.gradeid;
    const courseid = req.params.courseid;
    const chapterid = req.params.chapterid;
    models.lessons.findOne({
        attributes: ['id', 'name', 'slug', 'short', 'video', 'thumbnail', 'preview', 'order', 'body'],
        where: {
            id: lessonId
        }
    }).then(function (lesson) {
        res.render('bot/lessons', {
            lesson: lesson,
            gradeid: gradeid,
            courseid: courseid,
            chapterid: chapterid
        });
    })

};

exports.quiz = function (req, res) {
    const slug = req.params.slug;
    res.render('bot/slug', {
        slug: slug
    });
}


exports.botsendquiz = function (req, res) {
    const lessonId  = req.params.lessonId;
    const userId    = req.params.userId;
    const gradeid   = req.params.gradeid;
    const courseid  = req.params.courseid;
    const chapterid = req.params.chapterid;
    models.sequelize.query('SELECT id,timer,lesson_id FROM quiz WHERE lesson_id = :lesson_id ', {
        replacements: {
            lesson_id: lessonId,
            type: models.sequelize.QueryTypes.SELECT
        }
    }).then(function (quiz) {
        // verification si la lesson à un quiz
        if (quiz[0].length) {//si quiz

        } else { // si pas de quiz

        }
    })

}

