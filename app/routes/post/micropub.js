const fetch = require('node-fetch');
const moment = require('moment');
const tz = require('moment-timezone');
const logger = require(appRootDirectory + '/app/functions/bunyan');
const formatCheckin = require(appRootDirectory + '/app/functions/formatters/swarm');
const formatNote = require(appRootDirectory + '/app/functions/formatters/note');
const formatBookmark = require(appRootDirectory + '/app/functions/formatters/bookmark');
const formatFavourite = require(appRootDirectory + '/app/functions/formatters/favourite');
const formatReplies = require(appRootDirectory + '/app/functions/formatters/replies');
const githubApi = require(appRootDirectory + '/app/functions/githubApi');

exports.micropubPost = function micropubPost(req, res) {
    let serviceIdentifier = '';
    let fileName;
    let responseLocation;
    let payload;
    let messageContent;
    let payloadOptions;
    let publishedDate;
    let micropubType;
    let payloadEncoded;
    let postFileNameDate;
    let postFileNameTime;
    let responseDate;
    let responseLocationTime;
    const fileLocation = `_posts`;
    const micropubContent = req.body;
    const token = req.headers.authorization;
    const accessToken = req.body.access_token;
    const formattedToken = token.slice(7); //Remove Bearer
    const indieauth = 'https://tokens.indieauth.com/token';

    logger.info('json body ' + JSON.stringify(req.body));     //Log packages sent, for debug

    //Some P3K services send the published date-time. Others do not. Check if it exists, and if not do it ourselves.
    try {
        publishedDate = req.body.properties.published[0];
    } catch (e) {
        // publishedDate = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss+00:00');
        publishedDate = moment(new Date()).tz('Pacific/Auckland').format('YYYY-MM-DDTHH:mm:ss+00:00');
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
    function micropubAction(json) {
        serviceIdentifier = json.client_id;
        logger.info('Service is: ' + serviceIdentifier);
        logger.info('Payload JSON: ' + JSON.stringify(micropubContent));

        // Monitor if we can get the micropub action
        // Once we have this, then we can send to an update function unstead.
        let micropubAction = micropubContent.action;
        logger.info('Micropub action is: ' + micropubAction);

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

        fileName = `${postFileNameDate}-${postFileNameTime}.md`;
        responseLocation = `https://vincentp.me/${micropubType}/${responseDate}/${responseLocationTime}/`;

        githubApi.publish(req, res, fileLocation, fileName, responseLocation, payload);
    }

    // Check indie authentication
    function indieAuthentication(response) {
            return response.json();
    }

    fetch(indieauth, {
        method : 'GET',
        headers : {
            'Accept' : 'application/json',
            'Authorization' : token
        }
    })
        .then(indieAuthentication)
        .then(micropubAction)
        .catch((err) => logger.error(err));
};
