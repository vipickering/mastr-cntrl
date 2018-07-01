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
const github = config.github;
 let serviceIdentifier = '';

router.get('/', (req, res) => {
    res.render('index');
});

// Publish Elsewhere, Syndicate (to your) Own Site Endpoint.
router.post('/pesos', function appRouterPostman(req, res, next) {
    let postFileName;
    let responseLocation;
    let payload;
    let messageContent;
    let payloadOptions;
    const publishedDate = '2018-06-17T12:00:21+01:00';
    // const publishedDate = req.body.properties.published[0];
    const postFileNameDate = publishedDate.slice(0, 10);
    const postFileNameTime = publishedDate.replace(/:/g, '-').slice(11, -9);
    const responseDate = postFileNameDate.replace(/-/g, '/');
    const responseLocationTime = publishedDate.slice(11, -12) + '-' + publishedDate.slice(14, -9);
    const micropubContent = req.body;
    const token = req.headers.authorization;
    const indieauth = 'https://tokens.indieauth.com/token';
    const authHeaders = {
       'Accept' : 'application/json',
       'Authorization': token
    };

    logger.info('Token Recieved: '+ token);

    /* example response we want
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
    fetch(indieauth, { method: 'GET', headers: authHeaders})
        .then(function(response){
             return response.json();
        })
        .then(function(json){
            console.log(json);
            console.log(micropubContent);
            serviceIdentifier = json.client_id;
            // serviceIdentifier = 'https://ownyourgram.com'; // Default temp route.

             // Work out if this is from a service we want to post to the blog.
            switch (serviceIdentifier) {
            case 'https://ownyourswarm.p3k.io':
                logger.info('Swarm detected');
                payload = formatCheckin.checkIn(micropubContent);
                messageContent = ':robot: Checkin submitted via micropub API and ownyourswarm';
                postFileName = postFileNameDate + '-' + postFileNameTime + '.md';
                responseLocation = 'https://vincentp.me/checkins/' + responseDate + '/' + responseLocationTime + '/';
                logger.info('response location ' + responseLocation);
                break;
            case 'https://ownyourgram.com':
                logger.info('Instagram detected');
                messageContent = ':robot: Instagram photo submitted via micropub API  and ownyourgram';
                postFileName = postFileNameDate + '-' + postFileNameTime + '.md';
                responseLocation = 'https://vincentp.me/instagram/' + responseDate + '/' + responseLocationTime + '/';
                logger.info('response ' + responseLocation);
                break;
            default:
                postFileName = '';
                responseLocation = '';
                logger.error('Service Not Recognised');
                logger.info('serviceIdentifier: ' + serviceIdentifier);
                res.status(400);
                res.end('Service  Not Recognised');
            }

            const destination = github.url + postFileName;
            logger.info('Destination: ' + destination);
            payloadOptions = {
                method : 'PUT',
                url : destination,
                headers : {
                    Authorization : 'token ' + github.key,
                    'Content-Type' : 'application/json',
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
