var Promise = require('promise');
var User = require('../../app/models/user');
var Matiere = require('../../app/models/matiere');
var Classeroom = require('../../app/models/classroom');
var Thematique = require('../../app/models/thematique');
const request = require('request');
const config = require('../../config');
const VALIDATION_TOKEN = config.facebookmessenger.validationToken;
const PAGE_ACCESS_TOKEN = config.facebookmessenger.pageAccessToken;
const PAGE_WEB_VIEW = config.facebookmessenger.webViewURL;
const PAGE_WEB_VIEW_SUCCESS_ASSURE = 'http://www.succes-assure.com/';
const axios = require('axios');
const delimiter = "_@@_";
const models = require('../../app/models-sqelize');
const messageBote = require('../../data/message');
const _ = require('lodash');



exports.botsendquiz = function (req, res) {
    const lessonId = req.params.lessonId;
    const userId = req.params.userId;
    const gradeid = req.params.gradeid;
    const courseid = req.params.courseid;
    const chapterid = req.params.chapterid;
    sendButtonAfterCourse(userId, lessonId, gradeid, courseid, chapterid);
    res.status(200).json({'success': 'callback send'})

}
exports.webhook = function (req, res) {
    if (req.query['hub.mode'] === 'subscribe' &&
        req.query['hub.verify_token'] === VALIDATION_TOKEN) {
        console.log("Validating webhook");
        res.status(200).send(req.query['hub.challenge']);
    } else {
        console.error("Failed validation. Make sure the validation tokens match.");
        res.sendStatus(403);
    }
};

exports.webhookpost = function (req, res) {

    var data = req.body;

    // Make sure this is a page subscription
    if (data.object == 'page') {
        // Iterate over each entry
        // There may be multiple if batched
        data.entry.forEach(function (pageEntry) {
            var pageID = pageEntry.id;
            var timeOfEvent = pageEntry.time;

            // Iterate over each messaging event
            pageEntry.messaging.forEach(function (messagingEvent) {
                if (messagingEvent.optin) {
                    receivedAuthentication(messagingEvent);
                } else if (messagingEvent.message) {
                    receivedMessage(messagingEvent);
                } else if (messagingEvent.delivery) {
                    receivedDeliveryConfirmation(messagingEvent);
                } else if (messagingEvent.postback) {
                    receivedPostback(messagingEvent);
                } else if (messagingEvent.quick_reply) {
                    console.log("quick_reply");
                } else {
                    console.log("Webhook received unknown messagingEvent: ", messagingEvent);
                }
            });
        });

        // Assume all went well.
        //
        // You must send back a 200, within 20 seconds, to let us know you've
        // successfully received the callback. Otherwise, the request will time out.
        res.sendStatus(200);
    }
}

exports.telerivetPost = function (req, res) {
    var data = req.body;
    var senderPayment = data.senderPayment;
    var montantTimbre = data.montantTimbre;
    var montantCredit = data.montantCredit;
    var paymentId = data.paymentId;
    var contentReplyMessage = "le transfert de " + montantCredit + " a été effectué par " + senderPayment + " avec des frais de timbre " + montantTimbre + " ID de paiement: " + paymentId;

    User.find(function (err, users) {
        if (err) {
            throw new error("erreur recuperation des utilisateur");
        }
        users.forEach(function (user) {
            sendTextMessage(user.user_id, contentReplyMessage);
        })
    });
    res.sendStatus(200);
}
function receivedMessage(event) {
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var timeOfMessage = event.timestamp;
    var message = event.message;
    var isEcho = message.is_echo;
    var appId = message.app_id;
    var metadata = message.metadata;
    var quickReply = message.quick_reply;

    console.log("Received message for user %d and page %d at %d with message:",
        senderID, recipientID, timeOfMessage);
    console.log(JSON.stringify(message));

    var messageId = message.mid;

    if (isEcho) {
        // Just logging message echoes to console
        console.log("Received echo for message %s and app %d with metadata %s",
            messageId, appId, metadata);
        return;
    } else if (quickReply) {
        var quickReplyPayload = quickReply.payload;
        console.log("Quick reply for message %s with payload %s",
            messageId, quickReplyPayload);

        console.log("quik_reply_ok");

        const arrayPayload = quickReplyPayload.split(delimiter);
        switch (arrayPayload[0]) {

            case 'choes_chapter' :
            {
                const chapterId = arrayPayload[1];
                const gradeId = arrayPayload[2];
                const courseId = arrayPayload[3];
                const offset = arrayPayload[4];


                const commentaireBotChpter = "Choisi maintenant la leçon à reviser !";
                sendTypingOn(senderID).then(function () {
                    sendTextMessage(senderID, commentaireBotChpter).then(function () {
                        sendTypingOn(senderID).then(function () {
                            sendButtonMessageWithLesson(senderID, gradeId, courseId, chapterId, offset)
                        });
                    });
                });
                break;
            }
            case 'choes_grade' :
            {
                const gradeId = arrayPayload[1];
                // recuperation du detail du grade
                models.grades.findOne({
                    attributes: ['id', 'name', 'slug', 'comment_bot', 'order'],
                    where: {
                        id: gradeId
                    }
                }).then(function (grade) {
                    const commentaireBotGrade = grade.comment_bot;
                    sendTypingOn(senderID).then(function () {
                        sendTextMessage(senderID, commentaireBotGrade).then(function () {
                            sendTypingOn(senderID).then(function () {
                                sendButtonMessageWithMatiere(senderID, gradeId)
                            });
                        });
                    });
                });

                break;
            }
            case 'choes_course' :
            {
                const courseId = arrayPayload[1];
                const gradeId = arrayPayload[2];
                let chapterId = arrayPayload[3] ? arrayPayload[3] : '';
                const commentaireBotCourse = "Choisi maintenant une thématique !";
                sendTypingOn(senderID).then(function () {
                    sendTextMessage(senderID, commentaireBotCourse).then(function () {
                        sendTypingOn(senderID).then(function () {
                            sendButtonMessageWithChapter(senderID, gradeId, courseId, chapterId)
                        });
                    });
                });


                break;
            }
            case 'response_invitation':
            {
                const responseInviteation = arrayPayload[1];
                if (responseInviteation == 'yes') {
                    sendTypingOn(senderID).then(function () {
                        let msg = messageBote.getRandomInviteYes();
                        sendButtonMessageWithGrade(senderID, msg);
                    })
                } else {
                    let msg = messageBote.getRandomInviteNo();
                    sendTextMessage(senderID, msg);
                }
                break;
            }
        }

        return;
    }


    // You may get a text or attachment but not both
    var messageText = message.text;
    var messageAttachments = message.attachments;

    if (messageText) {

        // If we receive a text message, check to see if it matches any special
        // keywords and send back the corresponding example. Otherwise, just echo
        // the text we received.
        switch (messageText) {
            case 'image':
                sendImageMessage(senderID);
                break;
            case 'button':
                sendButtonMessage(senderID);
                break;

            case 'generic':
                sendGenericMessage(senderID);
                break;

            case 'receipt':
                sendReceiptMessage(senderID);
                break;
            default:
                getDetailUser(senderID).then(function (user) {
                    console.log("detail user 219" + JSON.stringify(user));
                    let msg = messageBote.getRandomWelcom();
                    msg = _.replace(msg, '@name', user.first_name);
                    console.log("message 219" + msg);
                    sendTextMessage(senderID, msg)
                        .then(function () {
                            sendTypingOn(senderID).then(function () {
                                const messageClass = messageBote.getRandomClass();
                                sendButtonMessageWithGrade(senderID, messageClass);
                            });
                        })
                })

        }
    } else if (messageAttachments) {
        getDetailUser(senderID).then(function (user) {
            console.log("detail user 234" + JSON.stringify(user));
            let msg = messageBote.getRandomWelcom();
            msg = _.replace(msg, '@name', user.first_name);
            sendTextMessage(senderID, msg)
                .then(function () {
                    sendTypingOn(senderID).then(function () {
                        const messageClass = messageBote.getRandomClass();
                        sendButtonMessageWithGrade(senderID, messageClass);
                    })

                })
        })
        //sendTextMessage(senderID, "Message with attachment received");
    }
}

function sendTextMessage(recipientId, messageText) {
    return new Promise(function (fulfill, reject) {
        var messageData = {
            recipient: {
                id: recipientId
            },
            message: {
                text: messageText
            }
        };
        callSendAPI(messageData).then(function () {
            fulfill()
        });
    })

}

function callSendAPI(messageData) {
    return new Promise(function (resultPromise, rejectPomise) {
        request({
            uri: 'https://graph.facebook.com/v2.6/me/messages',
            qs: {access_token: PAGE_ACCESS_TOKEN},
            method: 'POST',
            json: messageData

        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var recipientId = body.recipient_id;
                var messageId = body.message_id;
                //console.log("Successfully sent generic message with id %s to recipient %s", messageId, recipientId);
                resultPromise();

            } else {
                //console.error("Unable to send message.");
                //console.error(response);
                console.error(error);
                rejectPomise()
            }
        });
    });

}
function getDetailUser(user_id) {
    return new Promise(function (fulfill, rejected) {
        models.bot_users.findOne({
            attributes: ['id', 'facebook_id', 'first_name', 'last_name'],
            where: {
                facebook_id: user_id
            }
        }).then(function (user) {
            if (user) {
                fulfill(user);
                console.log('Account with this user_id already exists!');

            } else {
                saveUserDetail(user_id).then(function (user) {
                    fulfill(user);
                })
            }
        });
    })
}
function saveUserDetail(user_id) {
    return new Promise(function (fulfill, rejected) {
        const urlUserProfil = "https://graph.facebook.com/v2.6/" + user_id + "?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=" + PAGE_ACCESS_TOKEN;
        axios.get(urlUserProfil).then(function (response) {
            const body = response.data;
            let UserObj = {
                facebook_id: user_id,
                first_name: body.first_name,
                last_name: body.last_name
            };
            models.bot_users.findOne({
                attributes: ['id', 'facebook_id', 'first_name', 'last_name'],
                where: {
                    facebook_id: user_id
                }
            }).then(function (user) {
                if (user) {
                    fulfill(user);
                    console.log('Account with this user_id already exists!');
                } else {
                    models.bot_users.create(UserObj);
                }

            });

            fulfill(UserObj);
        })
    })

    /*request({
     uri: 'https://graph.facebook.com/v2.6/' + user_id,
     qs: {access_token: PAGE_ACCESS_TOKEN, fields: 'first_name,last_name,profile_pic,locale,timezone,gender'},
     method: 'GET'
     }, (error, response, body)=> {
     if (!error && response.statusCode == 200) {


     }
     });*/
}

function sendGenericMessage(recipientId) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "generic",
                    elements: [{
                        title: "marius koudou",
                        subtitle: "Next-generation virtual reality",
                        item_url: "https://www.oculus.com/en-us/rift/",
                        image_url: "http://messengerdemo.parseapp.com/img/rift.png",
                        buttons: [{
                            type: "web_url",
                            url: "https://www.oculus.com/en-us/rift/",
                            title: "Open Web URL"
                        }, {
                            type: "postback",
                            title: "Call Postback",
                            payload: "Payload for first bubble",
                        }],
                    }, {
                        title: "touch",
                        subtitle: "Your Hands, Now in VR",
                        item_url: "https://www.oculus.com/en-us/touch/",
                        image_url: "http://messengerdemo.parseapp.com/img/touch.png",
                        buttons: [{
                            type: "web_url",
                            url: "https://www.oculus.com/en-us/touch/",
                            title: "Open Web URL"
                        }, {
                            type: "postback",
                            title: "Call Postback",
                            payload: "Payload for second bubble",
                        }]
                    }]
                }
            }
        }
    };

    callSendAPI(messageData);
}

function receivedDeliveryConfirmation(event) {
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var delivery = event.delivery;
    var messageIDs = delivery.mids;
    var watermark = delivery.watermark;
    var sequenceNumber = delivery.seq;

    if (messageIDs) {
        messageIDs.forEach(function (messageID) {
            console.log("Received delivery confirmation for message ID: %s",
                messageID);
        });
    }

    console.log("All message before %d were delivered.", watermark);
}

function receivedAuthentication(event) {
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var timeOfAuth = event.timestamp;

    // The 'ref' field is set in the 'Send to Messenger' plugin, in the 'data-ref'
    // The developer can set this to an arbitrary value to associate the
    // authentication callback with the 'Send to Messenger' click event. This is
    // a way to do account linking when the user clicks the 'Send to Messenger'
    // plugin.
    var passThroughParam = event.optin.ref;

    console.log("Received authentication for user %d and page %d with pass " +
        "through param '%s' at %d", senderID, recipientID, passThroughParam,
        timeOfAuth);

    // When an authentication is received, we'll send a message back to the sender
    // to let them know it was successful.

    //enregistrement de l'utilisateur dans la bd
    const urlUserProfil = "https://graph.facebook.com/v2.6/" + senderID + "?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=" + PAGE_ACCESS_TOKEN;
    axios.get(urlUserProfil).then(function (response) {

        console.log(JSON.stringify(response.data))
        const body = response.data;

        const UserObj = {
            facebook_id: user_id,
            first_name: body.first_name,
            last_name: body.last_name
        };
        /*const user = new User({
         user_id: user_id,
         first_name: body.first_name,
         last_name: body.last_name,
         profile_pic: body.profile_pic,
         gender: body.gender
         });*/
        models.bot_users.findOne({
            attributes: ['id', 'facebook_id', 'first_name', 'last_name'],
            where: {
                facebook_id: user_id
            }
        }).then(function (user) {
            if (user) {
                console.log('Account with this user_id already exists!');
            } else {
                models.bot_users.create(UserObj);
            }
            /*sendTextMessage(senderID, "Hello  " + body.last_name + " je suis ton Coach 'succès assuré' ! \nje peux t'aider à reviser des cours du primaire au secondaire. \n Choisi ta classe pour débuter !")
             .then(function () {
             sendButtonMessageWithGrade(senderID, " ");
             })*/
            let msg = messageBote.getRandomWelcom();
            msg = _.replace(msg, '@name', user.first_name);
            sendTextMessage(senderID, msg)
                .then(function () {
                    sendTypingOn(senderID).then(function () {
                        const messageClass = messageBote.getRandomClass();
                        sendButtonMessageWithGrade(senderID, messageClass);
                    })

                })

        });

        /* const user = new User({
         user_id: senderID,
         first_name: body.first_name,
         last_name: body.last_name,
         profile_pic: body.profile_pic,
         gender: body.gender
         });

         User.findOne({user_id: senderID}, function (findErr, existingUser) {
         if (!existingUser) {
         user.save(function (saveErr) {
         if (saveErr) {
         throw new Error("une erreur est surveur pendant l'enregistre de l'utilisateur");
         }
         console.log("utilisateur enregistré avec succes !");
         });
         }

         sendButtonMessageWithMatiere(senderID, "Bonsoir " + body.first_name + " " + body.last_name + " Comment vas-tu? Que révisons-nous ce soir ? ");

         })*/
    })


}

function formatString(chaine,nbr){
   return  _.truncate(chaine, { 'length': nbr});
}

function sendButtonMessageWithThematique(recipientId, matiere_id, classe_id, message) {
    Thematique.find({matiere_id: matiere_id}, function (err, thematiques) {

        var arrayThematique = [];
        for (var i = 0; i < thematiques.length; i++) {
            var buttonThematique = {
                type: "postback",
                title: thematiques[i].name,
                payload: 'choes_thematique' + delimiter + thematiques[i]._id + delimiter + matiere_id + delimiter + classe_id
            }
            arrayThematique.push(buttonThematique);
        }
        var messageData = {
            recipient: {
                id: recipientId
            },
            message: {
                attachment: {
                    type: "template",
                    payload: {
                        template_type: "button",
                        text: message,
                        buttons: arrayThematique
                    }
                }
            }
        };
        callSendAPI(messageData);
    })
}

function sendButtonMessageWithClass(recipientId, matiere_id, message) {
    Classeroom.find(function (err, classes) {
        console.log(JSON.stringify(classes));
        var arrayClass = [];
        for (var i = 0; i < classes.length; i++) {
            var buttonClasses = {
                type: "postback",
                title: classes[i].name,
                payload: 'choes_classes' + delimiter + classes[i]._id + delimiter + matiere_id
            }
            arrayClass.push(buttonClasses);
        }
        var messageData = {
            recipient: {
                id: recipientId
            },
            message: {
                attachment: {
                    type: "template",
                    payload: {
                        template_type: "button",
                        text: message,
                        buttons: arrayClass
                    }
                }
            }
        };
        callSendAPI(messageData);
    })
}

function sendMessageMatiere(recipientId) {
    models.grades.findAll({
        attributes: ['id', 'name', 'slug', 'order']
    }).then(function (grades) {
        console.log(JSON.stringify(grades));
        var messageMatiere = "";
        for (var i = 0; i < grades.length; i++) {

            var buttonMatiere = {
                type: "postback",
                title: grades[i].name,
                payload: 'choes_course' + delimiter + grades[i].id
            };
            arrayMatiere.push(buttonMatiere);
        }

        callSendAPI(messageData);
    })
}

function sendQuikAnswerMoreLesson(recipientId, gradeid, courseid, chapterid, offset) {
    return new Promise(function (fulfill, rejected) {
        let messageData = {
            recipient: {
                id: recipientId
            },
            "message": {
                "text": "Veux tu voir d'autres lécons?",
                "quick_replies": [
                    {
                        "content_type": "text",
                        "title": "Voir plus...",
                        "payload": 'choes_chapter' + delimiter + chapterid + delimiter + gradeid + delimiter + courseid + delimiter + offset
                    }
                ]
            }
        };

        callSendAPI(messageData).then(function () {
            fulfill();
        })
    })
}

function sendButtonMessageWithLesson(recipientId, gradeid, courseid, chapterid, offset) {
    return new Promise(function (fulfill, rejected) {
        let whereObj = {chapter_id: chapterid};
        offset = parseInt(offset);
        let step = 2;
        let limit = step + 1;
        models.lessons.findAll({
            offset: offset,
            limit: limit,
            where: whereObj,
            attributes: ['id', 'name', 'slug', 'short', 'video', 'thumbnail', 'preview', 'order', 'body'],
        }).then(function (lessons) {
            console.log('elemt_dexter_quiz' + JSON.stringify(lessons));
            let nbrLesson = lessons.length;
            var elementsLesson = [];
            var stopLopp;
            // determination de la variable d'arret de la boucle
            if (nbrLesson > step) {
                stopLopp = step - 1;
            } else {
                stopLopp = nbrLesson - 1;
            }

            for (var i = 0; i < lessons.length; i++) {
                let compter = i;
                let arrayLessons = [];
                let lessonId = lessons[i].id;
                let lessonName = formatString(lessons[i].name,75);
                let lessonShort = formatString(lessons[i].short,75);
                let lessonSlug = lessons[i].slug;
                let lessonBody = lessons[i].body;
                let lessonVideo = lessons[i].video;
                let lessonThumbnail = lessons[i].thumbnail;

                models.sequelize.query('SELECT id,timer,lesson_id FROM quiz WHERE lesson_id = :lesson_id ', {
                    replacements: {
                        lesson_id: lessonId,
                        type: models.sequelize.QueryTypes.SELECT
                    }
                }).then(function (quiz) {

                    if ((lessonVideo !== undefined) && (lessonVideo !== null)) {
                        console.log("video link_" + lessonVideo);
                        let buttonLessonVideo = {
                            type: "postback",
                            title: "Video",
                            payload: 'choes_lesson_video' + delimiter + lessonId + delimiter + gradeid + delimiter + courseid + delimiter + chapterid
                        };
                        arrayLessons.push(buttonLessonVideo);
                    }

                    if (lessonBody != '') {
                        let buttonLessonText = {
                            type: "web_url",
                            title: "Prendre le cours",
                            url: PAGE_WEB_VIEW + "bot/lesson/" + lessonId + "/" + gradeid + "/" + courseid + "/" + chapterid + "/" + recipientId,
                            webview_height_ratio: "tall",
                            messenger_extensions: true,
                            fallback_url: PAGE_WEB_VIEW + "bot/lesson/" + lessonId + "/" + gradeid + "/" + courseid + "/" + chapterid + "/" + recipientId
                        };
                        arrayLessons.push(buttonLessonText);
                    }


                    if (quiz[0].length) {
                        console.log('elemt_dexter_quiz' + JSON.stringify(quiz[0]));
                        let buttonLessonQuiz = {
                            type: "web_url",
                            title: "Evaluer mes connaissances",
                            url: PAGE_WEB_VIEW + "cours/quiz-bot/" + lessonSlug,
                            webview_height_ratio: "tall",
                            messenger_extensions: true,
                            fallback_url: PAGE_WEB_VIEW + "cours/quiz-bot/" + lessonSlug
                        };
                        arrayLessons.push(buttonLessonQuiz);
                    }
                    let elementSingle = {
                        title: lessonName,
                        subtitle: lessonShort,
                        image_url: lessonThumbnail,
                        buttons: arrayLessons
                    }
                    console.log('elemt_dexter' + JSON.stringify(elementSingle));
                    elementsLesson.push(elementSingle);
                    console.log("le compteur i " + compter);
                    console.log("le compteur stopLopp " + stopLopp + " " + (compter == stopLopp));
                    if (compter == stopLopp) {
                        console.log('elemt_dexter_elements' + JSON.stringify(elementsLesson));
                        let messageData = {
                            recipient: {
                                id: recipientId
                            },
                            "message": {
                                "attachment": {
                                    "type": "template",
                                    "payload": {
                                        "template_type": "generic",
                                        "elements": elementsLesson
                                    }
                                }
                            }
                        };
                        callSendAPI(messageData).then(function () {
                            fulfill();
                            if (nbrLesson > step) {
                                // afficher un putton voir encore
                                console.log('reponse rapide ' + nbrLesson + " " + step);
                                sendQuikAnswerMoreLesson(recipientId, gradeid, courseid, chapterid, (limit - 1)).then(function () {
                                    fulfill();
                                })
                            } else {
                                fulfill();
                            }

                        });
                    }
                });

            }
        })

    });
}

function sendButtonMessageWithChapter(recipientId, gradeid, courseid, oldChapterId) {
    return new Promise(function (fulfill, rejected) {
        let whereObj;
        if (oldChapterId != '') {
            whereObj = {
                course_id: courseid,
                id: {
                    $ne: oldChapterId
                }
            }
        } else {
            whereObj = {
                course_id: courseid
            }
        }
        models.chapters.findAll({
            where: whereObj,
            attributes: ['id', 'name', 'slug', 'order'],
            order: [
                ['id', 'ASC']
            ]

        }).then(function (chapters) {
            var elements = [];
            let offset = 0;
            for (var i = 0; i < chapters.length; i++) {

                //verifion si la tematique à des lecons
                let compter = i;
                let gradeId = chapters[i].id
                let chapterName = formatString(chapters[i].name,17);
                models.lessons.findAll({
                    where: {chapter_id: gradeId},
                    limit: 1,
                    attributes: ['id'],
                }).then(function (lessons) {
                    console.log("lesson length "+lessons.length)
                    if(lessons.length>0){
                        console.log("inter in the condition "+JSON.stringify(lessons))
                        var arrayChapters = [];
                        var buttonChapter = {
                            type: "postback",
                            title: "Voir les cours",
                            payload: 'choes_chapter' + delimiter + gradeId + delimiter + gradeid + delimiter + courseid + delimiter + offset
                        };
                        arrayChapters.push(buttonChapter);
                        var elementSingle = {
                            title: chapterName,
                            image_url: "http://previews.123rf.com/images/petovarga/petovarga1509/petovarga150900003/45314478-Illustration-de-cat-gories-de-d-chets-avec-organique-papier-plastique-verre-m-tal-textile-d-chets-da-Banque-d'images.jpg",
                            buttons: arrayChapters
                        }

                        elements.push(elementSingle);
                    }

                    if(compter==(chapters.length-1)){
                        console.log("inter in the loop "+JSON.stringify(elements))
                        var messageData = {
                            recipient: {
                                id: recipientId
                            },
                            "message": {
                                "attachment": {
                                    "type": "template",
                                    "payload": {
                                        "template_type": "generic",
                                        "elements": elements
                                    }
                                }
                            }
                        };
                        callSendAPI(messageData).then(function () {
                            fulfill();
                        });
                    }
                })

            }

        })
    });
}

function sendButtonMessageWithMatiere(recipientId, gradeid) {
    return new Promise(function (fulfill, rejected) {
        models.courses.findAll({
            where: {
                grade_id: gradeid
            },
            attributes: ['id', 'name', 'slug', 'order'],
            order: [
                ['id', 'ASC']
            ]

        }).then(function (courses) {
            console.log(JSON.stringify(courses));

            var elements = [];
            for (var i = 0; i < courses.length; i++) {
                var arrayCourses = [];
                var buttonCourse = {
                    "title": courses[i].name,
                    "content_type": "text",
                    payload: 'choes_course' + delimiter + courses[i].id + delimiter + gradeid
                };
                elements.push(buttonCourse);
            }
            var messageData = {
                recipient: {
                    id: recipientId
                },
                "message": {
                    "text": "Choisi une matière",
                    "quick_replies": elements
                }
            };
            callSendAPI(messageData).then(function () {
                fulfill();
            });
        })
    });
}

function sendButtonMessageWithGrade(recipientId, message) {
    models.grades.findAll({
        attributes: ['id', 'name', 'slug', 'order'],
        order: [
            ['order', 'ASC']
        ]

    }).then(function (grades) {
        console.log(JSON.stringify(grades));
        var elements = [];
        for (var i = 0; i < grades.length; i++) {
            var arrayMatiere = [];
            var buttonMatiere = {
                "title": formatString(grades[i].name,17),
                "content_type": "text",
                payload: 'choes_grade' + delimiter + grades[i].id
            };
            elements.push(buttonMatiere);
        }
        var messageData = {
            recipient: {
                id: recipientId
            },
            "message": {
                "text": message,
                "quick_replies": elements
            }
        };
        callSendAPI(messageData);
    })
}

function sendButtonMessage(recipientId) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "button",
                    text: "This is test text",
                    buttons: [{
                        type: "web_url",
                        url: "https://www.oculus.com/en-us/rift/",
                        title: "Open Web URL"
                    }, {
                        type: "postback",
                        title: "Trigger Postback",
                        payload: "DEVELOPED_DEFINED_PAYLOAD"
                    }, {
                        type: "phone_number",
                        title: "Call Phone Number",
                        payload: "+16505551234"
                    }]
                }
            }
        }
    };

    callSendAPI(messageData);
}

function sendImageMessage(recipientId) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "image",
                payload: {
                    url: "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xla1/v/t1.0-1/p160x160/13912903_1762893993988699_8962618189532067052_n.jpg?oh=d7090546c6cd73205101574fab66d9b0&oe=5880413C&__gda__=1480601177_31a9b7085ef8020a2e707ec3bcef3187"
                }
            }
        }
    };

    callSendAPI(messageData);
}

function receivedPostback(event) {
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var timeOfPostback = event.timestamp;

    // The 'payload' param is a developer-defined field which is set in a postback
    // button for Structured Messages.
    var payload = event.postback.payload;

    console.log("Received postback for user %d and page %d with payload '%s' " +
        "at %d", senderID, recipientID, payload, timeOfPostback);

    /**
     * recuperation de l'etape du payload
     */
    const arrayPayload = payload.split(delimiter);
    if (arrayPayload[0]) {
        const stepPayload = arrayPayload[0];
        switch (stepPayload) {
            case 'choes_grade' :
            {
                const gradeId = arrayPayload[1];
                // recuperation du detail du grade
                models.grades.findOne({
                    attributes: ['id', 'name', 'slug', 'comment_bot', 'order'],
                    where: {
                        id: gradeId
                    }
                }).then(function (grade) {
                    const commentaireBotGrade = grade.comment_bot;
                    sendTypingOn(senderID).then(function () {
                        sendTextMessage(senderID, commentaireBotGrade).then(function () {
                            sendTypingOn(senderID).then(function () {
                                sendButtonMessageWithMatiere(senderID, gradeId)
                            });
                        });
                    });
                });

                break;
            }
            case 'choes_course' :
            {
                const courseId = arrayPayload[1];
                const gradeId = arrayPayload[2];
                let chapterId = arrayPayload[3] ? arrayPayload[3] : '';
                const commentaireBotCourse = "Choisi maintenant une thématique !";
                sendTypingOn(senderID).then(function () {
                    sendTextMessage(senderID, commentaireBotCourse).then(function () {
                        sendTypingOn(senderID).then(function () {
                            sendButtonMessageWithChapter(senderID, gradeId, courseId, chapterId)
                        });
                    });
                });


                break;
            }
            case 'choes_chapter' :
            {
                const chapterId = arrayPayload[1];
                const gradeId = arrayPayload[2];
                const courseId = arrayPayload[3];
                const offset = arrayPayload[4];


                const commentaireBotChpter = "Choisi maintenant la leçon à reviser !";
                sendTypingOn(senderID).then(function () {
                    sendTextMessage(senderID, commentaireBotChpter).then(function () {
                        sendTypingOn(senderID).then(function () {
                            sendButtonMessageWithLesson(senderID, gradeId, courseId, chapterId, offset)
                        });
                    });
                });
                break;
            }

            case 'choes_lesson_video' :
            {
                const lessonId = arrayPayload[1];
                const gradeId = arrayPayload[2];
                const courseId = arrayPayload[3];
                const chapterId = arrayPayload[4];

                sendTypingOn(senderID).then(function () {
                    //recuperation de l'url de la video
                    models.lessons.findOne({
                        attributes: ['id', 'video'],
                        where: {id: lessonId}
                    }).then(function (lesson) {
                        sendTypingOn(senderID).then(function () {
                            sendVideoMessage(senderID, lesson.video, lessonId, gradeId, courseId, chapterId);
                        });
                    });
                });
                break;
            }

            case 'choes_other_lessons' :
            {
                const lessonId = arrayPayload[1];
                const gradeId = arrayPayload[2];
                const courseId = arrayPayload[3];
                const chapterId = arrayPayload[4];
                break;
            }
            case 'choes_other_course' :
            {
                sendButtonMessageWithMatiere(senderID, "Fait le choix d'une autre matière de revision !");
                break;
            }

            case 'menu_cours':
            {
                saveUserDetail(senderID);
                const msg = messageBote.getRandomClass();
                console.log("message " + msg);

                sendTypingOn(senderID).then(function () {
                    sendButtonMessageWithGrade(senderID, msg);
                });

                break;
            }
            case 'end_revision' :
            {
                sendTextMessage(senderID, "Ravi d'avoir reviser avec toi ! n'hésite pas à m'envoyer <HELLO> pour reviser encore :-) ;-) ");
                break;
            }

            default:
            {
                sendButtonMessageWithMatiere(senderID, "Quelque chose n'a pas fonctionné comme prevu ! Veuillez choisir une autre matière ou reessayer plutard.");
            }
        }
    } else {
        sendTextMessage(senderID, "Quelque chose d'inattendu s'est passé! veuillez reessayer plutard !");
        throw new error("erreur payload");
    }

    // When a postback is called, we'll send a message back to the sender to
    // let them know it was successful

}

function sendTypingOn(recipientId) {
    return new Promise(function (fulfill, rejected) {
        var messageData = {
            recipient: {
                id: recipientId
            },
            sender_action: "typing_on"
        };

        callSendAPI(messageData).then(function () {
            fulfill();
        });
    })

}

function sendTypingOff(recipientId) {
    console.log("Turning typing indicator off");
    return new Promise(function (fulfill, rejected) {
        var messageData = {
            recipient: {
                id: recipientId
            },
            sender_action: "typing_off"
        };

        callSendAPI(messageData).then(function () {
            fulfill()
        });
    })

}

function sendVideoMessage(recipientId, videoUrl, lessonId, gradeId, courseId, chapterId) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "video",
                payload: {
                    url: videoUrl
                }
            }
        }
    };

    callSendAPI(messageData).then(function () {
        sendButtonAfterCourse(recipientId, lessonId, gradeId, courseId, chapterId);
    })
}

function sendButtonAfterCourse(recipientId, lessonId, gradeId, courseId, chapterId) {
    return new Promise(function (fulfill, rejected) {
        // recuperation des autres lesson de la thematique

        models.chapters.findAll({
            where: {
                course_id: courseId,
                id: {
                    $ne: chapterId
                }
            },
            attributes: ['id']
        }).then(function (chapter) {
            console.log("CallBack video");
            let buttonArray = [];
            if (chapter.length) {
                let btnOtherChapter = {
                    type: "postback",
                    title: "Autres thématiques",
                    payload: 'choes_course' + delimiter + courseId + delimiter + gradeId + delimiter + chapterId
                }
                buttonArray.push(btnOtherChapter);
            }

            models.sequelize.query('SELECT id,timer,lesson_id FROM quiz WHERE lesson_id = :lesson_id ', {
                replacements: {
                    lesson_id: lessonId,
                    type: models.sequelize.QueryTypes.SELECT
                }
            }).then(function (quiz) {

                if (quiz[0].length) {
                    let btnQuizLesson = {
                        type: "postback",
                        title: "Quiz",
                        payload: "choes_make_quiz" + delimiter + lessonId + delimiter + gradeId + delimiter + courseId + delimiter + chapterId
                    };
                    buttonArray.push(btnQuizLesson);
                }

                let btnEnd = {
                    type: "postback",
                    title: "Terminer",
                    payload: "end_revision" + delimiter

                };
                buttonArray.push(btnEnd);

                console.log('btnEnd' + JSON.stringify(buttonArray));
                let messageData = {
                    recipient: {
                        id: recipientId
                    },
                    message: {
                        attachment: {
                            type: "template",
                            payload: {
                                template_type: "button",
                                text: "Options",
                                buttons: buttonArray
                            }
                        }
                    }
                }

                callSendAPI(messageData).then(function () {
                       fulfill()
                });
            });

        });
    })



}

