const express = require('express');
const router = new express.Router();
const path = require('path');
const fetch = require('node-fetch');
const request = require('request');

const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();
const config = require(appRootDirectory + '/app/config.js');
const github = config.github;
const serviceProfile = {
    'service' : 'Mastr Cntrl',
    'version' : '9000',
    'formatting' : 'Indie Web',
    'purpose' : 'Mastr Cntrl sees all'
};

//Define Route locations
const micropubGetRoute = require(appRootDirectory + '/app/routes/get/micropub');
const micropubPostRoute = require(appRootDirectory + '/app/routes/post/micropub');

// Get Routes
router.get('/micropub', micropubGetRoute.micropubGet);

// Catch any illegal routes
router.get('/', (req, res) => { res.json(serviceProfile); });

//POST Routes
router.post('/micropub', micropubPostRoute.micropubPost);


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


module.exports = router;
