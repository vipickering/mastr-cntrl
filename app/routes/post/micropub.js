const fetch = require('node-fetch');
// const request = require('request');
const moment = require('moment');
// const base64 = require('base64it');
// const config = require(appRootDirectory + '/app/config.js');
// const github = config.github;
const logger = require(appRootDirectory + '/app/functions/bunyan');
const formatCheckin = require(appRootDirectory + '/app/functions/formatters/swarm');
const formatNote = require(appRootDirectory + '/app/functions/formatters/note');
const formatBookmark = require(appRootDirectory + '/app/functions/formatters/bookmark');
const formatFavourite = require(appRootDirectory + '/app/functions/formatters/favourite');
const formatReplies = require(appRootDirectory + '/app/functions/formatters/replies');
const githubApi = require(appRootDirectory + '/app/functions/githubApi');

exports.micropubPost = function micropubPost(req, res) {
    let serviceIdentifier = '';
    // let postFileName;
    let fileLocation;
    let fileName;
    let responseLocation;
    let payload;
    let messageContent;
    let payloadOptions;
    let publishedDate;
    // let postDestination;
    let micropubType;
    let payloadEncoded;
    let postFileNameDate;
    let postFileNameTime;
    let responseDate;
    let responseLocationTime;
    const micropubContent = req.body;
    const token = req.headers.authorization;
    const accessToken = req.body.access_token;
    const formattedToken = token.slice(7); //Remove Bearer
    const indieauth = 'https://tokens.indieauth.com/token';

    // logger.info('json body ' + JSON.stringify(req.body));     //Log packages sent, for debug

    //Some P3K services send the published date-time. Others do not. Check if it exists, and if not do it ourselves.
    try {
        publishedDate = req.body.properties.published[0];
    } catch (e) {
        publishedDate = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss+00:00');
    }

    //Format date time for naming file.
    postFileNameDate = publishedDate.slice(0, 10);
    postFileNameTime = publishedDate.replace(/:/g, '-').slice(11, -9);
    responseDate = postFileNameDate.replace(/-/g, '/');
    responseLocationTime = publishedDate.slice(11, -12) + '-' + publishedDate.slice(14, -9);

    function sendtoGithub(error, response, body) {
        if (error) {
            res.status(400);
            res.send('Error Sending Payload');
            logger.error(`Git creation failed: ${error}`);
            res.end('Error Sending Payload');
            throw new Error(`Failed to send: ${error}`);
        } else {
            logger.info('Git creation successful!  Server responded with:', body);
            res.writeHead(201, {
                'location' : responseLocation
            });
            res.end('Thanks');
        }
    }

    // Micropub Action (only fires if authentication passes)
    function authAction(json) {
        serviceIdentifier = json.client_id;
        logger.info('Service Is: ' + serviceIdentifier);
        logger.info('Payload JSON: ' + JSON.stringify(micropubContent));

        switch (true) {
        case (serviceIdentifier === 'https://ownyourswarm.p3k.io') :
            micropubType = 'checkins';
            payload = formatCheckin.checkIn(micropubContent);
            break;
        case (micropubContent.hasOwnProperty('bookmark-of')):
            micropubType = 'links';
            payload = formatBookmark.bookmark(micropubContent);
            break;
        case (micropubContent.hasOwnProperty('like-of')):
            micropubType = 'favourites';
            payload = formatFavourite.favourite(micropubContent);
            break;
        case (micropubContent.hasOwnProperty('in-reply-to')):
            micropubType = 'replies';
            payload = formatReplies.replies(micropubContent);
            break;
        default:
            micropubType = 'notes';
            payload = formatNote.note(micropubContent);
        }

        fileLocation = `_posts`;
        fileName = `${postFileNameDate}-${postFileNameTime}.md`;
        responseLocation = `https://vincentp.me/${micropubType}/${responseDate}/${responseLocationTime}/`;

        githubApi.publish(fileLocation, fileName, responseLocation, payload);

        // payloadEncoded = base64.encode(payload);

        // Begin Github Submission
        // messageContent = `:robot: submitted by Mastrl Cntrl`;
         // logger.info(`Response: ${responseLocation}`);
        // logger.info(`Destination: ${postDestination}`);

    //     payloadOptions = {
    //         method : 'PUT',
    //         url : postDestination,
    //         headers : {
    //             Authorization : `token ${github.key}`,
    //             'Content-Type' : 'application/vnd.github.v3+json; charset=UTF-8',
    //             'User-Agent' : github.name
    //         },
    //         body : {
    //             path : postFileName,
    //             branch : github.branch,
    //             message : messageContent,
    //             committer : {
    //                 'name' : github.user,
    //                 'email' : github.email
    //             },
    //             content : payloadEncoded
    //         },
    //         json : true
    //     };

    //     request(payloadOptions, sendtoGithub);
    //      // End Github Submission
    }

    // Check indieauthentication
    function authResponse(response) {
            return response.json();
    }

    fetch(indieauth, {
        method : 'GET',
        headers : {
            'Accept' : 'application/json',
            'Authorization' : token
        }
    })
        .then(authResponse)
        .then(authAction)
        .catch((err) => logger.error(err));
};
