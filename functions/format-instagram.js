const base64 = require('base64it');
const logger = require('../functions/bunyan');

exports.checkIn = function checkIn(micropubContent) {
    const layout = 'notes';
    const category = 'Notes';
    // const rawPubDate = micropubContent.properties.published[0];
    // const rawDate = rawPubDate.slice(0, 10);
    // const rawTime = rawPubDate.replace(/-/g, ':').slice(11, -9);
    // const pubDate = rawDate + ' ' + rawTime + ' +/-GMT';
    // const syndication = micropubContent.properties.syndication[0];
    // const checkinName = 'Instagram content ' + pubDate;
    let summary = '';
    let content = '';
    let photo = '';
    let addrLat = '';
    let addrLong  = '';
    let addrName = '';
    console.log(micropubContent);
    console.log(JSON.stringify(micropubContent));
    logger.info(micropubContent);
    try {
        content = micropubContent.properties.content[0];
    } catch (e) {
        logger.info('No content skipping..');
    }
    try {
        photo = micropubContent.properties.photo[0];
    } catch (e) {
        logger.info('No photo skipping..');
    }
    try {
        addrLat = micropubContent.properties.location[0].properties.latitude[0];
    } catch (e) {
        logger.info('No lattitude link skipping..');
    }
    try {
        addrLong = micropubContent.properties.location[0].properties.longitude[0];
    } catch (e) {
        logger.info('No longitude link skipping..');
    }
    try {
        addrName = micropubContent.properties.location[0].properties.name[0];
    } catch (e) {
        logger.info('No addrName skipping..');
    }

    const entry = `---
layout: "${layout}"
photo: "${photo}"
summary: "${summary}"
category: "${category}"
name: "${addrName}"
latitude: "${addrLat}"
longitude: "${addrLong}"
twitterCard: false
---
${content}
`;
    logger.info('Instagram content: ' + entry);
    const micropubContentFormatted = base64.encode(entry);
    return micropubContentFormatted;
};
