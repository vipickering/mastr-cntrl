/* eslint-disable quotes */
/* eslint-disable complexity */
const logger = require(appRootDirectory + '/app/logging/bunyan');
const moment = require('moment');
const tz = require('moment-timezone');
const determineContent = require(appRootDirectory + '/app/micropub/shared/format-content');

exports.replies = function replies(micropubContent) {
    const layout = 'replies';
    const category = 'Replies';
    const pubDate  = moment(new Date()).tz('Pacific/Auckland').format('YYYY-MM-DDTHH:mm:ss');
    const content = determineContent.findContent(micropubContent); // Handle Body Conent
    let replyTo = '';
    let location = '';
    let photoURL = '';
    let photoArray = '';
    let alt = '';
    let tags = '';
    let tagArray = '';
    let twitter = false;
    let syndicateArray = '';

    // Debug
    logger.info('Reply JSON created: ' + JSON.stringify(micropubContent));

    //Reply target
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
        tags += '\n- ';
        tags += 'miscellaneous';
    }

    try {
        location = micropubContent.location;
        if (typeof location === 'undefined') {
            logger.info('Location cannot be found');
            location = '';
        }
    } catch (e) {
        logger.info('No location provided');
        location = '';
    }

    try {
        syndicateArray = micropubContent["mp-syndicate-to"];

        for (let j = 0; j < syndicateArray.length; j++) {
            logger.info(syndicateArray[j]);
            if (syndicateArray[j] == 'https://twitter.com/vincentlistens/'){ twitter = true; }
        }
    } catch (e) {
        logger.info('No Syndication targets');
        twitter = false;
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
location: "${location}"
twitter: ${twitter}
twitterCard: false
---
${content}
`;
    logger.info('Reply formatter finished: ' + entry);
    return entry;
};
