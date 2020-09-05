// TODO: tidy & extract this mess...
const neteaseMusicApiRequest = require('NeteaseCloudMusicApi/util/request');
const loginCellPhone = require('NeteaseCloudMusicApi/module/login_cellphone');
const userPlayList = require('NeteaseCloudMusicApi/module/user_playlist');

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
                    nodeCache.set(NETEASE_COOKIE_NAME, resp.cookie);
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
    }
};
