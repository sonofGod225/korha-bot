var Promise = require('promise');
var User = require('../app/models/user');
const VALIDATION_TOKEN = config.facebookmessenger.validationToken;
const PAGE_ACCESS_TOKEN = config.facebookmessenger.pageAccessToken;
const messageBote = require('../../data/message');
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