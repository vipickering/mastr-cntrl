const base64 = require('base64it');
const logger = require(appRootDirectory + '/app/functions/bunyan');
const moment = require('moment');
const stringEncode = require(appRootDirectory + '/app/functions/stringEncode');

exports.note = function note(micropubContent) {
    const layout = 'notes';
    const category = 'Notes';
    const pubDate  = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss');

    let content = '';
    let location = '';
    let photoURL = '';
    let photoArray = '';
    let alt = '';
    let tags = '';
    let tagArray = '';
    let title = '';
    let syndication = '';

    //Debug
    logger.info('Note JSON: ' + JSON.stringify(micropubContent));

    try {
        content = micropubContent.content;
    } catch (e) {
        logger.info('No Content. Ending');
        content = '';
        res.status(400);
        res.send('content is empty');
    }

    try {
        title = micropubContent.content.substring(0, 100);
    } catch (e) {
        logger.info('No title skipping');
        title = 'Note for ' + pubDate;
    }

    // Add logging around photo array.
    // The photo and alt tag are not extracted correctly.
    try {
        photoArray = micropubContent.properties.photo;

        for (let j = 0; j < photoArray.length; j++) {
            photoURL += '\n- ';
            photoURL += photoArray[j].value;
            alt += '\n- ';
            alt +=photoArray[j].alt;
        }
    } catch (e) {
        logger.info(e);
        logger.info('No photo skipping..');
    }

    try {
        tagArray = micropubContent.category;
        for (let i = 0; i < tagArray.length; i++) {
            tags += '\n- ';
            tags += tagArray[i];
        }
    } catch (e) {
        logger.info('No tags skipping');
        tagArray = 'miscellaneous';
    }

    try {
        location = micropubContent.location;
        if (typeof location === 'undefined') {
            logger.info('No location provided');
            location = '';
        }
    } catch (e) {
        logger.info('No location skipping');
        location = '';
    }

    try {
        syndication = micropubContent['mp-syndicate-to'][0];
    } catch (e) {
        logger.info('No Syndication skipping');
        syndication = '';
    }

    const entry = `---
layout: "${layout}"
title: "${title}"
date: "${pubDate}"
meta: "${title}"
category: "${category}"
photo:${photoURL}
alt:${alt}
tags:${tags}
syndication: "${syndication}"
location: "${location}"
twitterCard: false
---
${content}
`;
    logger.info('Note formatter finished: ' + entry);
    stringEncode.strencode(entry);
    const micropubContentFormatted = base64.encode(entry);
    return micropubContentFormatted;
};
