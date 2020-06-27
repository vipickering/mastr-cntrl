const logger = require(appRootDirectory + '/app/logging/bunyan');

/*
Swarm uses a strange way to send photos. So I am isolating the code here
Check for existance of photos and if they exist, create the URLS.
The Media endpoint handles the actual image, we don't need to bother with that here
*/
exports.formatAltText = function formatAltText(micropubContent) {
    let alt = '';

    logger.info('Checking for alt text');
    try {
        const photoArray = micropubContent.properties.photo[0]; //This is the different path

        for (let j = 0; j < photoArray.length; j++) {
            alt += `photo${j + 1}Alt: "${photoArray[j].alt}"\n`;
        }
    } catch (e) {
        logger.info('No alt text provided');
    }

    return alt;
};
