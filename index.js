'use strict';

const Hapi = require('@hapi/hapi');
const SpotifyWebApi = require('spotify-web-api-node');
const NodeCache = require('node-cache');

const spotifyConfig = require('./config/spotify');
const nodeCache = new NodeCache();

const NetEaseMusic = require('./lib/netease');
const Spotify = require('./lib/spotify');

const spotifyApi = new SpotifyWebApi({
    clientId: spotifyConfig.credentials.clientId,
    clientSecret: spotifyConfig.credentials.clientSecret,
    redirectUri: spotifyConfig.redirectUri
});

const netease = new NetEaseMusic(nodeCache);
const spotify = new Spotify(spotifyApi);

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
        },
        {
            plugin: require('./modules/neteasemusic'),
            options: {
                nodeCache
            }
        },
        {
            plugin: require('./modules/sync'),
            options: {
                netease,
                spotify
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

const initCredentials = async () => {
    const result = await netease.login('18732184764', 'LiXiaoLiang001');
    if (result) {
        console.log('netease music logged in');
    } else {
        console.error('netease music login failed');
    }
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init().then(() => {
    initCredentials();
});
