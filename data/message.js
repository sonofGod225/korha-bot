const fs = require('fs');
const contents = fs.readFileSync("./bot.json");
const jsonContentBot = JSON.parse(contents);


exports.getRandomWelcom = function(){
    const welcoms = jsonContentBot.welcome;
    const messageSelect = randomArray(welcoms);
    return messageSelect.message;
}
exports.getRandomClass = function(){
    const classe = jsonContentBot.classe;
    const messageSelect = randomArray(classe);
    return messageSelect.message;
}
exports.getRandomMatiere = function(){
    const matiere = jsonContentBot.matiere;
    const messageSelect = randomArray(matiere);
    return messageSelect.message;
}

exports.getRandomThematique = function(){
    const thematique = jsonContentBot.thematique;
    const messageSelect = randomArray(thematique);
    return messageSelect.message;
}




function randomArray(arr){
    var item = items[Math.floor(Math.random()*arr.length)];
    return item;
}

