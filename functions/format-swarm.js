const base64 = require('base64it');
const logger = require('../functions/bunyan');
const checkJSON = require('../functions/does-key-exist');

exports.checkIn = function checkIn(micropubContent) {
    const layout = 'checkin';
    const summary = '';
    const category = 'Checkins';
    const rawPubDate = micropubContent.properties.published[0];
    const rawDate = rawPubDate.slice(0, 10);
    const rawTime = rawPubDate.replace(/:/g, '-').slice(11, -9); //https://stackoverflow.com/questions/16576983/replace-multiple-characters-in-one-replace-call
    const pubDate = rawDate + ' ' + rawTime + ' +/-GMT';
    const content = micropubContent.properties.content[0];
    const syndication = micropubContent.properties.syndication[0];
    const checkinName = 'Checked in at ' + micropubContent.properties.checkin[0].properties.name[0];
    let photo = '';
    let foursquare = '';
    let addrLat = '';
    let addrLong  = '';
    let addrCountry  = '';
    let address   = '';
    let locality = '';
    let region = '';
    //https://stackoverflow.com/questions/2313630/ajax-check-if-a-string-is-json
    // Look at try-catch or promise instead.
    try { photo = micropubContent.properties.photo[0]; } catch(e) { console.log('No photo skipping..'); }
    try { foursquare = micropubContent.properties.checkin[0].properties.url[0]; } catch(e) { console.log('No foursquare link skipping..'); }
    try { addrLat = micropubContent.properties.checkin[0].properties.latitude[0]; } catch(e) { console.log('No lttitude link skipping..'); }
    try { addrLong = micropubContent.properties.checkin[0].properties.longitude[0]; } catch(e) { console.log('No longitude link skipping..'); }
    try { locality = micropubContent.properties.checkin[0].properties.locality[0]; } catch(e) { console.log('No locality link skipping..'); }
    try { region = micropubContent.properties.checkin[0].properties.region[0];} catch(e) { console.log('No region link skipping..'); }

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
address: "${address}"
locality: "${locality}"
region: "${region}"
country: "${addrCountry}"
twitterCard: false
---
${content}
`;
    logger.info('swarm content: ' + entry);
    // const temp = JSON.stringify(entry);
    const micropubContentFormatted = base64.encode(entry);
    return micropubContentFormatted;
};
