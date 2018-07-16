const express = require('express');
const router = new express.Router();
const path = require('path');
const fetch = require('node-fetch');
const request = require('request');
const appDir = path.dirname(require.main.filename);
const config = require(appDir + '/config');
const functionPath = '/functions/';
const logger = require(appDir + functionPath + 'bunyan');
const formatCheckin = require(appDir + functionPath + 'format-swarm');
const formatInstagram = require(appDir + functionPath + 'format-instagram');
const formatNote = require(appDir + functionPath + 'format-note');
const github = config.github;
let serviceIdentifier = '';

router.get('/', (req, res) => {
    res.render('index');
});

// Publish Elsewhere, Syndicate (to your) Own Site Endpoint.
router.post('/pesos', function appPesosRouter(req, res) {
    let postFileName;
    let responseLocation;
    let payload;
    let messageContent;
    let payloadOptions;
    let publishedDate;
    let postFileNameDate;
    let postFileNameTime;
    let responseDate;
    let responseLocationTime;
    const micropubContent = req.body;
    const token = req.headers.authorization;
    const indieauth = 'https://tokens.indieauth.com/token';
    const authHeaders = {
       'Accept' : 'application/json',
       'Authorization': token
    };

    try {
        publishedDate = req.body.properties.published[0];
    } catch(e) {
        publishedDate = new Date().toISOString();
    }

    //Format date time for naming file.
    postFileNameDate = publishedDate.slice(0, 10);
    postFileNameTime = publishedDate.replace(/:/g, '-').slice(11, -9);
    responseDate = postFileNameDate.replace(/-/g, '/');
    responseLocationTime = publishedDate.slice(11, -12) + '-' + publishedDate.slice(14, -9);

    logger.info('Token Recieved: '+ token);

    /* example indie Auth response we want
        HTTP/1.1 200 OK
        Content-Type: application/json
        {
            "me": "https://aaronparecki.com/",
            "client_id": "https://ownyourgram.com",
            "scope": "post",
            "issued_at": 1399155608,
            "nonce": 501884823
        }
    */

    logger.info(req.headers);
    logger.info(req.body);

    fetch(indieauth, { method: 'GET', headers: authHeaders})
        .then(function(response){
             return response.json();
        })
        .then(function(json){
            serviceIdentifier = json.client_id;

            // Format Note based on service sending. Or use standard Note format.
            switch (serviceIdentifier) {
            case 'https://ownyourswarm.p3k.io':
                logger.info('Creating Swarm checkin');
                payload = formatCheckin.checkIn(micropubContent);
                messageContent = ':robot: Checkin submitted via micropub API';
                postFileName = postFileNameDate + '-' + postFileNameTime + '.md';
                responseLocation = 'https://vincentp.me/checkins/' + responseDate + '/' + responseLocationTime + '/';
                logger.info('response location ' + responseLocation);
                break;
            case 'https://ownyourgram.com':
                logger.info('Creating Instagram note');
                payload = formatInstagram.checkIn(micropubContent);
                messageContent = ':robot: Instagram photo submitted via micropub API  and ownyourgram';
                postFileName = postFileNameDate + '-' + postFileNameTime + '.md';
                responseLocation = 'https://vincentp.me/instagram/' + responseDate + '/' + responseLocationTime + '/';
                logger.info('response ' + responseLocation);
                break;
            default:
                logger.info('Creating Note');
                payload = formatNote.note(micropubContent);
                postFileName = postFileNameDate + '-' + postFileNameTime + '.md';
                responseLocation = 'https://vincentp.me/notes/' + responseDate + '/' + responseLocationTime + '/';
                logger.info('response location ' + responseLocation);
            }

            const destination = github.url + postFileName;
            logger.info('Destination: ' + destination);
            payloadOptions = {
                method : 'PUT', //Not sure why PUT works but POST does not.
                url : destination,
                headers : {
                    Authorization : 'token ' + github.key,
                    'Content-Type' : 'application/vnd.github.v3+json', //Request v3 API
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
        });
});

module.exports = router;
