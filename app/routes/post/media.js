const fetch = require('node-fetch');
// const multer = require('multer');
const moment = require('moment');
const shortid = require('shortid');
// const storage = multer.memoryStorage();
// const upload = multer({storage : storage});
const config = require(appRootDirectory + '/app/config.js');
const indieauth = config.indieauth;
// const github = config.github;
const logger = require(appRootDirectory + '/app/logging/bunyan');
const githubApi = require(appRootDirectory + '/app/github/post-to-api');

exports.mediaPost = function mediaPost(req, res) {
    const publishedDate = moment(new Date()).tz('Pacific/Auckland').format('YYYY-MM-DD');
    const filenameID = shortid.generate();
    const fileName = `${filenameID}.jpg`; //Need to identify other mimetypes
    const payload = req.files[0].buffer;
    const responseLocation = `src/images/blog/${publishedDate}/${fileName}`;
    const fileLocation = `src/images/blog/${publishedDate}`;
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
        // const formattedToken = token.slice(7); //Remove Bearer
        logger.info('Token supplied');
        // logger.info(`Authorization Token: ${token}`);
        // logger.info(`Formatted Token: ${formattedToken}`);
        logger.info('json body ' + JSON.stringify(req.body));

        // Verify Token. If OK send syndication options or configuration
        fetch(indieauth.url, {method : 'GET', headers : authHeaders})
            .then(authResponse)
            .then(githubApi.publish(req, res, fileLocation, fileName, responseLocation, payload))
            .catch((err) => logger.error(err));
    } catch (e) {
        logger.info('No Token supplied');
        return res.status(403);
    }
};
