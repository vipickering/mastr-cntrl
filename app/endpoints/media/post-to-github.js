const fetch = require('node-fetch');
const shortid = require('shortid');
const config = require(appRootDirectory + '/app/config.js');
const indieauth = config.indieauth;
const logger = require(appRootDirectory + '/app/logging/bunyan');
const githubApi = require(appRootDirectory + '/app/github/post-to-api');
const handleDateTime = require(appRootDirectory + '/app/endpoints/micropub/process-data/datetime');

exports.mediaPost = function mediaPost(req, res) {
    const publishedDate = handleDateTime.formatMediaDateTime();
    const filenameID = shortid.generate();
    const fileName = `${filenameID}.jpg`; //Need to identify other mimetypes
    const payload = req.files[0].buffer;
    const responseLocation = `src/images/blog/${publishedDate}/${fileName}`;
    const fileLocation = `src/images/blog/${publishedDate}`;
    const commitMessage = 'Media created for blog post';
    const slack = require(appRootDirectory + '/app/slack/post-message-slack');
    let token;
    const authHeaders = {
        'Accept' : 'application/json',
        'Authorization' : token
    };

    function authResponse() {
        logger.info('Returning location: ' + responseLocation);
        return responseLocation;
    }

    try {
        token = req.headers.authorization;
        logger.info(req);
        logger.info('Token supplied');
        logger.info('json body ' + JSON.stringify(req.body));

        // Verify Token. If OK send syndication options or configuration
        fetch(indieauth.url, {method : 'GET', headers : authHeaders})
            .then(authResponse)
            .then(githubApi.publish(req, res, fileLocation, fileName, responseLocation, payload, commitMessage))
            .catch((err) => logger.error(err));
        logger.info('Image Posted to Github');
        slack.sendMessage('Image Posted to Github');
        return res.status(200);
    } catch (e) {
        logger.info('No Token supplied');
        return res.status(403);
    }
};
