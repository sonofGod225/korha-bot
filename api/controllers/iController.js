const axios = require('axios');
// controller de communication bot

exports.place = function (req, res) {
    const googleUrlTest = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670,151.1957&radius=500&types=food&name=cruise&key=AIzaSyAotnduQpmwHHODtiq2fWk8esPMZOI0pQk"
    axios.get(googleUrlTest).then(function(response){
        console.log(JSON.stringify(response.data))
    })
    //const typePlace = req.params.typePlace;

    res.render('home/index', {
        title: 'Node Express Mongoose Boilerplate'
    });
};