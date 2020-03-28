const logger = require(appRootDirectory + '/app/logging/bunyan');
const functionPath = '/app/micropub/process-data/';
const handlePhotos = require(appRootDirectory + functionPath + 'photos');
const handleAltText = require(appRootDirectory + functionPath + 'alt-text');
const handleContent = require(appRootDirectory + functionPath + 'content');

exports.checkIn = function checkIn(micropubContent) {
    logger.info('Checkin JSON received: ' + JSON.stringify(micropubContent));

    const alt = handleAltText.formatAltText(micropubContent);
    const photoURL = handlePhotos.formatPhotos(micropubContent);
    const rawPubDate = micropubContent.properties.published[0];
    const rawDate = rawPubDate.slice(0, 10);
    const rawTime = rawPubDate.replace(/-/g, ':').slice(11, -9);
    const pubDate = rawDate + 'T' + rawTime;
    const syndication = micropubContent.properties.syndication[0];
    const checkinName = micropubContent.properties.checkin[0].properties.name[0];
    const content = handleContent.formatContent(micropubContent);
    let foursquare = '';
    let addrLat = '';
    let addrLong  = '';
    let addrCountry = '';
    let address   = '';
    let locality = '';
    let region = '';

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
        logger.info('No country link');
    }

    const entry = `---
title: "${checkinName}"
${photoURL}
${alt}
date: "${pubDate}"
meta: "Checked in at ${checkinName}"
syndication: "${syndication}"
foursquare: "${foursquare}"
latitude: "${addrLat}"
longitude: "${addrLong}"
address: "${address}"
locality: "${locality}"
region: "${region}"
country: "${addrCountry}"
---
${content}
`;
    logger.info('Swarm formatter finished: ' + entry);
    return entry;
};
