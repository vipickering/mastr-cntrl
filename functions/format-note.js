const base64 = require('base64it');
const logger = require('../functions/bunyan');

exports.note = function note(micropubContent) {
    // Conditional here
    const layout = 'post';
    const category = 'Notes';
    // const syndication = micropubContent.properties.syndication[0]; // Might add this later
    // End

    const rawPubDate = micropubContent.properties.published[0];
    const rawDate = rawPubDate.slice(0, 10);
    const rawTime = rawPubDate.replace(/-/g, ':').slice(11, -9);
    const pubDate = rawDate + ' ' + rawTime + ' +/-GMT';

    let title ='';
    let summary = '';
    let content = '';
    let photo = '';
    let foursquare = '';
    let checkinLat = '';
    let checkinLong  = '';
    let checkinCountry = '';
    let checkinAddress   = '';
    let checkinLocality = '';
    let checkinRegion = '';
    let photoAddrLat = '';
    let photoAddrLong  = '';
    let photoAddrName = '';

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
        foursquare = micropubContent.properties.checkin[0].properties.url[0];
    } catch (e) {
        logger.info('No foursquare link skipping..');
    }
    try {
        checkinLat = micropubContent.properties.checkin[0].properties.latitude[0];
    } catch (e) {
        logger.info('No Checkin lattitude link skipping..');
    }
    try {
        checkinLong = micropubContent.properties.checkin[0].properties.longitude[0];
    } catch (e) {
        logger.info('No Checkin longitude link skipping..');
    }
    try {
        checkinLocality = micropubContent.properties.checkin[0].properties.locality[0];
    } catch (e) {
        logger.info('No Checkin locality link skipping..');
    }
    try {
        checkinAddress  = micropubContent.properties.checkin[0].properties.address[0];
    } catch (e) {
        logger.info('No Checkin address link skipping..');
    }
    try {
        checkinRegion = micropubContent.properties.checkin[0].properties.region[0];
    } catch (e) {
        logger.info('No Checkin region link skipping..');
    }
    try {
        checkinCountry = micropubContent.properties.checkin[0].properties['country-name'][0];
    } catch (e) {
        logger.info('No Checkin country link skipping..');
    }
    try {
        photoAddrLat = micropubContent.properties.location[0].properties.latitude[0];
    } catch (e) {
        logger.info('No Photo lattitude link skipping..');
    }
    try {
        photoAddrLong = micropubContent.properties.location[0].properties.longitude[0];
    } catch (e) {
        logger.info('NoPhoto longitude link skipping..');
    }
    try {
        photoAddrName = micropubContent.properties.location[0].properties.name[0];
    } catch (e) {
        logger.info('No Photo addrName skipping..');
    }

    // Meta & lat & long might need conditional
    const entry = `---
layout: "${layout}"
title: "${title}"
photo: "${photo}"
date: "${pubDate}"
meta: "Checked in at ${title}"
summary: "${summary}"
category: "${category}"
syndication: "${syndication}"
twitterCard: false
---
${content}
`;
    logger.info('Note content created: ' + entry);
    const micropubContentFormatted = base64.encode(entry);
    return micropubContentFormatted;
};
