const logger = require(appRootDirectory + '/app/logging/bunyan');

/*
Check for Tags and add them or default to miscellaneous
*/
exports.formatTags = function formatTags(micropubContent) {
    let tags = '';
    let tagArray = '';

    logger.info('Checking for tags');
    try {
        tagArray = micropubContent.category;
        for (let i = 0; i < tagArray.length; i++) {
            tags += '\n- ';
            tags += tagArray[i];
            logger.info('Found tag' + tagArray[i]);
        }
    } catch (e) {
        logger.info('No tags provided assigning miscellaneous');
        tags += '\n- ';
        tags += 'miscellaneous';
    }

    return tags;
};
