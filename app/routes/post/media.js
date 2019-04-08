const fetch = require('node-fetch');
const multer = require('multer');
const moment = require('moment');
const tz = require('moment-timezone');
const shortid = require('shortid');
const storage = multer.memoryStorage();
const upload = multer({storage : storage});
const config = require(appRootDirectory + '/app/config.js');
const github = config.github;
const logger = require(appRootDirectory + '/app/functions/bunyan');
const githubApi = require(appRootDirectory + '/app/functions/githubApi');

exports.mediaPost = function mediaPost(req, res) {
    const publishedDate = moment(new Date()).tz('Pacific/Auckland').format('YYYY-MM-DD');
    const filenameID = shortid.generate();
    const fileName = `${filenameID}.jpg`;  //Need to identify other mimetypes
    const payload = req.files[0].buffer;
    const responseLocation = `images/blog/${publishedDate}/${fileName}`;
    const fileLocation = `images/blog/${publishedDate}`;
    const postDestination = `${github.postUrl}/contents/images/blog/${publishedDate}/${fileName}`;
    let token;
    let formattedToken;
    const indieauth = 'https://tokens.indieauth.com/token';
    const authHeaders = {
        'Accept' : 'application/json',
        'Authorization' : token
    };

    try {
        token = req.headers.authorization;
        let formattedToken = token.slice(7); //Remove Bearer
        logger.info('Token supplied');
        logger.info(`Authorization Token: ${token}`);
        logger.info(`Formatted Token: ${formattedToken}`);
    } catch (e) {
        logger.info('No Token supplied');
        token = '';
        return res.status(403);
    }

    logger.info('json body ' + JSON.stringify(req.body));

    function authResponse(response) {
            return responseLocation;
    }

    // Verify Token. If OK proceed.
    fetch(indieauth, {
        method : 'GET',
        headers : authHeaders
    })
        .then(authResponse)
        .then(githubApi.publish(req, res, fileLocation, fileName, responseLocation, payload))
        .catch((err) => logger.error(err));
};
