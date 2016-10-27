
/**
 * Expose
 */

module.exports = {
  db: 'mongodb://localhost/your_project_development',
  squelize: {
    "username": "root",
    "password": null,
    "database": "sa",
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
    pageAccessToken: "EAAXkZCNDkRCwBAApJXSV0gBvVGZBA2XgiNnUGb0JLqFxYZC6olSe1Dd4DjEIWPatLNxhX0b9ZAcmJGKy7QAdZAVdxfqLSH7y1QOTlnQtheJl5jS77BoVe2ks2wIGdD1frugWuksqlXEUQrAUThXNg5WG0cOR3h3m7cZAGcLF8kygZDZD",
    validationToken: "mon_token_de_verification",
    serverURL: ""
  }
};
