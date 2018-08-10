const base64 = require('base64it');
const logger = require(appRootDirectory + '/app/functions/bunyan');
const moment = require('moment');

exports.note = function note(micropubContent) {
    const layout = 'notes';
    const category = 'Notes';
    const pubDate  = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss+01:00');

    let content = '';
    let inReplyTo = '';
    let location = '';
    let photo = '';
    let tags = '';
    let tagArray = '';
    let title = '';
    let syndication = '';

    try {
        content = micropubContent.content;
    } catch (e) {
        logger.info('No content skipping');
    }

    try {
        title = micropubContent.content.substring(0, 100);
    } catch (e) {
        logger.info('No title skipping');
    }

    try {
        tagArray = micropubContent.category;
        for (let i = 0; i < tagArray.length; i++) {
            tags += tagArray[i];
            tags += ' ';
        }
    } catch (e) {
        logger.info('No tags skipping');
    }

    try {
        location = micropubContent.location;
    } catch (e) {
        logger.info('No location skipping');
    }

    try {
        syndication = micropubContent['mp-syndicate-to'][0];
    } catch (e) {
        logger.info('No Syndication skipping');
    }

//Photo and location not being supported. I have no need for them.

    const entry = `---
layout: "${layout}"
title: "${title}"
date: "${pubDate}"
meta: "${title}"
category: "${category}"
tags:  "${tags}"
syndication:  "${syndication}"
twitterCard: false
---
${content}
`;
    logger.info('Note content created: ' + entry);
    JSON.stringify(entry);
    const micropubContentFormatted = base64.encode(entry);
    return micropubContentFormatted;
};
