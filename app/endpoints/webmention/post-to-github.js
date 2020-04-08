const logger = require(appRootDirectory + '/app/logging/bunyan');
const config = require(appRootDirectory + '/app/config.js');
// const determineWebmention = require(appRootDirectory + '/app/endpoints/webmention/determine-webmention');
const github = config.github;
const webmentionIO = config.webmentionIO;
const githubApi = require(appRootDirectory + '/app/github/post-to-api');

exports.webmentionPost = function webmentionPost(req, res) {
    const commitMessage = 'Webmention submitted from Webmention.IO';
    let payload;
    let responseLocation;
    let filePath;
    let fileLocation;
    let postFileName;
    let fileName;
    let webmentionFileName;
    let webmentionId;

    logger.info('Webmention Debug: ' + JSON.stringify(req.body));

    if (req.body.secret === webmentionIO.webhookToken) {
        logger.info('Webmention recieved');
        const webmention = req.body.post;
        logger.info(`Creating Webmention:  ${webmention}`);

        // const alt = determineWebmention.getType(micropubContent);
        //quick and dirty code to work out WM.
        if (webmention['wm-property'] === 'bookmark-of ') {
            filePath = 'bookmarks';
            webmentionFileName = 'bookmark';
        } else if (webmention['wm-property'] === 'like-of') {
            filePath = 'likes';
            webmentionFileName = 'like';
        } else if (webmention['wm-property'] === 'mention-of') {
            filePath = 'mentions';
            webmentionFileName = 'mention';
        } else if (webmention['wm-property'] === 'in-reply-to') {
            filePath = 'replies';
            webmentionFileName = 'reply';
        } else if (webmention['wm-property'] === 'rsvp') {
            filePath = 'rsvps';
            webmentionFileName = 'rsvp';
        } else if (webmention['wm-property'] === 'repost') {
            filePath = 'reposts';
            webmentionFileName = 'repost';
        } else {
            filePath = 'unknown';
            webmentionFileName = 'unknown';
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

        logger.info('file path: ' + filePath);
        fileName = `${webmentionFileName}_${webmentionId}.json`;
        fileLocation = `${github.postUrl}/contents/src/_data/${filePath}/${postFileName}`;
        responseLocation = fileLocation;
        githubApi.publish(req, res, fileLocation, fileName, responseLocation, payload, commitMessage);
    } else {
        res.status(400);
        res.send('Secret incorrect');
    }
};
