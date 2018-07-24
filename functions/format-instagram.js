const base64 = require('base64it');
const logger = require('../functions/bunyan');

exports.instagram = function instagram(micropubContent) {
    const layout = 'instagram';
    const category = 'Notes';
    const pubDate = micropubContent.properties.published[0];
    const syndication = micropubContent.properties.syndication[0];
    const title = micropubContent.content[0].substring(0, 100);
    let content = '';
    let photo = '';
    let addrLat = '';
    let addrLong  = '';

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

    const entry = `---
layout: "${layout}"
title: "${title}"
photo: "${photo}"
date: "${pubDate}"
meta: "Checked in at ${title}"
category: "${category}"
syndication: "${syndication}"
latitude: "${addrLat}"
longitude: "${addrLong}"
twitterCard: false
---
${content}
`;
    logger.info('Instragram content: ' + entry);
    const micropubContentFormatted = base64.encode(entry);
    return micropubContentFormatted;
};
