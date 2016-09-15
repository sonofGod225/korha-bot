var User = require('../../app/models/user');
const request = require('request');
const config = require('../../config');
const VALIDATION_TOKEN = config.facebookmessenger.validationToken;
const PAGE_ACCESS_TOKEN = config.facebookmessenger.pageAccessToken;
const axios = require('axios');

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


    function receivedMessage(event) {
        var senderID = event.sender.id;
        var recipientID = event.recipient.id;
        var timeOfMessage = event.timestamp;
        var message = event.message;
        console.log("Received message for user %d and page %d at %d with message:",
            senderID, recipientID, timeOfMessage);
        console.log(JSON.stringify(message));

        var messageId = message.mid;

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
                    sendTextMessage(senderID, messageText);
            }
        } else if (messageAttachments) {
            sendTextMessage(senderID, "Message with attachment received");
        }
    }

    function sendTextMessage(recipientId, messageText) {
        var messageData = {
            recipient: {
                id: recipientId
            },
            message: {
                text: messageText
            }
        };

        callSendAPI(messageData);
    }

    function callSendAPI(messageData) {
        request({
            uri: 'https://graph.facebook.com/v2.6/me/messages',
            qs: {access_token: PAGE_ACCESS_TOKEN},
            method: 'POST',
            json: messageData

        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var recipientId = body.recipient_id;
                var messageId = body.message_id;

                console.log("Successfully sent generic message with id %s to recipient %s",
                    messageId, recipientId);
            } else {
                console.error("Unable to send message.");
                console.error(response);
                console.error(error);
            }
        });
    }

    function saveUserDetail(user_id) {
        request({
            uri: 'https://graph.facebook.com/v2.6/' + user_id,
            qs: {access_token: PAGE_ACCESS_TOKEN, fields:'first_name,last_name,profile_pic,locale,timezone,gender'},
            method: 'GET'
        }, (error, response, body)=> {
            if (!error && response.statusCode == 200) {
                const user = new User({
                    user_id: user_id,
                    first_name: body.first_name,
                    last_name: body.last_name,
                    profile_pic: body.profile_pic,
                    gender: body.gender
                });
                User.findOne({user_id: user_id}, (findErr, existingUser)=> {
                    if (existingUser) {
                        console.error('Account with this user_id already exists!');
                    }

                    user.save((saveErr) => {
                        if (saveErr) {
                            console.error('une erreur est surveur pendant l\'enregistre de l\'utilisateur');
                        }
                        console.log("utilisateur enregistré avec succes !");

                    });
                })
            }
        });
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
        const urlUserProfil = "https://graph.facebook.com/v2.6/"+senderID+"?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token="+PAGE_ACCESS_TOKEN;
        axios.get(urlUserProfil).then(function(response){
            console.log(JSON.stringify(response.data))
            const body = response.data;
            const user = new User({
                user_id: senderID,
                first_name: body.first_name,
                last_name: body.last_name,
                profile_pic: body.profile_pic,
                gender: body.gender
            });

            User.findOne({user_id: senderID}, function(findErr, existingUser) {
                if (existingUser) {
                    console.error('Account with this user_id already exists!');
                }

                user.save(function(saveErr) {
                    if (saveErr) {
                        console.error('une erreur est surveur pendant l\'enregistre de l\'utilisateur');
                    }
                    console.log("utilisateur enregistré avec succes !");

                    //sendTextMessage(senderID, "Bienvenue "+body.first_name+" "+body.last_name+" je suis le coach scolaire ! que veux tu apprendre aujourd'hui ? ");

                });
            })
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
}