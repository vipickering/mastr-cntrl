const base64 = require('base64it');
const logger = require('../functions/bunyan');
const moment = require('moment');

/*
{
"type":["h-entry"],
"properties":{
    "content":["Cat made an orange rainbow cake for Sebs birthday \nHe asked for “An orange cake that’s also like a rainbow”"],
    "published":["2018-07-23T17:35:11+00:00"],
    "syndication":["https://www.instagram.com/p/BllS71Fhkuq/"],
    "photo":["https://scontent-sjc3-1.cdninstagram.com/vp/4ed0f9991a0ca2a45348a971031acd55/5C12C638/t51.2885-15/e35/36995041_256400058476372_3966301331764805632_n.jpg"]
    }
*/

exports.checkIn = function checkIn(micropubContent) {
    const layout = 'instagram';
    const category = 'Notes';
    const pubDate = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss+01:00');
    const syndication = micropubContent.properties.syndication[0];
    const checkinName = 'Instagram content ' + pubDate;
    let content = '';
    let photo = '';
    let addrLat = '';
    let addrLong  = '';

    try {
        content = JSON.parse(micropubContent.properties.content[0]);
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
title: "${checkinName}"
photo: "${photo}"
date: "${pubDate}"
meta: "Checked in at ${checkinName}"
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
