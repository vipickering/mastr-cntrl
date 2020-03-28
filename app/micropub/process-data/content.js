const logger = require(appRootDirectory + '/app/logging/bunyan');

/*
Check for Micropub main content and catch if there has been none sent.
*/
exports.formatContent = function formatContent(micropubContent) {
    let content = '';

    // Content is sent from Quil in different places if its a photo note or a standard note.
    logger.info('Checking for text content,');
    try {
        content = micropubContent.content;
        logger.info('Content is basic note content');
    } catch (e) {
        logger.info('No basic note content provided');
    }

    try {
        content = micropubContent.properties.content;
        logger.info('Content is photo note content');
    } catch (e) {
        logger.info('No photo note content');
    }

    if (content !== '') {
        logger.info('Content found');
        logger.info('Content is: ' + content);
    } else {
        logger.info('No content found: ' + content);
        content = '';
    }

    return content;
};
