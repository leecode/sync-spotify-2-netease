// TODO: tidy & extract this mess...
const neteaseMusicApiRequest = require('NeteaseCloudMusicApi/util/request');
const loginCellPhone = require('NeteaseCloudMusicApi/module/login_cellphone');
const userPlayList = require('NeteaseCloudMusicApi/module/user_playlist');
const createPlaylist = require('NeteaseCloudMusicApi/module/playlist_create');
const playlistTracks = require('NeteaseCloudMusicApi/module/playlist_tracks');
const search = require('NeteaseCloudMusicApi/module/search');
const tools = require('NeteaseCloudMusicApi/util/index');

const netease = require('../lib/netease');

const NETEASE_COOKIE_NAME = 'netease.cookie';

module.exports = {
    name: 'netease',
    version: '0.0.1',
    register: async function (server, options) {
        const nodeCache = options.nodeCache;
        server.route({
            method: 'GET',
            path: '/netease/login',
            handler: async (r, h) => {
                const phone = r.query.phone;
                const password = r.query.password;

                const query = {
                    phone, password: encodeURIComponent(password),
                    cookie: {},
                };

                const resp = await new Promise((resolve) => {
                    loginCellPhone(query, neteaseMusicApiRequest).then(resp => {
                        resolve(resp);
                    });
                });

                if (resp.status == 200) {
                    nodeCache.set(NETEASE_COOKIE_NAME, tools.cookieToJson(resp.cookie.join(';')));
                }

                return resp.body;
            }
        });

        server.route({
            method: 'GET',
            path: '/netease/user/playlist',
            handler: async (request, h) => {
                const query = {
                    uid: request.query.uid,
                    limit: request.query.limit,
                    offset: request.query.offset,
                    cookie: nodeCache.get(NETEASE_COOKIE_NAME) || {}
                };

                const result = await new Promise((resolve) => {
                    userPlayList(query, neteaseMusicApiRequest).then(resp => {
                        resolve(resp);
                    });
                });

                return result.body;
            }
        });
        

        
        server.route({
            method: 'GET',
            path: '/netease/playlist/create',
            handler: async (request, h) => {
                const query = {
                    name: request.query.name,
                    privacy: request.query.privacy || 0,
                    cookie: nodeCache.get(NETEASE_COOKIE_NAME) || {}
                };

                const reuslt = await new Promise((resolve) => {
                    createPlaylist(query, neteaseMusicApiRequest).then(resp => {
                        resolve(resp);
                    }).catch(err => {
                        console.error(err);
                    });
                });

                return reuslt.body;
            }
        });

        // test playlist id 5221994866, trackId: 347231
        server.route({
            method: 'GET',
            path: '/netease/playlist/tracks',
            handler: async (request, h) => {
                const query = {
                    op: 'add',
                    pid: request.query.pid,
                    tracks: request.query.tracks,
                    cookie: nodeCache.get(NETEASE_COOKIE_NAME) || {}
                };

                const result = await new Promise((resolve) => {
                    playlistTracks(query, neteaseMusicApiRequest).then(resp => {
                        resolve(resp);
                    }).catch(err => {
                        console.error(err);
                    });
                });

                return result.body;
            }
        });

        server.route({
            method: 'GET',
            path: '/netease/tracks/search',
            handler: async (request, h) => {
                const query = {
                    keywords: request.query.keywords
                };

                const result = await new Promise((resolve) => {
                    search(query, neteaseMusicApiRequest).then(resp => {
                        resolve(resp);
                    }).catch(err => {
                        console.error(err);
                    });
                });

                return result.body
            }
        });

        server.route({
            method: 'GET',
            path: '/netease/playground',
            handler: async (request, h) => {
                netease.init(nodeCache);
                
                const loginResult = netease.login(request.query.phone, request.query.password);
                return loginResult;
            }
        });
    }
};
