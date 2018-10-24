const fetch = require('node-fetch');
const rp = require('request-promise');
const base64 = require('base64it');
const moment = require('moment');
const logger = require(appRootDirectory + '/app/functions/bunyan');
const config = require(appRootDirectory + '/app/config.js');
const github = config.github;

exports.webmentionSend = function webmentionSend(req, res) {
    const messageContent = ':robot: Webmentions sent by Mastrl Cntrl';
    const postFileName = 'webmentions.json';
    const postDestination = github.postUrl + '/feeds/indieweb/' + postFileName;
    const apiOptions = {
        uri : postDestination,
        headers : {
            Authorization : 'token ' + github.key,
            'Content-Type' : 'application/vnd.github.v3+json; charset=UTF-8',
            'User-Agent' : github.name
        },
        json : true
    };
    let payload;
    let options;
    // let currentWebmentions;
    let encodedContent;

      function handleGithubApiGet(err) {
        logger.info('Github API Get File Failed');
        logger.error(err);
        res.status(400);
        res.send('Internal Error Please Contact Author');
    }

    function handlePatchError(err) {
        logger.info('Webmention update to Github API Failed');
        res.status(400);
        res.send('Update failed');
    }

    function functionFinish() {
        res.status(202);
        res.send('Accepted');
    }

    logger.info('Getting pending webmention feed ');

// When pinged
//  GET JSON file
// Check if array is 0 and only proceed if it is not.
// Loop through Webmentions and send each one sequentially. (URL encoded form)
// Update published date to  current date/time
// Push file in to Github API.


logger.info('success!');
res.status(200);
res.send('Done');
};
