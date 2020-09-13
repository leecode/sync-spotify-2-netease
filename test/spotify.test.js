const assert = require('assert');

const SpotifyWebApi = require('spotify-web-api-node');

const Spotify = require('../lib/spotify');
const spotifyConfig = require('../config/spotify');

const spotifyApi = new SpotifyWebApi({
    clientId: spotifyConfig.credentials.clientId,
    clientSecret: spotifyConfig.credentials.clientSecret,
    redirectUri: spotifyConfig.redirectUri
});

// for test only, you should replace it with your own when running test cases.
spotifyApi.setAccessToken('BQAT8VzKcNlZvqgIlROPANw3Yjrf-ix7p0aaFfiaCcnp66bZYBaH95KM6myN3-BHK9mfL_A3U7NiY1If1zTP1qlujheXTPOhB-Sow-u0rV0QxVvwh1QbSs3W3oMrNDcMBEIKlPytVrkF9EmQEKQppZ9yb0TE7DWHzZ6xBdIaqKaAlg0OPEbEeA');

const spotify = new Spotify(spotifyApi);
describe('spotify api wrapper', () => {

    it('spotify should return tracks of playlist', async () => {
        const tracksInfo = await spotify.getTracks('4XBjuSap8rEb1g45CqqgLt');

        assert.equal(tracksInfo.total > 0, true);       
        assert.equal(tracksInfo.items.length > 0, true);
    });

});


