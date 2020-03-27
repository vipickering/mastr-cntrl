const logger = require(appRootDirectory + '/app/logging/bunyan');

/*
I split the Note type in to either a note, reply or photo post.
Use some logic here to work out what the note contains to determine layout assigned.
*/
exports.formatLayout = function formatLayout(photoURL) {
    const checkLayout = photoURL;
    let layout = '';

    logger.info('Checking note type to assign layout');

    if (checkLayout !== '') {
        layout = 'notes';
        logger.info('Assigning' + layout);
    } else {
        layout = 'photos';
        logger.info('Assigning' + layout);
    }

    return layout;
};
