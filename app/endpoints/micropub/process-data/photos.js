const logger = require(appRootDirectory + '/app/logging/bunyan');

/*
Check for existance of photos and if they exist, create the URLS.
The Media endpoint handles the actual image, we don't need to bother with that here
*/
exports.formatPhotos = function formatPhotos(micropubContent) {
    let photoURL = '';

    logger.info('Checking for media');
    try {
        const photoArray = micropubContent.properties.photo;
        logger.info(photoArray);
        for (let j = 0; j < photoArray.length; j++) {
            photoURL += `photo${j + 1}Url: "${photoArray[j].value}"\n`;
            logger.info('photo data: ' + photoArray[j].value);
        }
    } catch (e) {
        logger.info('No photo provided');
    }
    logger.info(photoURL);
    return photoURL;
};
