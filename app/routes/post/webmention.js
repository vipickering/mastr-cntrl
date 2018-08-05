const request = require('request');
const config = require(appRootDirectory + '/app/config.js');
const github = config.github;
const logger = require(appRootDirectory + '/app/functions/bunyan');
exports.webmentionPost = function webmentionPost(req, res) {

    let sourceURL = req.body.source;
    let targetURL = req.body.target;
    logger.info(req.body);
    logger.info(sourceURL);
    logger.info(targetURL);


    if (sourceURL === targetURL) {
        res.status(400);
        res.send('Source and Target URLS should not match');
    } else {
        res.status(202);
        res.send('Accepted');
    }



    // let webmentionFileName = "webmentions.json"
    // let webmentionsOptions = {
    //     method : 'PATCH',
    //     url : github.webmentionUrl + webmentionFileName,
    //     headers : {
    //         Authorization : 'token ' + github.key,
    //         'Content-Type' : 'application/vnd.github.v3+json; charset=UTF-8',
    //         'User-Agent' : github.name
    //     },
    //     body : {
    //         path : webmentionFileName,
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

    // // The error checking here is poor. We are not handling if GIT throws an error.
    // request(payloadOptions, function sendIt(error, response, body) {
    //     if (error) {
    //         res.status(400);
    //         res.send('Error Sending Payload');
    //         logger.error('Git creation failed:' + error);
    //         res.end('Error Sending Payload');
    //         throw new Error('failed to send ' + error);
    //     } else {
    //         logger.info('Git creation successful!  Server responded with:', body);
    //         res.writeHead(201, {
    //             'location' : responseLocation
    //         });
    //         res.end('Thanks');
    //     }
    // });
};
