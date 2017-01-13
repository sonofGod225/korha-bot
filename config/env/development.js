
/**
 * Expose
 */

module.exports = {
  db: 'mongodb://localhost/your_project_development',
  squelize: {
    "username": "root",
    "password": "root",
    "database": "bot-korha",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  facebook: {
    clientID: 'APP_ID',
    clientSecret: 'SECRET',
    callbackURL: 'http://localhost:3000/auth/facebook/callback',
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
    pageAccessToken: "EAAXkZCNDkRCwBANZCgqIwfYmHQ3WpcoD7wz4RE9VjtkPnPtluQu2IunUKzOaH9R1gcbrWpP8z00PQ802MlILxLJOTeDJutZBuAvtyfc4cBVAEomBZBexjyzTpzIDJiQjLpMLfjvZCFXwlqB2SUIxMZCPXmGnyZBlJZCXM8ZCQDbfVWAZDZD",
    validationToken: "mon_token_de_verification",
    serverURL: "",
    webViewURL: "https://coach-success-assure.herokuapp.com/"
  }
};
