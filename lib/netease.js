const { login_cellphone, user_playlist, playlist_create, playlist_tracks, search } = require('NeteaseCloudMusicApi');

const NETEASE_COOKIE_NAME = 'netease.cookie';
const NETEASE_ACCOUNT_INFO = 'netease_acount';

class NetEaseMusic {
    constructor(nodeCache) {
        this.nodeCache = nodeCache;
    }

    async login(phone, password) {
        try {
            const result = await login_cellphone({
                phone,
                password
            });

            if (result.status != 200) {
                console.error('login failed', result);
                return false;
            }

            // for now, just one login user supported.
            this.nodeCache.set(NETEASE_COOKIE_NAME, result.body.cookie);
            this.nodeCache.set(NETEASE_ACCOUNT_INFO, result.body.account);

            return true;
        } catch (error) {
            console.log(error);
        }
    }

    me() {
        return this.nodeCache.get(NETEASE_ACCOUNT_INFO);
    }

    async getPlaylist(query) {
        const params = {
            limit: 30,
            offset: 0,
        };

        const fetchParams = Object.assign({
            cookie: this.nodeCache.get(NETEASE_COOKIE_NAME) || {}
        }, params, query || {});
    
        if (!fetchParams.uid) {
            const currUser = this.me();
            console.log('currUser', currUser);
            fetchParams.uid = currUser.id;
        }

        console.log('getting playlist', fetchParams);
        const result = await user_playlist(fetchParams);
        return result.body;
    }

    /**
     * create a playlist, params:
     * {
     *     name: 'playlistName'
     *     privacy: 0
     * }
     */
    async createPlaylist(playlistInfo) {
        const params = {
            privacy: 0
        };

        const playlist = Object.assign({
            cookie: this.nodeCache.get(NETEASE_COOKIE_NAME) || {}
        }, params, playlistInfo);

        const result = await playlist_create(playlist);
        return result.body;
    }

    async search(keywords) {
        const query = {
            keywords
        };
        const result = await search(query);
        return result.body;
    }

    async addTrackToPlaylist (tracks, pid) {
        const credentials = {
            cookie: this.nodeCache.get(NETEASE_COOKIE_NAME) || {}
        };

        const params = Object.assign(credentials, {
            op: 'add',
            tracks,
            pid
        });

        const result = await playlist_tracks(params);
        return result.body;
    }
};

module.exports = NetEaseMusic;
