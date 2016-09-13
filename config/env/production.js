/**
 * Expose
 */

module.exports = {
    db: process.env.MONGODB_URI,
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
        pageAccessToken: "EAAXkZCNDkRCwBAEoZCJOVYdVo23q8rsvYYLG6rV74ZA0ZA5RymIDIreAPT86JctTPAR1kHU5zjj1FVbYOn3MVnJzi601Gzq7WlMjitBrWpfS3FGtZCMHyT9uDtDKpoFzPU6JoHbGKw39GUEQMyqkBe57G86mheRdo5voRuxCMQwZDZD",
        validationToken: "mon_token_de_verification",
        serverURL: ""
    }
};
