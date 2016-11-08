const models = require('../models-sqelize');
const request = require('request');
exports.cours = function (req, res) {
    const lessonId = req.params.lessonId;
    const gradeid = req.params.gradeid;
    const courseid = req.params.courseid;
    const chapterid = req.params.chapterid;
    const userid = req.params.userid;
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
            userid: userid,
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


