'use strict';

const Hapi = require('@hapi/hapi');
const SpotifyWebApi = require('spotify-web-api-node');

const spotifyConfig = require('./config/spotify');

const spotifyApi = new SpotifyWebApi({
    clientId: spotifyConfig.credentials.clientId,
    clientSecret: spotifyConfig.credentials.clientSecret,
    redirectUri: spotifyConfig.redirectUri
});

const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    await server.register([
        {
            plugin: require('./modules/spotify'),
            options: {
                spotifyApi
            }
        },
        {
            plugin: require('./modules/spotify-oauth'),
            options: {
                spotifyApi
            }
        }
    ]);

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return "Hello Wolrd!";
        }
    });


    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();
