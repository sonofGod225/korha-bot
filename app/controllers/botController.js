const models = require('../models-sqelize');
exports.cours = function (req, res) {
     const lessonId = req.params.lessonId;
    const senderId =  req.params.senderId;
     models.lessons.findOne({
         attributes: ['id', 'name', 'slug', 'short', 'video', 'thumbnail', 'preview', 'order'],
         where:{
             id:lessonId
         }
     }).then(function (lesson) {
         res.render('bot/lessons',{
             lesson:lesson
         });
     })

};

