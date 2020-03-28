const logger = require(appRootDirectory + '/app/logging/bunyan');

/*
Check for Micropub main content and catch if there has been none sent.
*/
exports.formatContent = function formatContent(micropubContent) {
    let content = micropubContent.content;
    logger.info('Checking for text content');

    if (content !== '') {
        logger.info('Content found');
        logger.info('Content is: ' + content);
    } else {
        logger.info('No content found: ' + content);
        content = '';
    }

    return content;
};
