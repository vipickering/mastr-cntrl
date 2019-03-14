const rp = require('request-promise');
const base64 = require('base64it');
const logger = require(appRootDirectory + '/app/functions/bunyan');
const config = require(appRootDirectory + '/app/config.js');
const moment = require('moment');
const github = config.github;
const website = config.website;
const webmention = config.webmention;
const stringEncode = require(appRootDirectory + '/app/functions/stringEncode');

exports.sendScrobbles = function sendScrobbles(req, res) {
    const url = 'http://ws.audioscrobbler.com/2.0/?method=user.getweeklyalbumchart&user=monkeymajiks&api_key=' + LASTFM_TOKEN;


// When the endpoint is triggered, go fetch the weekly scrobble list and chuck it in to a LastFM formatter, then pass to Github API function to post

};



