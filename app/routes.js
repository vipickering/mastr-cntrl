const express = require('express');
const router = new express.Router();
const path = require('path');
const fetch = require('node-fetch');
const request = require('request');
const moment = require('moment');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();
const config = require('../config');
const logger = require(__dirname + '/functions/bunyan');
const formatCheckin = require(__dirname + '/functions/format-swarm');
const formatInstagram = require(__dirname + '/functions/format-instagram');
const formatNote = require(__dirname + '/functions/format-note');
const github = config.github;
const serviceProfile = {
    'service' : 'Mastr Cntrl',
    'version' : '9000',
    'formatting' : 'Indie Web',
    'purpose' : 'Mastr Cntrl sees all'
};
const syndicateOptions = {
    'syndicate-to' : [{
        'uid' : 'https://twitter.com/vincentlistens/',
        'name' : 'Twitter'
    }, {
        'uid' : 'https://micro.blog/vincentp',
        'name' : 'MicroBlog'
    }, {
        'uid' : 'https://medium.com/@vincentlistens',
        'name' : 'Medium'
    }]
};
let serviceIdentifier = '';

router.get('/micropub', (req, res) => {
    const token = req.headers.authorization;
    const indieauth = 'https://tokens.indieauth.com/token';
    const authHeaders = {
        'Accept' : 'application/json',
        'Authorization' : token
    };
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

            if ((req.query.q === 'syndicate-to') && (serviceIdentifier === 'https://quill.p3k.io/')) {
                res.json(syndicateOptions);
            } else {
                res.json({});
            }
        });
});

// Catch any illegal routes
router.get('/', (req, res) => {
    res.json(serviceProfile);
});

// router.post('/webmention', (req, res) => {
//     let webmentionFileName = webmentions.json
//     let webmentionsOptions = {
//         method : 'PATCH',
//         url : github.webmentionUrl + webmentionFileName,
//         headers : {
//             Authorization : 'token ' + github.key,
//             'Content-Type' : 'application/vnd.github.v3+json; charset=UTF-8', //Request v3 API
//             'User-Agent' : github.name
//         },
//         body : {
//             path : webmentionFileName,
//             branch : github.branch,
//             message : messageContent,
//             committer : {
//                 'name' : github.user,
//                 'email' : github.email
//             },
//             content : payload
//         },
//         json : true
//     };

//         // The error checking here is poor. We are not handling if GIT throws an error.
//         request(payloadOptions, function sendIt(error, response, body) {
//             if (error) {
//                 res.status(400);
//                 res.send('Error Sending Payload');
//                 logger.error('Git creation failed:' + error);
//                 res.end('Error Sending Payload');
//                 throw new Error('failed to send ' + error);
//             } else {
//                 logger.info('Git creation successful!  Server responded with:', body);
//                 res.writeHead(201, {
//                     'location' : responseLocation
//                 });
//                 res.end('Thanks');
//             }
//         });
// });

// Micropub Endpoint
router.post('/micropub', (req, res) => {
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
        //2018-07-16T08:39:26+01:00
        publishedDate = req.body.properties.published[0];
    } catch (e) {
        //2018-07-16T14:38:52.444Z
        publishedDate = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss+01:00');
    }

    //Format date time for naming file.
    const postFileNameDate = publishedDate.slice(0, 10);
    const postFileNameTime = publishedDate.replace(/:/g, '-').slice(11, -9);
    const responseDate = postFileNameDate.replace(/-/g, '/');
    const responseLocationTime = publishedDate.slice(11, -12) + '-' + publishedDate.slice(14, -9);

    logger.info('Token Received: ' + token);

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
                messageContent = ':robot: Checkin submitted via micropub API';
                postFileName = postFileNameDate + '-' + postFileNameTime + '.md';
                responseLocation = 'https://vincentp.me/checkins/' + responseDate + '/' + responseLocationTime + '/';
                logger.info('response location ' + responseLocation);
                break;
            case 'https://ownyourgram.com':
                logger.info('Creating Instagram note');
                payload = formatInstagram.instagram(micropubContent);
                messageContent = ':robot: Instagram photo submitted via micropub API';
                postFileName = postFileNameDate + '-' + postFileNameTime + '.md';
                responseLocation = 'https://vincentp.me/notes/' + responseDate + '/' + responseLocationTime + '/';
                logger.info('response ' + responseLocation);
                break;
            default:
                logger.info('Creating Note');
                payload = formatNote.note(micropubContent);
                messageContent = ':robot: Note  submitted via micropub API';
                postFileName = postFileNameDate + '-' + postFileNameTime + '.md';
                responseLocation = 'https://vincentp.me/notes/' + responseDate + '/' + responseLocationTime + '/';
                logger.info('response location ' + responseLocation);
            }

            postDestination = github.postUrl + postFileName;

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
        });
});

module.exports = router;
