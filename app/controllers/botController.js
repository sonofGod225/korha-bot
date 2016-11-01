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

exports.quiz = function(req,res){
    const slug = req.params.slug;
    res.render('cours/quiz-bot',{
        slug:slug
    });
}

