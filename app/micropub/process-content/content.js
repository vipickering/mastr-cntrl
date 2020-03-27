const logger = require(appRootDirectory + '/app/logging/bunyan');

/*
Check for Micropub main content and catch if there has been none sent.
*/
exports.formatContent = function formatContent(micropubContent) {
    let content = '';

    try {
        content = micropubContent.content;
    } catch (e) {
        logger.info('No content micropubContent.content');
    }

    return content;
};
