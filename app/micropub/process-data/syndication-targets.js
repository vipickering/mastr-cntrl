const logger = require(appRootDirectory + '/app/logging/bunyan');

/*
Check for existance of photos and if they exist, create the URLS.
The Media endpoint handles the actual image, we don't need to bother with that here
*/
exports.formatTargets = function formatTargets(micropubContent) {
    let targets = '';

    logger.info('Checking for syndication targets');
    try {
        const targetArray = micropubContent['mp-syndicate-to'];

        for (let j = 0; j < targetArray.length; j++) {
            logger.info(targetArray[j]);
            targets += '\n- ';
            targets += targetArray[j];
        }
    } catch (e) {
        logger.info('No Syndication targets');
        targets = '';
    }

    return targets;
};
