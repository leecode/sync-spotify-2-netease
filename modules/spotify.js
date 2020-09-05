const spotifyConfig = require('../config/spotify');

module.exports = {
    name: 'spotify',
    version: '0.0.1',
    register: async function (server, options) {
        const spotifyApi = options.spotifyApi;

        server.route({
            method: 'GET',
            path: '/spotify/artist/{artist}/albums',
            handler: async function (request, h) {
                const artist = request.params.artist;
                const resp = await new Promise((resolve, reject) => {
                    spotifyApi.getArtistAlbums(artist).then(
                        function (data) {
                            // console.log('Artist albums', data.body);
                            resolve(data);
                        },
                        function (err) {
                            console.log('error', err);
                            resolve(err);
                        }
                    )
                });

                if (resp.statusCode == 200) {
                    return resp.body;
                }

                if (resp.statusCode == 401) {
                    console.log('trying to grant token...');

                    const state = "fakeRand";
                    const redirectUrl = spotifyApi.createAuthorizeURL(spotifyConfig.scopes, state);
                    return h.redirect(redirectUrl);
                }
            }
        });
    }
};


