const logger = require(appRootDirectory + '/app/functions/bunyan');

exports.webmention = function webmention(webmentionContent) {

    logger.info('Webmention content: ' + JSON.stringify(webmentionContent));
    return JSON.stringify(webmentionContent);
};
