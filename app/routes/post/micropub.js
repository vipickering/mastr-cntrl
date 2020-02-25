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
    let publishedDate;
    let micropubType;
    let fileLocation;
    const micropubContent = req.body;
    const token = req.headers.authorization;
    const indieauth = 'https://tokens.indieauth.com/token';

    logger.info('json body ' + JSON.stringify(req.body)); //Log packages sent, for debug

    //Some P3K services send the published date-time. Others do not. Check if it exists, and if not do it ourselves.
    try {
        publishedDate = req.body.properties.published[0];
    } catch (e) {
        // publishedDate = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss+00:00');
        publishedDate = moment(new Date()).tz('Pacific/Auckland').format('YYYY-MM-DDTHH:mm:ss+00:00');
    }

    //Format date time for naming file.
    const postFileNameDate = publishedDate.slice(0, 10);
    const postFileNameTime = publishedDate.replace(/:/g, '-').slice(11, -9);
    const responseDate = postFileNameDate.replace(/-/g, '/');
    const responseLocationTime = publishedDate.slice(11, -12) + '-' + publishedDate.slice(14, -9);

    // Micropub Action (only fires if authentication passes)
    function micropubAction(json) {
        serviceIdentifier = json.client_id;
        logger.info('Service is: ' + serviceIdentifier);
        logger.info('Payload JSON: ' + JSON.stringify(micropubContent));

        // Monitor if we can get the micropub action
        // Once we have this, then we can send to an update function instead.
        const micropubActionValue = micropubContent.action;
        logger.info('Micropub action is: ' + micropubActionValue);

        switch (true) {
        case (serviceIdentifier === 'https://ownyourswarm.p3k.io') :
            micropubType = 'checkins';
            payload = formatCheckin.checkIn(micropubContent);
            fileLocation = 'src/_content/checkins';
            break;
        case (micropubContent.hasOwnProperty('bookmark-of')):
            micropubType = 'links';
            payload = formatBookmark.bookmark(micropubContent);
            fileLocation = 'src/_content/links';
            break;
        case (micropubContent.hasOwnProperty('like-of')):
            micropubType = 'favourites';
            payload = formatFavourite.favourite(micropubContent);
            fileLocation = 'src/_content/favourites';
            break;
        case (micropubContent.hasOwnProperty('in-reply-to')):
            micropubType = 'replies';
            payload = formatReplies.replies(micropubContent);
            fileLocation = 'src/_content/replies';
            break;
        case (micropubContent.hasOwnProperty('photo')): //does this work ok?
            micropubType = 'notes';
            payload = formatNote.note(micropubContent); //photos are formatted the same way for now.
            fileLocation = 'src/_content/photos';
            break;
        default:
            micropubType = 'notes';
            payload = formatNote.note(micropubContent);
            fileLocation = 'src/_content/notes';
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
