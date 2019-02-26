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
    let syndication = '';

    //Debug
    logger.info('Reply JSON: ' + JSON.stringify(micropubContent));

     // Sometimes Quill is sending JSON in different structures, depending upon including images.
    // Try each method to make sure we capture the data
    try {
        content = micropubContent.content;
    } catch (e) {
        logger.info('No content micropubContent.content');
    }

    try {
        content = micropubContent.properties.content[0];
    } catch (e) {
        logger.info('No content micropubContent.properties.content[0]');
    }

   //Reply targets can accept multiple if hand coded. But we will limit it to a single item array, as this isn't standard functionality.
    try {
        replyTo = micropubContent['in-reply-to'];
    } catch (e) {
        logger.info('Reply contains no URL');
        replyTo = '';
    }

   try {
        photoArray = micropubContent.properties.photo;

         for (let j = 0; j < photoArray.length; j++) {
            photoURL += `photo${j+1}_url: "${photoArray[j].value}"\n`;
            alt += `photo${j+1}_alt: "${photoArray[j].alt}"\n`;
        }
    } catch (e) {
        logger.info('No photo provided');
        photoURL = `photo1_url: ""`;
        alt = `photo1_alt: ""`;
    }

    try {
        tagArray = micropubContent.category;
        for (let i = 0; i < tagArray.length; i++) {
            tags += '\n- ';
            tags += tagArray[i];
        }
    } catch (e) {
        logger.info('No tags provided assigning miscellaneous');
        tagArray = 'miscellaneous';
    }

try {
        location = micropubContent.location;
         if (typeof location === 'undefined') {
            logger.info('Location cannot be determind');
            location = '';
        }
    } catch (e) {
        logger.info('No location provided');
        location = '';
    }

    try {
        syndicationArray = micropubContent['mp-syndicate-to'];
        for (let i = 0; i < syndicationArray.length; i++) {
            syndication += '\n- ';
            syndication += syndicationArray[i];
        }
    } catch (e) {
        logger.info('No Syndication provided');
        syndicationArray = '';
    }

    const entry = `---
layout: "${layout}"
title: "reply posted on ${pubDate} to ${replyTo}"
date: "${pubDate}"
target: "${replyTo}"
meta: "reply posted on ${pubDate} to ${replyTo}"
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
