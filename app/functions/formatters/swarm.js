const base64 = require('base64it');
const logger = require(appRootDirectory + '/app/functions/bunyan');
const stringEncode = require(appRootDirectory + '/app/functions/stringEncode');

exports.checkIn = function checkIn(micropubContent) {
    const layout = 'checkin';
    const category = 'Checkins';
    const rawPubDate = micropubContent.properties.published[0];
    const rawDate = rawPubDate.slice(0, 10);
    const rawTime = rawPubDate.replace(/-/g, ':').slice(11, -9);
    const pubDate = rawDate + ' ' + rawTime + ' +/-GMT';
    const syndication = micropubContent.properties.syndication[0];
    const checkinName = micropubContent.properties.checkin[0].properties.name[0];
    let content = '';
    let photo = '';
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
        logger.info(e);
        logger.info('No content skipping..');
    }

    try {
        photo = micropubContent.properties.photo[0];
    } catch (e) {
        logger.info(e);
        logger.info('No photo skipping..');
    }

    try {
        foursquare = micropubContent.properties.checkin[0].properties.url[0];
    } catch (e) {
        logger.info(e);
        logger.info('No foursquare link skipping..');
    }

    try {
        addrLat = micropubContent.properties.checkin[0].properties.latitude[0];
    } catch (e) {
        logger.info(e);
        logger.info('No lattitude link skipping..');
    }

    try {
        addrLong = micropubContent.properties.checkin[0].properties.longitude[0];
    } catch (e) {
        logger.info(e);
        logger.info('No longitude link skipping..');
    }

    try {
        locality = micropubContent.properties.checkin[0].properties.locality[0];
    } catch (e) {
        logger.info(e);
        logger.info('No locality link skipping..');
    }

    try {
        address  = micropubContent.properties.checkin[0].properties.address[0];
    } catch (e) {
        logger.info(e);
        logger.info('No address link skipping..');
    }

    try {
        region = micropubContent.properties.checkin[0].properties.region[0];
    } catch (e) {
        logger.info(e);
        logger.info('No region link skipping..');
    }

    try {
        addrCountry = micropubContent.properties.checkin[0].properties['country-name'][0];
    } catch (e) {
        logger.info(e);
        logger.info('No country link skipping..');
    }

    const entry = `---
layout: "${layout}"
title: "${checkinName}"
photo: "${photo}"
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
    logger.info('Swarm content: ' + entry);
    stringEncode.strencode(entry);
    const micropubContentFormatted = base64.encode(entry);
    return micropubContentFormatted;
};
