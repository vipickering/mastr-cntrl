/* eslint-disable quotes */
/* eslint-disable complexity */
const logger = require(appRootDirectory + '/app/functions/bunyan');
// const stringEncode = require(appRootDirectory + '/app/functions/stringEncode');

exports.checkIn = function checkIn(micropubContent) {
    const layout = 'checkin';
    const category = 'Checkins';
    const rawPubDate = micropubContent.properties.published[0];
    const rawDate = rawPubDate.slice(0, 10);
    const rawTime = rawPubDate.replace(/-/g, ':').slice(11, -9);
    const pubDate = rawDate + 'T' + rawTime;
    const syndication = micropubContent.properties.syndication[0];
    const checkinName = micropubContent.properties.checkin[0].properties.name[0];
    let content = '';
    let photoURL = '';
    let photoArray = '';
    let alt = '';
    let foursquare = '';
    let addrLat = '';
    let addrLong  = '';
    let addrCountry = '';
    let address   = '';
    let locality = '';
    let region = '';

    //Debug
    logger.info('Swarm JSON: ' + JSON.stringify(micropubContent));

    try {
        content = micropubContent.properties.content[0];
    } catch (e) {
        logger.info('No content');
        content = '';
    }

    try {
        photoArray = micropubContent.properties.photo[0];

        for (let j = 0; j < photoArray.length; j++) {
            photoURL += `photo${j+1}_url: "${photoArray[j].value}"\n`;
            alt += `photo${j+1}_alt: "${photoArray[j].alt}"\n`;
        }
    } catch (e) {
        photoURL = `photo1_url: ""`;
        alt = `photo1_alt: ""`;
        logger.info('No photo');
    }

    try {
        foursquare = micropubContent.properties.checkin[0].properties.url[0];
    } catch (e) {
        logger.info('No foursquare');
    }

    try {
        addrLat = micropubContent.properties.checkin[0].properties.latitude[0];
    } catch (e) {
        logger.info('No lattitude');
    }

    try {
        addrLong = micropubContent.properties.checkin[0].properties.longitude[0];
    } catch (e) {
        logger.info('No longitude');
    }

    try {
        locality = micropubContent.properties.checkin[0].properties.locality[0];
    } catch (e) {
        logger.info('No locality');
    }

    try {
        address  = micropubContent.properties.checkin[0].properties.address[0];
    } catch (e) {
        logger.info('No address');
    }

    try {
        region = micropubContent.properties.checkin[0].properties.region[0];
    } catch (e) {
        logger.info('No region');
    }

    try {
        addrCountry = micropubContent.properties.checkin[0].properties['country-name'][0];
    } catch (e) {
        logger.info('No country link skipping..');
    }

    const entry = `---
layout: "${layout}"
title: "${checkinName}"
${photoURL}
${alt}
date: "${pubDate}"
meta: "Checked in at ${checkinName}"
category: "${category}"
syndication: "${syndication}"
foursquare: "${foursquare}"
latitude: "${addrLat}"
longitude: "${addrLong}"
address: "${address}"
locality: "${locality}"
region: "${region}"
country: "${addrCountry}"
twitterCard: false
---
${content}
`;
    logger.info('Swarm formatter finished: ' + entry);
    // stringEncode.strencode(entry);
    return entry;
};
