const logger = require(appRootDirectory + '/app/functions/bunyan');

exports.webmention = function webmention(micropubContent) {
    logger.info('Webmention content: ' + JSON.stringify(micropubContent));
    return JSON.stringify(micropubContent);
};
