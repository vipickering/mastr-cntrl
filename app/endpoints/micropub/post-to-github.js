const fetch = require('node-fetch');
const logger = require(appRootDirectory + '/app/logging/bunyan');
const formatCheckin = require(appRootDirectory + '/app/endpoints/micropub/format/checkin');
const formatNote = require(appRootDirectory + '/app/endpoints/micropub/format/note');
const formatPhoto = require(appRootDirectory + '/app/endpoints/micropub/format/photo');
const formatBookmark = require(appRootDirectory + '/app/endpoints/micropub/format/links');
const formatFavourite = require(appRootDirectory + '/app/endpoints/micropub/format/favourite');
const formatReplies = require(appRootDirectory + '/app/endpoints/micropub/format/replies');
const githubApi = require(appRootDirectory + '/app/github/post-to-api');

exports.micropubPost = function micropubPost(req, res) {
    let serviceIdentifier = '';
    let fileName;
    let responseLocation;
    let payload;
    let micropubType;
    let fileLocation;
    let commitMessage;
    const micropubContent = req.body;
    const token = req.headers.authorization;
    const indieauth = 'https://tokens.indieauth.com/token';

    logger.info('json body ' + JSON.stringify(req.body)); //Log packages sent, for debug

    // Create File name and return URL from the type, date and time of publish
    const publishedDate = new Date().toISOString();
    logger.info(`published date is ${publishedDate}`);
//Sample -> 2020-10-11T00:53:23.513Z
//2020-10-11-3-41
    //Format date time for naming file.
    const postFileNameDate = publishedDate.slice(0, 10);
    logger.info(`slice 10 ${postFileNameDate}`);

    const postFileNameTime = publishedDate.replace(/:/g, '-').slice(12, -8);
    logger.info(`slice 11,-9 ${postFileNameTime}`);

    const responseDate = postFileNameDate.replace(/-/g, '/');
    logger.info(`add dash ${responseDate}`);

    const responseLocationTime = publishedDate.slice(10, -11) + '-' + publishedDate.slice(14, -10);
    logger.info(`responseLocationTime ${responseLocationTime}`);

    // Micropub Action (only fires if authentication passes)
    function micropubAction(json) {
        serviceIdentifier = json.client_id;
        logger.info('Service is: ' + serviceIdentifier);
        logger.info('Payload JSON: ' + JSON.stringify(micropubContent));

        switch (true) {
        case (serviceIdentifier === 'https://ownyourswarm.p3k.io') :
            micropubType = 'checkins';
            payload = formatCheckin.checkIn(micropubContent);
            fileLocation = 'src/_content/checkins';
            commitMessage = 'Checkin created via ownyourswarm';
            break;
        case (micropubContent.hasOwnProperty('bookmark-of')):
            micropubType = 'links';
            payload = formatBookmark.bookmark(micropubContent);
            fileLocation = 'src/_content/links';
            commitMessage = 'Bookmark created';
            break;
        case (micropubContent.hasOwnProperty('like-of')):
            micropubType = 'favourites';
            payload = formatFavourite.favourite(micropubContent);
            fileLocation = 'src/_content/favourites';
            commitMessage = 'Favourite created';
            break;
        case (micropubContent.hasOwnProperty('in-reply-to')):
            micropubType = 'replies';
            payload = formatReplies.replies(micropubContent);
            fileLocation = 'src/_content/replies';
            commitMessage = 'Reply created';
            break;
        default:
            // This is a pain. If micropubContent.properties test is a switch clause it causes the server to crash, when NULL. Wrapping it in a try/catch gets around the issue
            try {
                micropubContent.properties.hasOwnProperty('photo');
                micropubType = 'photos';
                payload = formatPhoto.photo(micropubContent);
                fileLocation = 'src/_content/photos';
                commitMessage = 'Photo post created';
            } catch (e) {
                micropubType = 'notes';
                payload = formatNote.note(micropubContent);
                fileLocation = 'src/_content/notes';
                commitMessage = 'Note created';
            }
        }

        logger.info('Micropub content is: ' + micropubType);
        fileName = `${postFileNameDate}-${postFileNameTime}.md`;
        responseLocation = `https://vincentp.me/${micropubType}/${responseDate}/${responseLocationTime}/`;

        githubApi.publish(req, res, fileLocation, fileName, responseLocation, payload, commitMessage);
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
