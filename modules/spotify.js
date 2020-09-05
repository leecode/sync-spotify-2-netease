const spotifyConfig = require('../config/spotify');
const SpotifyWebApi = require('spotify-web-api-node');

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

        server.route({
            method: 'GET',
            path: '/spotify/me/playlists',
            handler: async (request, h) => {
                const limit = request.query.limit || 20;
                const offset = request.query.offset || 0;

                if (limit > 50) {
                    return h.response({
                        message: 'limit不能大于50'
                    }).code(400);
                }

                if (offset > 100) {
                    return h.response({
                        message: 'offset不能大于100'
                    }).code(400);
                }

                const resp = await new Promise((resolve, reject) => {
                    spotifyApi.getUserPlaylists({
                        limit,
                        offset
                    }).then(data => {
                        resolve(data);
                    }, err => {
                        reject(err);
                    });
                });

                return resp.body;
            }
        });

        server.route({
            method: 'GET',
            path: '/spotify/playlist/{playlistId}/tracks',
            handler: async (request, h) => {
                const playlistId = request.params.playlistId;

                const fields = request.query.fields || 'items';
                const limit = request.query.limit || 20;
                const offset = request.query.offset;

                const resp = await new Promise((resolve, reject) => {
                    spotifyApi.getPlaylistTracks(playlistId, {
                        offset,
                        limit,
                        fields
                    }).then(data => {
                        resolve(data);
                    }, err => {
                        reject(err);
                    });
                });

                return resp.body;
            }
        });
    }
};


