/**
 * Expose
 */

module.exports = {
    db: process.env.MONGODB_URI,
    squelize: {
        "username": "saroute",
        "password": 'sXpe88&9',
        "database": "sa",
        "host": "de2869.ispfr.net",
        "dialect": "mysql"
    },
    facebook: {
        clientID: 'APP_ID',
        clientSecret: 'SECRET',
        callbackURL: 'http://localhost:3000/auth/facebook/callback',
        webview:'',
        scope: [
            'email',
            'user_about_me',
            'user_friends'
        ]
    },
    google: {
        clientID: 'APP_ID',
        clientSecret: 'SECRET',
        callbackURL: 'http://localhost:3000/auth/google/callback',
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.google.com/m8/feeds',
        ]
    },
    facebookmessenger: {
        appSecret:"6d741afeda0b64e47c43480b4b3d9073",
        pageAccessToken: "EAAXkZCNDkRCwBAFV22QV6hBtFeyRmvDar3ZBZADdlrPfHkWnTvcVYK4lVkDFFE0UNL1bhv5tLjjDP3H0QIVTAZB5gm7KmLAuVoWKJ2xoYzXhLLhGmzZALXd3zjlZAvI6l7FDpBd5xZArl36tvbzrJEefHjZBtN9uG4vOyZB5eZCcYkPwZDZD",
        validationToken: "mon_token_de_verification",
        serverURL: "/",
        webViewURL: "https://coach-success-assure.herokuapp.com/"
    }
};
