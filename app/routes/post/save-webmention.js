const rp = require('request-promise');
const base64 = require('base64it');
const logger = require(appRootDirectory + '/app/logging/bunyan');
const config = require(appRootDirectory + '/app/config.js');
const github = config.github;
const webhookKey = config.webmention.webhook;

exports.webmentionPost = function webmentionPost(req, res) {
    const messageContent = ':robot: Webmentions updated by Mastrl Cntrl';

    let payload;
    let createFileOptions;
    let encodedContent;
    let filePath;
    let postDestination;
    let postFileName;
    let fileName;
    let webmentionFolder;
    let webmentionId;

    function handlePatchError(err) {
        logger.info('Webmention update to Github API Failed');
        logger.error(err);
        res.status(400);
        res.send('Update failed');
    }

    function functionFinish() {
        logger.info('Webmentions complete');
        res.status(202);
        res.send('Accepted');
    }

    logger.info('Webmention Debug: ' + JSON.stringify(req.body));

    if (req.body.secret === webhookKey) {
        logger.info('Webmention recieved');
        const webmention = req.body.post;
        logger.info(`Creating Webmention:  ${webmention}`);

        // Prepare the code to send to Github API
        payload = webmention;
        logger.info('payload combined');

        //Base 64 Encode for Github API
        encodedContent = base64.encode(payload);
        logger.info('payload encoded');

        //quick and dirty code to work out WM.
        // update to case statement if it works ok.
        if (webmention['wm-property'] === 'bookmark-of ') {
            webmentionFolder = 'bookmarks';
            fileName = 'bookmark';
        } else if (webmention['wm-property'] === 'like-of') {
            webmentionFolder = 'likes';
            fileName = 'like';
        } else if (webmention['wm-property'] === 'mention-of') {
            webmentionFolder = 'mentions';
            fileName = 'mention';
        } else if (webmention['wm-property'] === 'in-reply-to') {
            webmentionFolder = 'replies';
            fileName = 'reply';
        } else if (webmention['wm-property'] === 'rsvp') {
            webmentionFolder = 'rsvps';
            fileName = 'rsvp';
        } else if (webmention['wm-property'] === 'repost') {
            webmentionFolder = 'reposts';
            fileName = 'repost';
        } else {
            webmentionFolder = 'unknown';
            fileName = 'unknown';
        }

        try {
            webmentionId = webmention['wm-id'][0];
            logger.info('Webmention File Name wm-id[0]: ' + webmentionId);
        } catch (e) {
            logger.info('wm-id [0] failed');
        }

        try {
            webmentionId = webmention['wm-id'];
            logger.info('Webmention File Name wm-id: ' + webmentionId);
        } catch (e) {
            logger.info('wm-id failed');
        }

        filePath = webmentionFolder;
        logger.info('file path: ' + filePath);
        postFileName = `${fileName}_${webmentionId}.json`;
        postDestination = `${github.postUrl}/contents/src/_data/${filePath}/${postFileName}`;

        createFileOptions = {
            method : 'PUT',
            uri : postDestination,
            headers : {
                Authorization : 'token ' + github.key,
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
                content : encodedContent
            },
            json : true
        };
        // Push file in to Github API.
        rp(createFileOptions)
            .then(functionFinish)
            .catch(handlePatchError);
    } else {
        res.status(400);
        res.send('Secret incorrect');
    }
};
