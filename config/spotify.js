const credentials = {
    clientId: 'e5f8f42849ca4682a840ae46f78358f3',
    clientSecret: 'db4933de51974e928f7922e17018d2ab',
};

const redirectUri = 'http://api.leecode.info:9980/oauth/spotify/callback';

module.exports = {
    credentials,
    redirectUri,
    scopes: ['user-read-private', 'user-read-email']
};
