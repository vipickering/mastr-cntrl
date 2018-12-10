const base64 = require('base64it');
const logger = require(appRootDirectory + '/app/functions/bunyan');
const moment = require('moment');
const URI = require('urijs');
const stringEncode = require(appRootDirectory + '/app/functions/stringEncode');

exports.note = function note(micropubContent) {
    const layout = 'notes';
    const category = 'Notes';
    const pubDate  = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss');

    let content = '';
    let replyTo = '';
    let location = '';
    // let photo = '';
    let tags = '';
    let tagArray = '';
    let title = '';
    let syndication = '';
    let replyName = '';
    // let entryMeta= '';

    //Debug
    logger.info('Note JSON: ' + JSON.stringify(micropubContent));

    //Convert to array for quick tests
    const arr = Array.of(micropubContent);
    logger.info(arr);
    // let contentFlag = arr.includes(micropubContent.content);
    // let replyFlag = arr.includes(micropubContent['in-reply-to']);
    // let tagFlag = arr.includes(micropubContent.category);
    // let locationFlag = arr.includes(micropubContent.location);
    // let syndicationFlag = arr.includes(micropubContent['mp-syndicate-to'][0]);
    // logger.info(`Content Flag: ${contentFlag}`);
    // logger.info(`Reply Flag: ${replyFlag}`);
    // logger.info(`Tag Flag: ${tagFlag}`);
    // logger.info(`Location Flag: ${locationFlag}`);
    // logger.info(`Syndication Flag: ${syndicationFlag}`);

    // if (contentFlag) {
    //     logger.info(`Content exists!`);
    // }

    try {
        content = micropubContent.content;
    } catch (e) {
        logger.info('No content skipping');
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

    //Reply targets can accept multiple if hand coded. But we will limit it to a single item array, as this isn't standard functionality.
    try {
        replyTo = micropubContent['in-reply-to'];
    } catch (e) {
        logger.info('Not reply type skipping');
        replyTo = '';
    }

    //Work this out if the flag is true above
    try {
        const uri = new URI(replyTo); // Extend this for other webmention types and match formatter
        if (typeof uri !== 'undefined') {
            replyName = uri.domain();
        }
    } catch (e) {
        logger.info('No Webmention skipping');
        replyTo = '';
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
            location ='';
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

//Make this only output front matter needed.
    let entry = `---
layout: "${layout}"
title: "${title}"
date: "${pubDate}"
target: "${replyTo}"
meta: "${title}"
category: "${category}"
tags:${tags}
syndication: "${syndication}"
location: "${location}"
twitterCard: false
---
${content}
`;
    logger.info('Note content finished: ' + entry);
    // strencode(entry);
    stringEncode.strencode(entry);
    const micropubContentFormatted = base64.encode(entry);
    return micropubContentFormatted;
};
