const logger = require(appRootDirectory + '/app/logging/bunyan');

/*
Check for existance of syndication targets. If they exist output them.
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
            logger.info('Found Syndication Target ' + targetArray[j]);
        }
    } catch (e) {
        logger.info('No Syndication targets');
        targets = '';
    }

    return targets;
};
