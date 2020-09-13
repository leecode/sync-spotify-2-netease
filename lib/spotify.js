
class Spotify {
    constructor(spotifyApi) {
        this.spotifyApi = spotifyApi;
    }

    async getMyPlayLists(options) {
        const query = {
            limit: 20,
            offset: 0
        };

        Object.assign(query, options);

        const resp = await new Promise(resolve => {
            this.spotifyApi.getUserPlaylists(query).then(result => {
                resolve(result);
            });
        });

        return resp.body;
    }

    async getTracks(playlistId, options) {
        const query = {
            limit: 100,
            offset: 0,
            fields: 'total,limit,items(track(name,artists(name)),added_at)',
        };

        Object.assign(query, options);
        const resp = await new Promise(resolve => { 
            this.spotifyApi.getPlaylistTracks(playlistId, options).then(result => {
                resolve(result);
            });
        });

        return resp.body;

        // example result:
        /**
        {
            "items": [
                {
                "added_at": "2020-08-10T13:45:05Z",
                "track": {
                    "artists": [
                    {
                        "name": "Joyner Lucas"
                    }
                    ],
                    "name": "Keep It 100"
                }
                }
            ],
            "limit": 30,
            "total": 5
        }
         */
    }
}

module.exports = Spotify;
