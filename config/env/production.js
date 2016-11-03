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
        pageAccessToken: "EAAXkZCNDkRCwBAE5XKeOEruyBwLNUwi7juHO4lYCXd3ClhDZC0tZBlF5GwhxKUQ4imhJaiVLdWwW6JZAjX8i9xzD2Qs5DK18MZBMFzbwN7vDD7sabFNVVg9iEl8QhCJne4ZCvJVqn5CLaKPbTc655FFG1vKcrsC7YidyJmZBHa3ggZDZD",
        validationToken: "mon_token_de_verification",
        serverURL: "/",
        webViewURL: "https://coach-success-assure.herokuapp.com/"
    }
};
