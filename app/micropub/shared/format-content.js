/*
Check for Micropub main content and catch if there has been none sent.
*/
exports.findContent = function findContent(micropubContent) {
    let content = '';

    try {
        content = micropubContent.content;
    } catch (e) {
        logger.info('No content micropubContent.content');
    }

    return content;
};
