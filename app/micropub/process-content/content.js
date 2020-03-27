const logger = require(appRootDirectory + '/app/logging/bunyan');

/*
Check for Micropub main content and catch if there has been none sent.
*/
exports.formatContent = function formatContent(micropubContent) {
    let content = micropubContent.content;
    logger.info('Checking for text content');

    if (content !== '') {
        logger.info('Content found');
    } else {
        logger.info('No content micropubContent.content');
        content = '';
    }

    return content;
};
