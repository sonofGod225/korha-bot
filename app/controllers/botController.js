const models = require('../models-sqelize');
exports.cours = function (req, res) {
     const lessonId = req.params.lessonId;
     models.lessons.findOne({
         attributes: ['id', 'name', 'slug', 'short', 'video', 'thumbnail', 'preview', 'order','body'],
         where:{
             id:lessonId
         }
     }).then(function (lesson) {
         res.render('bot/lessons',{
             lesson:lesson
         });
     })

};

