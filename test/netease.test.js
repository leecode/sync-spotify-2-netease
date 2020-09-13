const NodeCache = require('node-cache');
const assert = require('assert');

const NetEaseMusic = require('../lib/netease');

const nodeCache = new NodeCache();
const netease = new NetEaseMusic(nodeCache);

describe('netease', () => {

    it('should login successfully and get playlist', async () => {
        const cellphone = '<insert your cellphone>';
        const password = '<insert your password>';
        const result = await netease.login(cellphone, password);

        assert.equal(result, true);

        const userPlaylist = await netease.getPlaylist();
        console.log(userPlaylist);

    });

    it('should get a list of songs related to keywords', async () => {
        const result = await netease.search('Luck You');
        console.log(result);
    });

    it('should create a playlist and added a song', async () => {
        let result = await netease.createPlaylist({
            name: 'from nodejs test case',
        });

        result = await netease.addTrackToPlaylist('347239,347231', result.id);
    });

});