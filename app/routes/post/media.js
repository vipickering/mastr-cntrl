const fetch = require('node-fetch');
const multer = require('multer');
const request = require('request');
const base64 = require('base64it');
const moment = require('moment');
const shortid = require('shortid');
const storage = multer.memoryStorage();
const upload = multer({storage : storage});
const config = require(appRootDirectory + '/app/config.js');
const github = config.github;
const logger = require(appRootDirectory + '/app/functions/bunyan');

exports.mediaPost = function mediaPost(req, res) {
    const publishedDate = moment(new Date()).format('YYYY-MM-DDT');
    const filename = shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_');
    const photoName = `${filename}.jpg`; //Need to identify other mimetypes
    const payload = base64.encode(req.files[0].buffer);
    const messageContent = ':robot: Media  submitted by Mastrl Cntrl';
    const responseLocation = `https://vincentp.me/images/blog/${publishedDate}/${photoName}`;
    const postDestination = `${github.postUrl}/contents/images/blog/${publishedDate}/${photoName}`;
    const token = req.headers.authorization;
    const indieauth = 'https://tokens.indieauth.com/token';
    const authHeaders = {
        'Accept' : 'application/json',
        'Authorization' : token
    };
    const payloadOptions = {
        method : 'PUT',
        url : postDestination,
        headers : {
            Authorization : `token ${github.key}`,
            'Content-Type' : 'application/vnd.github.v3+json; charset=UTF-8',
            'User-Agent' : github.name
        },
        body : {
            path : photoName,
            branch : github.branch,
            message : messageContent,
            committer : {
                'name' : github.user,
                'email' : github.email
            },
            content : payload
        },
        json : true
    };

    function authResponse(response) {
        //Return the location and filename here.
        return responseLocation;
    }


    function sendtoGithub(error, response, body) {
        if (error) {
            res.status(400);
            res.send('Error Sending Image');
            logger.error(`Git creation failed: ${error}`);
            res.end('Error Sending Image');
            throw new Error(`Failed to send: ${error}`);
        } else {
            res.writeHead(201, {
                'location' : responseLocation
            });
            logger.info('Git creation successful!  Server responded with:', body);
            res.end('Thanks');
        }
    }

    function failure(err){
        logger.info('something went wrong');
        logger.info(err);
    }

    logger.info(`response location: ${responseLocation}`);
    logger.info(`postDestination destination: ${postDestination}`);

    // 1 or more photos? need both use cases
    // Multiple photos needed? (photo1 photo2 etc).

     fetch(indieauth, {
            method : 'GET',
            headers : authHeaders
        })
            .then(authResponse)
            .then(request(payloadOptions, sendtoGithub))
            .catch(failure(err));
};
