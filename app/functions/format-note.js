const base64 = require('base64it');
const logger = require(appRootDirectory + '/app/functions/bunyan');
const moment = require('moment');
const URI = require('urijs');

exports.note = function note(micropubContent) {
    const layout = 'notes';
    const category = 'Notes';
    const pubDate  = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss+01:00');

    let content = '';
    let replyTo = '';
    let location = '';
    // let photo = '';
    let tags = '';
    let tagArray = '';
    let title = '';
    let syndication = '';
    let replyName = '';
    let entryMeta= '';

    //Debug
    logger.info('Note JSON: ' + JSON.stringify(micropubContent));

    function strencode (data) {
        return encodeURIComponent(JSON.stringify(data)).replace(/[!'()*]/g, escape);
    }

    try {
        content = micropubContent.content;
    } catch (e) {
        logger.info(e);
        logger.info('No content skipping');
        content = '';
    }

    try {
        title = micropubContent.content.substring(0, 100);
    } catch (e) {
        logger.info(e);
        logger.info('No title skipping');
        title = 'Note for ' + pubDate;
    }

    try {
        replyTo = micropubContent['in-reply-to'];
    } catch (e) {
        logger.info(e);
        logger.info('Not reply type skipping');
        replyTo = '';
    }

    try {
        const uri = new URI(replyTo);
        if (typeof uri !== 'undefined') {
            replyName = uri.domain();
        }
    } catch (e) {
        logger.info(e);
        logger.info('No reply name skipping');
        replyTo = '';
    }

    try {
        tagArray = micropubContent.category;
        for (let i = 0; i < tagArray.length; i++) {
            tags += tagArray[i];
            tags += ' ';
        }
    } catch (e) {
        logger.info(e);
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
        logger.info(e);
        logger.info('No location skipping');
        location = '';
    }

    try {
        syndication = micropubContent['mp-syndicate-to'][0];
    } catch (e) {
        logger.info(e);
        logger.info('No Syndication skipping');
        syndication = '';
    }

    let entry = `---
layout: "${layout}"
title: "${title}"
date: "${pubDate}"
replyUrl: "${replyTo}"
replyName: "${replyName}"
meta: "${title}"
category: "${category}"
tags:  "${tags}"
syndication: "${syndication}"
location: "${location}"
twitterCard: false
---
${content}
`;

    logger.info('Note content finished: ' + entry);
    strencode(entry);
    const micropubContentFormatted = base64.encode(entry);
    return micropubContentFormatted;
};
