
module.exports = {
    name: 'sync',
    version: '0.0.1',
    register: async function (server, options) {
        const spotify = options.spotify;
        const netease = options.netease;
        
        server.route({
            method: 'GET',
            path: '/sync/playlists',
            handler: async function (request, h) {
                
                const spotifyPlaylists = await spotify.getMyPlayLists();
                const neteasePlaylists = await netease.getPlaylist();

                return {
                    spotifyPlaylists,
                    neteasePlaylists
                }
            }
        });

        server.route({
            method: 'GET',
            path: '/sync/byPlaylist',
            handler: async (request, h) => {
                const spotifyPlaylistId = request.query.spotifyPid;
                const neteasePid = request.query.neteasePid || 5234259746; // default is my test playlist

                const tracks = await spotify.getTracks(spotifyPlaylistId);

                const neteaseSearchs = tracks.items.map(trackInfo => {
                    return netease.search(`${trackInfo.track.name} ${trackInfo.track.artists[0].name}`);
                });

                const searchResults = await Promise.all(neteaseSearchs);

                const trackIds = searchResults.filter(searchResult => {
                    return searchResult.code === 200 && searchResult.result.songs.length > 0;
                }).map(searchResult => {
                    return searchResult.result.songs[0].id;
                });

                let syncResult = {};
                if (trackIds.length > 0) {
                    syncResult = netease.addTrackToPlaylist(trackIds.join(','), neteasePid);
                }
                return syncResult;
            }
        });
    }
};
