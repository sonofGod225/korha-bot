var Promise = require('promise');
var User = require('../app/models/user');
const models = require('../app/models-sqelize');
const config = require('../config');
const VALIDATION_TOKEN = config.facebookmessenger.validationToken;
const PAGE_ACCESS_TOKEN = config.facebookmessenger.pageAccessToken;
const messageBote = require('../data/message');
const request = require('request');
const _ = require('lodash');
const delimiter = "_@@_";

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


// recuperation de tous les utilisateurs
models.bot_users.findAll({
    attributes: ['id', 'facebook_id', 'first_name', 'last_name']
}).then(function (users) {
    _.each(users, function (user) {
        let elements = [];
        let buttonYes = {
            "title": "oui",
            "content_type": "text",
            payload: 'response_invitation' + delimiter + "yes"
        };
        elements.push(buttonYes);
        let buttonNo = {
            "title": "Non",
            "content_type": "text",
            payload: 'response_invitation' + delimiter + "no"
        };
        elements.push(buttonNo);
        let messageInvite = messageBote.getRandomInvite();
        messageInvite = _.replace(messageInvite,"@name",user.first_name)
        let messageData = {
            recipient: {
                id: user.facebook_id
            },
            "message": {
                "text": messageInvite,
                "quick_replies": elements
            }
        };
        callSendAPI(messageData);
    })
});
