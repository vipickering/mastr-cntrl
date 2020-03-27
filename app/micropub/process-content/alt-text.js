const logger = require(appRootDirectory + '/app/logging/bunyan');

/*
Check for existance of photos and if they exist, create the URLS.
The Media endpoint handles the actual image, we don't need to bother with that here
*/
exports.formatAltText = function formatAltText(micropubContent) {
    let alt = '';

    logger.info('Checking for alt text');
    try {
        const photoArray = micropubContent.properties.photo;

        for (let j = 0; j < photoArray.length; j++) {
            alt += `photo${j + 1}_alt: "${photoArray[j].alt}"\n`;
        }
    } catch (e) {
        logger.info('No alt text provided');
    }

    return alt;
};
