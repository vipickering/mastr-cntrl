const logger = require(appRootDirectory + '/app/logging/bunyan');

/*
Swarm uses a strange way to send photos. So I am isolating the code here
Check for existance of photos and if they exist, create the URLS.
The Media endpoint handles the actual image, we don't need to bother with that here
*/
exports.formatPhotos = function formatPhotos(micropubContent) {
    let photoURL = '';

    logger.info('Checking for media');
    try {
        const photoArray = micropubContent.properties.photo[0]; //This is the different path

        for (let j = 0; j < photoArray.length; j++) {
            photoURL += `photo${j + 1}Url: "${photoArray[j].value}"\n`;
            logger.info('photo data: ' + photoArray[j].value);
        }
    } catch (e) {
        logger.info('No swarm photo provided');
    }

    return photoURL;
};
