const fetch = require('node-fetch');
const moment = require('moment');
const request = require('request');
const config = require(appRootDirectory + '/app/config.js');
const github = config.github;
let serviceIdentifier = '';

//Define Function Locations
const logger = require(appRootDirectory + '/app/functions/bunyan');
const formatCheckin = require(appRootDirectory + '/app/functions/format-swarm');
const formatInstagram = require(appRootDirectory + '/app/functions/format-instagram');
const formatNote = require(appRootDirectory + '/app/functions/format-note');

exports.micropubPost = function micropubPost(req, res) {
    let postFileName;
    let responseLocation;
    let payload;
    let messageContent;
    let payloadOptions;
    let publishedDate;
    let postDestination;
    const micropubContent = req.body;
    const token = req.headers.authorization;
    const indieauth = 'https://tokens.indieauth.com/token';
    const authHeaders = {
        'Accept' : 'application/json',
        'Authorization' : token
    };

    //Log packages sent, for debug
    logger.info('json body ' + JSON.stringify(req.body));

    try {
        publishedDate = req.body.properties.published[0];
    } catch (e) {
        publishedDate = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss+01:00');
    }

    //Format date time for naming file.
    const postFileNameDate = publishedDate.slice(0, 10);
    const postFileNameTime = publishedDate.replace(/:/g, '-').slice(11, -9);
    const responseDate = postFileNameDate.replace(/-/g, '/');
    const responseLocationTime = publishedDate.slice(11, -12) + '-' + publishedDate.slice(14, -9);

    logger.info('Token Received: ' + token);

    fetch(indieauth, {
        method : 'GET',
        headers : authHeaders
    })
        .then(function(response) {
            return response.json();
        })
        .then(function(json) {
            serviceIdentifier = json.client_id;
            logger.info('Service Is: ' + serviceIdentifier);

            // Format Note based on service sending. Or use standard Note format.
            switch (serviceIdentifier) {
            case 'https://ownyourswarm.p3k.io':
                logger.info('Creating Swarm checkin');
                payload = formatCheckin.checkIn(micropubContent);
                messageContent = ':robot: Checkin submitted by Mastrl Cntrl';
                postFileName = postFileNameDate + '-' + postFileNameTime + '.md';
                responseLocation = 'https://vincentp.me/checkins/' + responseDate + '/' + responseLocationTime + '/';
                logger.info('response location ' + responseLocation);
                break;
            case 'https://ownyourgram.com/':
                logger.info('Creating Instagram note');
                payload = formatInstagram.instagram(micropubContent);
                messageContent = ':robot: Instagram photo submitted by Mastrl Cntrl';
                postFileName = postFileNameDate + '-' + postFileNameTime + '.md';
                responseLocation = 'https://vincentp.me/notes/' + responseDate + '/' + responseLocationTime + '/';
                logger.info('response ' + responseLocation);
                break;
            default:
                logger.info('Creating Note');
                payload = formatNote.note(micropubContent);
                messageContent = ':robot: Note  submitted by Mastrl Cntrl';
                postFileName = postFileNameDate + '-' + postFileNameTime + '.md';
                responseLocation = 'https://vincentp.me/notes/' + responseDate + '/' + responseLocationTime + '/';
                logger.info('response location ' + responseLocation);
            }

            postDestination = github.postUrl + '/contents/_posts/' + postFileName;
            logger.info('Destination: ' + postDestination);

            payloadOptions = {
                method : 'PUT',
                url : postDestination,
                headers : {
                    Authorization : 'token ' + github.key,
                    'Content-Type' : 'application/vnd.github.v3+json; charset=UTF-8', //Request v3 API
                    'User-Agent' : github.name
                },
                body : {
                    path : postFileName,
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

            // The error checking here is poor. We are not handling if GIT throws an error.
            request(payloadOptions, function sendIt(error, response, body) {
                if (error) {
                    res.status(400);
                    res.send('Error Sending Payload');
                    logger.error('Git creation failed:' + error);
                    res.end('Error Sending Payload');
                    throw new Error('failed to send ' + error);
                } else {
                    logger.info('Git creation successful!  Server responded with:', body);
                    res.writeHead(201, {
                        'location' : responseLocation
                    });
                    res.end('Thanks');
                }
            });
        })
        .catch((err) => logger.error(err));
};
