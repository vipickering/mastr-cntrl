// const request = require('request');
const rp = require('request-promise');
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

    function successful() {
        logger.info('Git creation successful!');
        // res.status(202);
        res.writeHead(201, {'location' : responseLocation});
        res.end('Thanks');
    }

    function handlePatchError(err) {
        res.status(400);
        res.send('Update failed');
        logger.info('POST to Github API Failed');
        logger.error(err);
        res.end('Error Sending Payload');
    }

    // function sendtoGithub(error, response, body) {
    //     if (error) {
    //         res.status(400);
    //         res.send('Error Sending Payload');
    //         logger.error(`Git creation failed: ${error}`);
    //         res.end('Error Sending Payload');
    //         throw new Error(`Failed to send: ${error}`);
    //     } else {
    //         logger.info('Git creation successful!  Server responded with:', body);
    //         res.writeHead(201, {
    //             'location' : responseLocation
    //         });
    //         res.end('Thanks');
    //     }
    // }

    logger.info(`Response: ${responseLocation}`);
    logger.info(`Destination: ${fileDestination}`);
    // request(payloadOptions, sendtoGithub);
    rp(options)
        .then(successful)
        .catch(handlePatchError);
};
