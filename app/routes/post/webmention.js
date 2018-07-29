const request = require('request');
const config = require(appRootDirectory + '/app/config.js');
const github = config.github;

exports.webmentionPost = function webmentionPost(req, res) {
    let webmentionFileName = webmentions.json
    let webmentionsOptions = {
        method : 'PATCH',
        url : github.webmentionUrl + webmentionFileName,
        headers : {
            Authorization : 'token ' + github.key,
            'Content-Type' : 'application/vnd.github.v3+json; charset=UTF-8', //Request v3 application
            'User-Agent' : github.name
        },
        body : {
            path : webmentionFileName,
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
};
