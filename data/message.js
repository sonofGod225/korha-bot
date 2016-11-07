const jsonContentBot = require("./bot.js");

exports.getRandomInvite = function () {
    const invite = jsonContentBot.invite;
    const messageSelect = randomArray(invite);
    return messageSelect.message;
}

exports.getRandomInviteYes = function () {
    const responseInviteYes = jsonContentBot.responseInviteYes;
    const messageSelect = randomArray(responseInviteYes);
    return messageSelect.message;
}

exports.getRandomInviteNo = function () {
    const responseInviteNo = jsonContentBot.responseInviteNo;
    const messageSelect = randomArray(responseInviteNo);
    return messageSelect.message;
}

exports.getRandomWelcom = function () {
    const welcoms = jsonContentBot.welcome;
    const messageSelect = randomArray(welcoms);
    return messageSelect.message;
}
exports.getRandomClass = function () {
    const classe = jsonContentBot.classe;
    const messageSelect = randomArray(classe);
    return messageSelect.message;
}
exports.getRandomMatiere = function () {
    const matiere = jsonContentBot.matiere;
    const messageSelect = randomArray(matiere);
    return messageSelect.message;
}

exports.getRandomThematique = function () {
    const thematique = jsonContentBot.thematique;
    const messageSelect = randomArray(thematique);
    return messageSelect.message;
}


function randomArray(arr) {
    var item = arr[Math.floor(Math.random() * arr.length)];
    return item;
}

