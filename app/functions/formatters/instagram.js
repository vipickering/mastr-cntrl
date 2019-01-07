const base64 = require('base64it');
const logger = require(appRootDirectory + '/app/functions/bunyan');
const stringEncode = require(appRootDirectory + '/app/functions/stringEncode');

exports.instagram = function instagram(micropubContent) {
    const layout = 'instagram';
    const category = 'Instagram';
    const pubDate = micropubContent.properties.published[0];
    const syndication = micropubContent.properties.syndication[0];
    const title = micropubContent.properties.content[0].substring(0, 100);
    let content = '';
    let photoURL = '';
    let photoArray = '';
    let alt = '';
    let addrLat = '';
    let addrLong  = '';
    let tagArray = '';
    let tags = '';

    //Debug
    logger.info('Instagram JSON: ' + JSON.stringify(micropubContent));

    try {
        content = micropubContent.properties.content[0];
    } catch (e) {
        logger.info('No content skipping..');
    }
    try {
        photoArray = micropubContent.properties.photo;

         for (let j = 0; j < photoArray.length; j++) {
            photoURL += `photo${j+1}_url: "${photoArray[j].value}"\n`;
            alt += `photo${j+1}_alt: "${photoArray[j].alt}"\n`;
        }
    } catch (e) {
        photoURL = `photo1_url: ""`;
        alt = `photo1_alt: ""`;
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
        tagArray = micropubContent.properties.category;
        for (let i = 0; i < tagArray.length; i++) {
            tags += '\n- ';
            tags += tagArray[i];
        }
    } catch (e) {
        logger.info('No tags skipping');
    }

    const entry = `---
layout: "${layout}"
title: "${title}"
${photoURL}
${alt}
date: "${pubDate}"
meta: "${title}"
category: "${category}"
syndication: "${syndication}"
latitude: "${addrLat}"
longitude: "${addrLong}"
tags:${tags}
twitterCard: false
---
${content}
`;
    logger.info('Instragram formatter finished: ' + entry);
    stringEncode.strencode(entry);
    const micropubContentFormatted = base64.encode(entry);
    return micropubContentFormatted;
};
