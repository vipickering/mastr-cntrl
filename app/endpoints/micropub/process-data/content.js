const logger = require(appRootDirectory + '/app/logging/bunyan');

/*
Check for Micropub main content and catch if there has been none sent.
*/
exports.formatContent = function formatContent(micropubContent) {
    let content = '';

    // Content is sent from different places if its a photo, checking  or a standard note.
    logger.info('Checking for text content,');
    try {
        //Standard Note
        content = micropubContent.content;
    } catch (e) {
        logger.info('No basic note content provided');
    }

    try {
        // Photo Note
        content = micropubContent.properties.content;
    } catch (e) {
        logger.info('No photo note content');
    }

    try {
        // Checkin
        content = micropubContent.properties.content[0];
    } catch (e) {
        logger.info('No checkin content');
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
