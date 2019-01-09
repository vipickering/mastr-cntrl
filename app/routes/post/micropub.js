const fetch = require('node-fetch');
const request = require('request');
const moment = require('moment');
const config = require(appRootDirectory + '/app/config.js');
const github = config.github;
const logger = require(appRootDirectory + '/app/functions/bunyan');
const formatCheckin = require(appRootDirectory + '/app/functions/formatters/swarm');
const formatInstagram = require(appRootDirectory + '/app/functions/formatters/instagram');
const formatNote = require(appRootDirectory + '/app/functions/formatters/note');
const formatBookmark = require(appRootDirectory + '/app/functions/formatters/bookmark');
const formatFavourite = require(appRootDirectory + '/app/functions/formatters/favourite');
const formatReplies = require(appRootDirectory + '/app/functions/formatters/replies');

exports.micropubPost = function micropubPost(req, res) {
    let serviceIdentifier = '';
    let postFileName;
    let responseLocation;
    let payload;
    let messageContent;
    let payloadOptions;
    let publishedDate;
    let postDestination;
    let noteType;
    let serviceType;
    const micropubContent = req.body;
    const token = req.headers.authorization;
    const accessToken = req.body.access_token;
    const formattedToken = token.slice(7); //Remove Bearer
    const indieauth = 'https://tokens.indieauth.com/token';

    //Log packages sent, for debug
    logger.info('json body ' + JSON.stringify(req.body));
    logger.info(`Authorization Token: ${token}`);
    logger.info(`Incoming Token: ${accessToken}`);
    logger.info(`Formatted Token: ${formattedToken}`);

    //Some P3K services send the published date-time. Others do not. Check if it exists, and if not do it ourselves.
    try {
        publishedDate = req.body.properties.published[0];
    } catch (e) {
        publishedDate = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss+00:00');
    }

    //Format date time for naming file.
    const postFileNameDate = publishedDate.slice(0, 10);
    const postFileNameTime = publishedDate.replace(/:/g, '-').slice(11, -9);
    const responseDate = postFileNameDate.replace(/-/g, '/');
    const responseLocationTime = publishedDate.slice(11, -12) + '-' + publishedDate.slice(14, -9);

    function sendtoGithub(error, response, body) {
        // The error checking here is poor. We are not handling if GIT throws an error.
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

    function authAction(json) {
        logger.info(JSON.stringify(json));
        serviceIdentifier = json.client_id;
        logger.info('Service Is: ' + serviceIdentifier);
        logger.info('Payload JSON: ' + JSON.stringify(micropubContent));

        switch (true) {
        case (serviceIdentifier === 'https://ownyourswarm.p3k.io') :
            serviceType = 'Checkin';
            noteType = 'checkins';
            logger.info('Creating Swarm checkin');
            payload = formatCheckin.checkIn(micropubContent);
            break;
        case (serviceIdentifier === 'https://ownyourgram.com/') :
            serviceType = 'Photo';
            noteType = 'notes';
            logger.info('Creating Instagram note');
            payload = formatInstagram.instagram(micropubContent);
            break;
        case (serviceIdentifier === 'https://indigenous.abode.pub/ios/') :
            serviceType = 'Note';
            noteType = 'notes';
            logger.info('Service Indigenous. Creating note');
            payload = formatNote.note(micropubContent);
            break;
        case ((serviceIdentifier === 'https://quill.p3k.io/') && (micropubContent.hasOwnProperty('bookmark-of'))):
            serviceType = 'Links';
            noteType = 'links';
            logger.info('Service Quill. Creating Bookmark');
            payload = formatBookmark.bookmark(micropubContent);
            break;
        case ((serviceIdentifier === 'https://quill.p3k.io/') && (micropubContent.hasOwnProperty('like-of'))):
            serviceType = 'Favourites';
            noteType = 'favourites';
            logger.info('Service Quill. Creating Favourite');
            payload = formatFavourite.favourite(micropubContent);
            break;
        case ((serviceIdentifier === 'https://quill.p3k.io/') && (micropubContent.hasOwnProperty('in-reply-to'))):
            serviceType = 'Replies';
            noteType = 'replies';
            logger.info('Service Quill. Creating Reply');
            payload = formatReplies.replies(micropubContent);
            break;
        case (serviceIdentifier === 'https://quill.p3k.io/'):
            serviceType = 'Note';
            noteType = 'notes';
            logger.info('Service Quill. Creating Note');
            payload = formatNote.note(micropubContent);
            break;
        default:
            serviceType = 'Note';
            noteType = 'notes';
            logger.info('Service not recognised. Creating default Note');
            payload = formatNote.note(micropubContent);
        }

        messageContent = `:robot: ${serviceType}  submitted by Mastrl Cntrl`;
        postFileName = `${postFileNameDate}-${postFileNameTime}.md`;
        responseLocation = `https://vincentp.me/${noteType}/${responseDate}/${responseLocationTime}/`;
        logger.info(`Response: ${responseLocation}`);
        postDestination = `${github.postUrl}/contents/_posts/${postFileName}`;
        logger.info(`Destination: ${postDestination}`);

        payloadOptions = {
            method : 'PUT',
            url : postDestination,
            headers : {
                Authorization : `token ${github.key}`,
                'Content-Type' : 'application/vnd.github.v3+json; charset=UTF-8',
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

        request(payloadOptions, sendtoGithub);
    }

    function authResponse(response) {
        if (accessToken === formattedToken) {
            logger.info('tokens match');
        } else {
            logger.info('token invalid');
        }
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
