const fetch = require('node-fetch');
const multer = require('multer');
// const request = require('request');
// const base64 = require('base64it');
const moment = require('moment');
const shortid = require('shortid');
const storage = multer.memoryStorage();
const upload = multer({storage : storage});
const config = require(appRootDirectory + '/app/config.js');
const github = config.github;
const logger = require(appRootDirectory + '/app/functions/bunyan');
const githubApi = require(appRootDirectory + '/app/functions/githubApi');

exports.mediaPost = function mediaPost(req, res) {
    const publishedDate = moment(new Date()).format('YYYY-MM-DD');
    const filenameID = shortid.generate();
    const fileName = `${filenameID}.jpg`; //Need to identify other mimetypes
    const payload = req.files[0].buffer;
    // const messageContent = ':robot: Media submitted by Mastrl Cntrl';
    const responseLocation = `https://vincentp.me/images/blog/${publishedDate}/${fileName}`;
    const fileLocation = `images/blog/${publishedDate}`;
    const postDestination = `${github.postUrl}/contents/images/blog/${publishedDate}/${fileName}`;
    let token;
    let formattedToken;
    const indieauth = 'https://tokens.indieauth.com/token';
    const authHeaders = {
        'Accept' : 'application/json',
        'Authorization' : token
    };
    // const payloadOptions = {
    //     method : 'PUT',
    //     url : postDestination,
    //     headers : {
    //         Authorization : `token ${github.key}`,
    //         'Content-Type' : 'application/vnd.github.v3+json; charset=UTF-8',
    //         'User-Agent' : github.name
    //     },
    //     body : {
    //         path : fileName,
    //         branch : github.branch,
    //         message : messageContent,
    //         committer : {
    //             'name' : github.user,
    //             'email' : github.email
    //         },
    //         content : payload
    //     },
    //     json : true
    // };

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

    // function sendtoGithub(error, response, body) {
    //     if (error) {
    //         res.status(400);
    //         res.send('Error Sending Image');
    //         logger.error(`Git creation failed: ${error}`);
    //         res.end('Error Sending Image');
    //         throw new Error(`Failed to send: ${error}`);
    //     } else {
    //         res.writeHead(201, {
    //             'location' : responseLocation
    //         });
    //         logger.info('Git creation successful!  Server responded with:', body);
    //         res.end('Thanks');
    //     }
    // }

    // logger.info(`response location: ${responseLocation}`);
    // logger.info(`postDestination destination: ${postDestination}`);

    // Verify Token. If OK proceed.
    fetch(indieauth, {
        method : 'GET',
        headers : authHeaders
    })
        .then(authResponse)
        // .then(request(payloadOptions, sendtoGithub))
        .then(githubApi.publish(req, res, fileLocation, fileName, responseLocation, payload))
        .catch((err) => logger.error(err));
};
