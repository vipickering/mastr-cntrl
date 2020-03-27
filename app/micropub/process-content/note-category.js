const logger = require(appRootDirectory + '/app/logging/bunyan');

/*
I split the Note type in to either a note, reply or photo post.
Use some logic here to work out what the note contains to determine layout assigned.
*/
exports.formatCategory = function formatCategory(photoURL) {
    const checkLayout = photoURL;
    let category = '';

    logger.info('Checking note type to assign category');

    if (checkLayout !== '') {
        category = 'Notes';
        logger.info('Assigning' + category);
    } else {
        category = 'Photos';
        logger.info('Assigning' + category);
    }

    return category;
};
