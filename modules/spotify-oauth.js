const spotifyOauth = {
    name: 'spotifyOauth',
    version: '0.0.1',
    register: async function (server, options) {
        const spotifyApi = options.spotifyApi;

        server.route({
            method: 'GET',
            path: '/oauth/spotify/callback',
            handler: async function (request, h) {
                const query = request.query;

                if (query.error) {
                    console.warn(`oauth failed: error : ${query.error}`);
                }

                const code = request.query.code;
                spotifyApi.authorizationCodeGrant(code).then(
                    function (data) {
                        console.log('The token expires in ' + data.body['expires_in']);
                        console.log('The access token is ' + data.body['access_token']);
                        console.log('The refresh token is ' + data.body['refresh_token']);

                        // Set the access token on the API object to use it in later calls
                        spotifyApi.setAccessToken(data.body['access_token']);
                        spotifyApi.setRefreshToken(data.body['refresh_token']);
                    },
                    function (err) {
                        console.log('Something went wrong!', err);
                    }
                );

                return 'access expired, retry';
            }
        });
    }
};



module.exports = spotifyOauth;
