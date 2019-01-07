const base64 = require('base64it');
const logger = require(appRootDirectory + '/app/functions/bunyan');
const moment = require('moment');
const stringEncode = require(appRootDirectory + '/app/functions/stringEncode');

exports.replies = function replies(micropubContent) {
    const layout = 'replies';
    const category = 'Replies';
    const pubDate  = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss');

    let content = '';
    let replyTo = '';
    let location = '';
    let photoURL = '';
    let photoArray = '';
    let alt = '';
    let tags = '';
    let tagArray = '';
    let title = '';
    let syndication = '';

    //Debug
    logger.info('Reply JSON: ' + JSON.stringify(micropubContent));

    try {
        content = micropubContent.content;
    } catch (e) {
        logger.info('No content skipping');
        content = '';
    }

    try {
        title = micropubContent.content.substring(0, 100);
    } catch (e) {
        logger.info('No title skipping');
        title = 'Note for ' + pubDate;
    }

    //Reply targets can accept multiple if hand coded. But we will limit it to a single item array, as this isn't standard functionality.
    try {
        replyTo = micropubContent['in-reply-to'];
    } catch (e) {
        logger.info('Reply contains no URL');
        replyTo = '';
    }

    try {
        photoArray = micropubContent.photo;

         for (let j = 0; j < photoArray.length; j++) {
            photoURL += `photo${j+1}_url: "${photoArray[j].value}"\n`;
            alt += `photo${j+1}_alt: "${photoArray[j].alt}"\n`;
        }
    } catch (e) {
        logger.info(e);
        photoURL = `photo1:_url ''`;
        alt = `photo1_alt: ''`;
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
target: "${replyTo}"
meta: "${title}"
category: "${category}"
${photoURL}
${alt}
tags:${tags}
syndication: "${syndication}"
location: "${location}"
twitterCard: false
---
${content}
`;
    logger.info('Reply formatter finished: ' + entry);
    stringEncode.strencode(entry);
    const micropubContentFormatted = base64.encode(entry);
    return micropubContentFormatted;
};
