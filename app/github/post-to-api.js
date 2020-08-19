/*
POST content to the Github API
*/

const axios = require('axios');
const base64 = require('base64it');
const logger = require(appRootDirectory + '/app/logging/bunyan');
const config = require(appRootDirectory + '/app/config.js');
const github = config.github;
const slack = require(appRootDirectory + '/app/slack/post-message-slack');

exports.publish = function publish(req, res, fileLocation, fileName, responseLocation, payload, commitMessage) {
    const payloadEncoded = base64.encode(payload);
    const fileDestination = `${github.postUrl}/contents/${fileLocation}/${fileName}`;
    const messageContent = `:robot: ${commitMessage}`;

    (async () => {
        try {
        const options = {
            method : 'PUT',
            url : fileDestination,
            headers : {
                Authorization : `token ${github.key}`,
                'Content-Type' : 'application/vnd.github.v3+json; charset=UTF-8',
                'User-Agent' : github.name
            },
            data : {
                path : fileName,
                message : messageContent,
                branch : github.branch,
                content : payloadEncoded,
                committer : {
                    name : github.user,
                    email : github.email
                }
            }
        };

        const response = await axios(options);
            res.writeHead(201, {'location' : responseLocation});
            logger.info('GIT PUT Success');
            res.end('Thanks');
        } catch (error) {
            res.status(400);
            res.send('Update failed');
            logger.info('GIT PUT Failed');
            slack.sendMessage('Micropub failed, check logs');
            logger.error(error.response);
            logger.info(error.response.data.message);
            res.end('Error Sending Payload');
        }
        })();
};
