const base64 = require('base64it');
const logger = require('../functions/bunyan');

exports.note = function note(micropubContent) {
    const layout = 'checkin';
    const summary = '';
    const category = 'Checkins';
    const photo = micropubContent.properties.photo[0];
    const rawPubDate = micropubContent.properties.published[0];
    const rawDate = rawPubDate.slice(0, 10);
    const rawTime = rawPubDate.replace(/:/g, '-').slice(11, -9); //https://stackoverflow.com/questions/16576983/replace-multiple-characters-in-one-replace-call
    const pubDate = rawDate + ' ' + rawTime + ' +/-GMT';
    const content = micropubContent.properties.content[0];
    const syndication = micropubContent.properties.syndication[0];
    const checkinName = 'Checked in at ' + micropubContent.properties.checkin[0].properties.name[0];
    const foursquare = micropubContent.properties.checkin[0].properties.url[0];
    const addrLat = micropubContent.properties.checkin[0].properties.lattitude[0];
    const addrLong = micropubContent.properties.checkin[0].properties.longitude[0];
    const addrCountry = micropubContent.properties.checkin[0].properties.country-name[0];
    const address  = micropubContent.properties.checkin[0].properties.address[0];
    const locality = micropubContent.properties.checkin[0].properties.locality[0];
    const region = micropubContent.properties.checkin[0].properties.region[0];
    const entry = `---
layout: "${layout}"
title: "${checkinName}"
photo: "${photo}"
date: "${pubDate}"
meta: "${checkinName}"
summary: "${summary}"
category: "${category}"
syndication: "${syndication}"
foursquare: "${foursquare}"
latitude: "${addrLat}"
longitude: "${addrLong}"
street-address: "${address}"
locality: "${locality}"
region: "${region}"
country-name: "${addrCountry}"
twitterCard: false
---
${content}
`;
    logger.info('swarm content: ' + entry);
    const micropubContentFormatted = base64.encode(entry);
    return micropubContentFormatted;
};
