
/**
 * Expose
 */

module.exports = {
  db: 'mongodb://localhost/your_project_development',
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
    pageAccessToken: "EAAXkZCNDkRCwBAPnRbrZBXyc1lwUX3zQZAxOhBGVW0fc6aUggmOuRVnJTWakLQc4QdZBMtL7c0SW1xrnlLM5WfTKAHjliXp03ycJ7cDpZAGQ3hQiZAYn9ZC2ZBQ0g5KuxIsgXNDeWjTYZCgWlhNGzy2qFhAQXuQoW5jIQnTYOiJfrPQZDZD",
    validationToken: "mon_token_de_verification",
    serverURL: ""
  }
};
