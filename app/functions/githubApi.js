const request = require('request');
const base64 = require('base64it');
const logger = require(appRootDirectory + '/app/functions/bunyan');
const config = require(appRootDirectory + '/app/config.js');
const github = config.github;
const website = config.website;

exports.publish = function publish(req, res, fileLocation, fileName, responseLocation, payload) {
    const payloadEncoded = base64.encode(payload);
    const fileDestination = `${github.postUrl}/contents/${fileLocation}/${fileName}`;
    const messageContent = `:robot: submitted by Mastrl Cntrl`;
    const options = {
        method : 'PUT',
        url : fileDestination,
        headers : {
            Authorization : `token ${github.key}`,
            'Content-Type' : 'application/vnd.github.v3+json; charset=UTF-8',
            'User-Agent' : github.name
        },
        body : {
            path : fileName,
            branch : github.branch,
            message : messageContent,
            committer : {
                'name' : github.user,
                'email' : github.email
            },
            content : payloadEncoded
        },
        json : true
    };

    function sendtoGithub(error, response, body) {
        if (error) {
            res.status(400);
            res.send('Error Sending Payload');
            logger.error(`Git creation failed: ${error}`);
            res.end('Error Sending Payload');
            throw new Error(`Failed to send: ${error}`);
        } else {
            logger.info('Git creation successful!');
            res.writeHead(201, {'location' : responseLocation});
            res.send('Accepted');
        }
    }

    logger.info(`Response: ${responseLocation}`);
    logger.info(`Destination: ${fileDestination}`);
    request(options, sendtoGithub);
};
